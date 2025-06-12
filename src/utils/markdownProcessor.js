/**
 * Simple markdown to HTML converter
 * Supports basic markdown syntax with security considerations
 */
export class MarkdownProcessor {
  constructor() {
    this.rules = [
      // Headers
      { pattern: /^### (.*$)/gim, replacement: '<h3>$1</h3>' },
      { pattern: /^## (.*$)/gim, replacement: '<h2>$1</h2>' },
      { pattern: /^# (.*$)/gim, replacement: '<h1>$1</h1>' },
      
      // Bold and Italic
      { pattern: /\*\*\*(.*?)\*\*\*/g, replacement: '<strong><em>$1</em></strong>' },
      { pattern: /\*\*(.*?)\*\*/g, replacement: '<strong>$1</strong>' },
      { pattern: /\*(.*?)\*/g, replacement: '<em>$1</em>' },
      
      // Code
      { pattern: /```([\s\S]*?)```/g, replacement: '<pre><code>$1</code></pre>' },
      { pattern: /`(.*?)`/g, replacement: '<code>$1</code>' },
      
      // Links
      { pattern: /\[([^\]]+)\]\(([^)]+)\)/g, replacement: '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>' },
      
      // Lists
      { pattern: /^\* (.*$)/gim, replacement: '<li>$1</li>' },
      { pattern: /^\d+\. (.*$)/gim, replacement: '<li>$1</li>' },
      
      // Line breaks
      { pattern: /\n\n/g, replacement: '<br><br>' },
      { pattern: /\n/g, replacement: '<br>' },
      
      // Blockquotes
      { pattern: /^> (.*$)/gim, replacement: '<blockquote>$1</blockquote>' }
    ];
  }

  /**
   * Convert markdown to HTML
   * @param {string} markdown - Markdown text
   * @returns {string} - HTML output
   */
  toHtml(markdown) {
    if (!markdown || typeof markdown !== 'string') return '';
    
    let html = markdown;
    
    // Apply all markdown rules
    this.rules.forEach(rule => {
      html = html.replace(rule.pattern, rule.replacement);
    });
    
    // Wrap list items in ul/ol tags
    html = this.wrapLists(html);
    
    return html.trim();
  }

  /**
   * Wrap consecutive list items in proper list tags
   * @param {string} html - HTML with list items
   * @returns {string} - HTML with wrapped lists
   */
  wrapLists(html) {
    // Wrap consecutive <li> tags in <ul>
    html = html.replace(/(<li>.*?<\/li>)(\s*<li>.*?<\/li>)*/g, (match) => {
      return `<ul>${match}</ul>`;
    });
    
    return html;
  }

  /**
   * Check if text contains markdown syntax
   * @param {string} text - Text to check
   * @returns {boolean} - Contains markdown
   */
  hasMarkdown(text) {
    const markdownPatterns = [
      /\*\*.*?\*\*/, // Bold
      /\*.*?\*/, // Italic
      /`.*?`/, // Code
      /\[.*?\]\(.*?\)/, // Links
      /^#{1,6}\s/, // Headers
      /^\* /, // Lists
      /^\d+\. /, // Numbered lists
      /^> / // Blockquotes
    ];
    
    return markdownPatterns.some(pattern => pattern.test(text));
  }
}

export const markdownProcessor = new MarkdownProcessor();