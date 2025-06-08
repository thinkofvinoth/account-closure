import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { EmbeddedChat } from './components/EmbeddedChat';
import './index.css';

const initialMessages = [
  {
    id: '1',
    content: "Hi! I'm your AI assistant. How can I help you today?",
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
  }
];

// Get configuration from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const title = urlParams.get('title') || 'AI Assistant';
const subtitle = urlParams.get('subtitle') || 'Always here to help';
const position = urlParams.get('position') || 'bottom-right';
const theme = {
  primaryColor: urlParams.get('primaryColor') || 'from-indigo-500 to-purple-500',
  secondaryColor: urlParams.get('secondaryColor') || 'from-pink-500 to-rose-500',
  buttonColor: urlParams.get('buttonColor') || 'from-indigo-500 to-purple-500',
};

const handleMessage = async (message) => {
  // Post message to parent window
  window.parent.postMessage({ type: 'chat-message', message }, '*');
  
  // Return default response
  return `I received your message: "${message}". How can I help you further?`;
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