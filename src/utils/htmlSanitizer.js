import DOMPurify from 'dompurify';

// Configure DOMPurify for safe HTML rendering
const createDOMPurifyConfig = () => ({
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 'i', 'b', 'span', 'div',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'a', 'img',
    'blockquote', 'code', 'pre',
    'table', 'thead', 'tbody', 'tr', 'th', 'td'
  ],
  ALLOWED_ATTR: [
    'href', 'title', 'alt', 'src', 'width', 'height',
    'class', 'id', 'style',
    'target', 'rel'
  ],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|xxx):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  ADD_ATTR: ['target'],
  FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'button'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  KEEP_CONTENT: true,
  RETURN_DOM_FRAGMENT: false,
  RETURN_DOM: false,
  SANITIZE_DOM: true
});

export class HTMLSanitizer {
  constructor() {
    this.config = createDOMPurifyConfig();
    this.isClient = typeof window !== 'undefined';
  }

  /**
   * Sanitize HTML content to prevent XSS attacks
   * @param {string} html - Raw HTML content
   * @returns {string} - Sanitized HTML
   */
  sanitize(html) {
    if (!this.isClient || !html) return html;
    
    try {
      return DOMPurify.sanitize(html, this.config);
    } catch (error) {
      console.error('HTML sanitization failed:', error);
      return this.escapeHtml(html);
    }
  }

  /**
   * Escape HTML entities as fallback
   * @param {string} text - Text to escape
   * @returns {string} - Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Validate if content is safe HTML
   * @param {string} html - HTML to validate
   * @returns {boolean} - Is safe
   */
  isSafeHtml(html) {
    if (!this.isClient || !html) return true;
    
    const sanitized = this.sanitize(html);
    return sanitized === html;
  }

  /**
   * Add custom allowed tags and attributes
   * @param {Object} options - Custom configuration
   */
  addAllowedElements(options = {}) {
    if (options.tags) {
      this.config.ALLOWED_TAGS = [...this.config.ALLOWED_TAGS, ...options.tags];
    }
    if (options.attributes) {
      this.config.ALLOWED_ATTR = [...this.config.ALLOWED_ATTR, ...options.attributes];
    }
  }
}

export const htmlSanitizer = new HTMLSanitizer();