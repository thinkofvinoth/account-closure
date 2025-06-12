import { htmlSanitizer } from './htmlSanitizer';
import { markdownProcessor } from './markdownProcessor';

/**
 * Content type detection and processing
 */
export class ContentProcessor {
  /**
   * Detect content type
   * @param {string} content - Content to analyze
   * @returns {string} - Content type: 'html', 'markdown', or 'text'
   */
  detectContentType(content) {
    if (!content) return 'text';
    
    // Check for HTML tags
    if (/<[^>]+>/.test(content)) {
      return 'html';
    }
    
    // Check for markdown syntax
    if (markdownProcessor.hasMarkdown(content)) {
      return 'markdown';
    }
    
    return 'text';
  }

  /**
   * Process content based on its type
   * @param {string} content - Raw content
   * @param {string} type - Content type override
   * @returns {Object} - Processed content with metadata
   */
  processContent(content, type = null) {
    const detectedType = type || this.detectContentType(content);
    let processedContent = content;
    let isHtml = false;

    switch (detectedType) {
      case 'html':
        processedContent = htmlSanitizer.sanitize(content);
        isHtml = true;
        break;
      
      case 'markdown':
        processedContent = markdownProcessor.toHtml(content);
        processedContent = htmlSanitizer.sanitize(processedContent);
        isHtml = true;
        break;
      
      case 'text':
      default:
        // Convert line breaks to HTML for consistent rendering
        processedContent = content.replace(/\n/g, '<br>');
        isHtml = true;
        break;
    }

    return {
      content: processedContent,
      originalContent: content,
      type: detectedType,
      isHtml,
      isSafe: htmlSanitizer.isSafeHtml(processedContent)
    };
  }
}

/**
 * Advanced streaming response handler
 */
export class StreamingHandler {
  constructor(options = {}) {
    this.options = {
      chunkDelay: 30, // ms between characters
      responseDelay: 800, // ms between response chunks
      maxRetries: 3,
      timeout: 30000, // 30 seconds
      enableMarkdown: true,
      enableHtml: true,
      ...options
    };
    
    this.contentProcessor = new ContentProcessor();
    this.activeStreams = new Map();
    this.messageHistory = [];
  }

  /**
   * Start streaming a response
   * @param {string} messageId - Unique message identifier
   * @param {Array|string} responses - Response chunks or single response
   * @param {Function} onUpdate - Callback for content updates
   * @param {Function} onComplete - Callback for completion
   * @param {Function} onError - Callback for errors
   * @returns {Promise} - Streaming promise
   */
  async startStreaming(messageId, responses, onUpdate, onComplete, onError) {
    try {
      // Ensure responses is an array
      const responseChunks = Array.isArray(responses) ? responses : [responses];
      
      // Initialize streaming state
      const streamState = {
        id: messageId,
        chunks: responseChunks,
        currentChunk: 0,
        currentChar: 0,
        fullContent: '',
        isActive: true,
        startTime: Date.now()
      };
      
      this.activeStreams.set(messageId, streamState);
      
      // Start the streaming process
      await this.processStreamingChunks(streamState, onUpdate, onComplete, onError);
      
    } catch (error) {
      console.error('Streaming error:', error);
      if (onError) onError(error);
    }
  }

  /**
   * Process streaming chunks
   * @private
   */
  async processStreamingChunks(streamState, onUpdate, onComplete, onError) {
    const { id, chunks } = streamState;
    
    try {
      for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
        if (!this.activeStreams.has(id)) break; // Stream was cancelled
        
        const chunk = chunks[chunkIndex];
        const processedChunk = this.contentProcessor.processContent(chunk);
        
        // Add separator between chunks (except for first chunk)
        if (chunkIndex > 0) {
          streamState.fullContent += '<br><br>';
          if (onUpdate) {
            onUpdate({
              content: streamState.fullContent,
              isStreaming: true,
              progress: chunkIndex / chunks.length,
              chunkIndex,
              totalChunks: chunks.length
            });
          }
          await this.delay(this.options.responseDelay);
        }
        
        // Stream characters of current chunk
        await this.streamChunkCharacters(
          streamState, 
          processedChunk.originalContent, 
          chunkIndex, 
          chunks.length, 
          onUpdate
        );
      }
      
      // Streaming complete
      const finalProcessedContent = this.contentProcessor.processContent(streamState.fullContent);
      
      // Add to message history
      this.messageHistory.push({
        id,
        content: finalProcessedContent.content,
        originalContent: streamState.fullContent,
        timestamp: new Date(),
        processingTime: Date.now() - streamState.startTime
      });
      
      this.activeStreams.delete(id);
      
      if (onComplete) {
        onComplete({
          content: finalProcessedContent.content,
          originalContent: streamState.fullContent,
          isStreaming: false,
          type: finalProcessedContent.type,
          isHtml: finalProcessedContent.isHtml,
          isSafe: finalProcessedContent.isSafe
        });
      }
      
    } catch (error) {
      this.activeStreams.delete(id);
      if (onError) onError(error);
    }
  }

  /**
   * Stream individual characters of a chunk
   * @private
   */
  async streamChunkCharacters(streamState, chunkContent, chunkIndex, totalChunks, onUpdate) {
    for (let charIndex = 0; charIndex < chunkContent.length; charIndex++) {
      if (!this.activeStreams.has(streamState.id)) break;
      
      streamState.fullContent += chunkContent[charIndex];
      
      if (onUpdate) {
        onUpdate({
          content: streamState.fullContent,
          isStreaming: true,
          progress: (chunkIndex + (charIndex / chunkContent.length)) / totalChunks,
          chunkIndex,
          totalChunks,
          charIndex,
          chunkLength: chunkContent.length
        });
      }
      
      await this.delay(this.options.chunkDelay);
    }
  }

  /**
   * Cancel an active stream
   * @param {string} messageId - Message ID to cancel
   */
  cancelStream(messageId) {
    if (this.activeStreams.has(messageId)) {
      this.activeStreams.delete(messageId);
      return true;
    }
    return false;
  }

  /**
   * Cancel all active streams
   */
  cancelAllStreams() {
    const cancelledCount = this.activeStreams.size;
    this.activeStreams.clear();
    return cancelledCount;
  }

  /**
   * Get streaming status
   * @param {string} messageId - Message ID
   * @returns {Object|null} - Stream status
   */
  getStreamStatus(messageId) {
    const stream = this.activeStreams.get(messageId);
    if (!stream) return null;
    
    return {
      id: stream.id,
      isActive: stream.isActive,
      progress: stream.currentChunk / stream.chunks.length,
      currentChunk: stream.currentChunk,
      totalChunks: stream.chunks.length,
      elapsedTime: Date.now() - stream.startTime
    };
  }

  /**
   * Get message history
   * @returns {Array} - Message history
   */
  getMessageHistory() {
    return [...this.messageHistory];
  }

  /**
   * Clear message history
   */
  clearHistory() {
    this.messageHistory = [];
  }

  /**
   * Utility delay function
   * @private
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Handle connection errors and retries
   * @private
   */
  async handleConnectionError(error, retryCount = 0) {
    console.error(`Connection error (attempt ${retryCount + 1}):`, error);
    
    if (retryCount < this.options.maxRetries) {
      const backoffDelay = Math.pow(2, retryCount) * 1000; // Exponential backoff
      await this.delay(backoffDelay);
      return true; // Retry
    }
    
    return false; // Max retries reached
  }
}

// Export singleton instance
export const streamingHandler = new StreamingHandler();