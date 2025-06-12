import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { EmbeddedChat } from './components/EmbeddedChat';
import { streamingHandler } from './utils/streamingHandler';
import './index.css';

const initialMessages = [
  {
    id: '1',
    content: "<p>Hi! I'm your AI assistant with <strong>HTML streaming support</strong>.</p><p>How can I help you today?</p>",
    sender: {
      id: 'bot',
      name: 'AI Assistant',
      avatar: '',
      status: 'online'
    },
    timestamp: new Date(),
    read: true,
    reactions: [],
    attachments: [],
    edited: false,
    isHtml: true,
    typewriterComplete: true,
  }
];

// Get configuration from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const title = urlParams.get('title') || 'AI Assistant';
const subtitle = urlParams.get('subtitle') || 'Always here to help';
const position = urlParams.get('position') || 'bottom-right';
const enableStreaming = urlParams.get('streaming') !== 'false'; // Default to true
const theme = {
  primaryColor: urlParams.get('primaryColor') || 'from-indigo-500 to-purple-500',
  secondaryColor: urlParams.get('secondaryColor') || 'from-pink-500 to-rose-500',
  buttonColor: urlParams.get('buttonColor') || 'from-indigo-500 to-purple-500',
};

// Enhanced mock responses for embedded chat with HTML support
const EMBEDDED_HTML_RESPONSES = [
  "<p>Thanks for your message!</p><p>I'm an <strong>embedded assistant</strong> with full HTML support.</p><p>I can help you with:</p><ul><li>Quick questions</li><li>Information lookup</li><li>General assistance</li></ul>",
  
  "<p>I received your message and I'm here to help!</p><p>This embedded chat supports:</p><ol><li><strong>Real-time streaming</strong></li><li><em>HTML formatting</em></li><li><code>Secure content processing</code></li></ol><p><small>All responses are processed safely.</small></p>",
  
  "<p>Hello! Let me assist you with that.</p><blockquote><p>This is an example of a blockquote in the embedded chat.</p></blockquote><p>I can process various content types including <strong>HTML</strong>, <em>markdown</em>, and plain text.</p><p>What else would you like to know?</p>",
  
  "<p>Great question!</p><p>Here's some <strong>helpful information</strong>:</p><p>The embedded chat includes:</p><ul><li>HTML streaming support</li><li>Typewriter effects</li><li>Loading indicators</li><li>Error handling</li></ul><p>Try asking me anything!</p>"
];

const handleMessage = async (message) => {
  // Post message to parent window if in iframe
  if (window.parent !== window) {
    window.parent.postMessage({ type: 'chat-message', message }, '*');
  }
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return HTML response for streaming
  const randomResponse = EMBEDDED_HTML_RESPONSES[Math.floor(Math.random() * EMBEDDED_HTML_RESPONSES.length)];
  return randomResponse;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <EmbeddedChat
      initialMessages={initialMessages}
      position={position}
      title={title}
      subtitle={subtitle}
      theme={theme}
      onSendMessage={handleMessage}
      isEmbedded={true}
    />
  </StrictMode>
);