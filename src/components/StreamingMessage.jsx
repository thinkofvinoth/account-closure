import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Wifi, WifiOff } from 'lucide-react';

export const StreamingMessage = ({ 
  message, 
  isStreaming, 
  progress = 0, 
  error = null,
  onRetry = null 
}) => {
  const contentRef = useRef(null);

  // Auto-scroll to bottom when content updates
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [message]);

  // Format message content for display
  const formatMessage = (text) => {
    if (!text) return [];
    return text.split(/<br\s*\/?>/gi).filter(line => line.trim() !== '');
  };

  const lines = formatMessage(message);

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50/50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800/50"
      >
        <div className="flex items-start space-x-3">
          <WifiOff className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-sm text-red-700 dark:text-red-300 mb-2">
              Connection error occurred
            </div>
            <div className="text-xs text-red-600 dark:text-red-400 mb-3">
              {error.message || 'Failed to receive response'}
            </div>
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-3 py-1 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-50/50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800/50"
    >
      {/* Header with status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {isStreaming ? (
            <>
              <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                Streaming response...
              </span>
            </>
          ) : (
            <>
              <Wifi className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                Complete
              </span>
            </>
          )}
        </div>
        
        {/* Progress indicator */}
        {isStreaming && progress > 0 && (
          <div className="flex items-center space-x-2">
            <div className="w-16 h-1 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-blue-500 rounded-full"
              />
            </div>
            <span className="text-xs text-blue-500 font-mono">
              {Math.round(progress * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* Content area */}
      <div 
        ref={contentRef}
        className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 dark:scrollbar-thumb-blue-600"
      >
        <div className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed space-y-3">
          {lines.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="block"
              dangerouslySetInnerHTML={{ __html: line.trim() }}
            />
          ))}
          
          {/* Streaming cursor */}
          {isStreaming && (
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-block w-2 h-4 bg-blue-500 ml-1 rounded-sm"
              aria-label="Typing indicator"
            />
          )}
        </div>
      </div>

      {/* Accessibility announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isStreaming ? 'AI is typing a response' : 'Response complete'}
      </div>
    </motion.div>
  );
};