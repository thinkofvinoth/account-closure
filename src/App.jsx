import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { EmbeddedChat } from './components/EmbeddedChat';
import { Header } from './components/Header';
import { ChatContainer } from './components/ChatContainer';
import { useThemeStore } from './store/useThemeStore';
import { streamingHandler } from './utils/streamingHandler';

const initialMessages = [
  {
    id: '1',
    content: "Hi! I'm your AI assistant. I can process both plain text and HTML content with streaming responses. How can I help you today?",
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
    typewriterComplete: true,
    isHtml: false,
  }
];

const userProfile = {
  id: 'user',
  name: 'John Doe',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  status: 'online'
};

// Enhanced mock responses with HTML and markdown content
const MOCK_STREAMING_RESPONSES = [
  [
    "Let me help you with that question.",
    "I'm processing your request and gathering relevant information.",
    "Based on my analysis, here are the **key points** you should consider:",
    "• First important point\n• Second consideration\n• Third aspect to remember"
  ],
  [
    "That's an interesting question about <strong>HTML content processing</strong>.",
    "Let me demonstrate different content types:",
    "**Markdown formatting** works seamlessly with *italic* and `code` elements.",
    "Here's a [helpful link](https://example.com) for more information."
  ],
  [
    "I can process various content formats:",
    "### HTML Elements\n- **Bold text**\n- *Italic text*\n- `Code snippets`",
    "> This is a blockquote example\n> with multiple lines",
    "All content is **sanitized** for security while preserving formatting."
  ],
  [
    "Security is a top priority in content processing.",
    "All HTML content goes through <em>sanitization</em> to prevent XSS attacks.",
    "**Supported elements include:**\n1. Text formatting\n2. Lists and links\n3. Code blocks\n4. Blockquotes",
    "Dangerous elements like `<script>` tags are automatically removed."
  ],
  [
    "Let me show you **interactive content** capabilities:",
    "```javascript\nconst greeting = 'Hello World!';\nconsole.log(greeting);\n```",
    "The system supports:\n• Real-time streaming\n• HTML sanitization\n• Markdown conversion\n• Error handling",
    "All while maintaining **accessibility** and **performance**."
  ]
];

function App() {
  const { isDarkMode } = useThemeStore();
  const [mainMessages, setMainMessages] = useState(initialMessages);

  const handleMainChatMessage = async (content) => {
    const newMessage = {
      id: Date.now().toString(),
      content,
      sender: userProfile,
      timestamp: new Date(),
      read: true,
      reactions: [],
      attachments: [],
      edited: false,
      isHtml: false,
    };

    setMainMessages((prev) => [...prev, newMessage]);

    // Select random streaming response
    const randomResponse = MOCK_STREAMING_RESPONSES[Math.floor(Math.random() * MOCK_STREAMING_RESPONSES.length)];
    const messageId = `bot-${Date.now()}`;
    
    // Add initial streaming message
    const streamingMessage = {
      id: messageId,
      content: '',
      streamingContent: '',
      isStreaming: true,
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
      progress: 0,
    };

    setMainMessages((prev) => [...prev, streamingMessage]);

    // Start streaming with the advanced handler
    await streamingHandler.startStreaming(
      messageId,
      randomResponse,
      // onUpdate callback
      (updateData) => {
        setMainMessages((prev) => 
          prev.map(msg => 
            msg.id === messageId 
              ? {
                  ...msg,
                  streamingContent: updateData.content,
                  progress: updateData.progress,
                  isStreaming: updateData.isStreaming
                }
              : msg
          )
        );
      },
      // onComplete callback
      (completeData) => {
        setMainMessages((prev) => 
          prev.map(msg => 
            msg.id === messageId 
              ? {
                  ...msg,
                  content: completeData.content,
                  originalContent: completeData.originalContent,
                  isStreaming: false,
                  streamingContent: undefined,
                  isHtml: completeData.isHtml,
                  type: completeData.type,
                  isSafe: completeData.isSafe
                }
              : msg
          )
        );
      },
      // onError callback
      (error) => {
        setMainMessages((prev) => 
          prev.map(msg => 
            msg.id === messageId 
              ? {
                  ...msg,
                  error: error,
                  isStreaming: false,
                  onRetry: () => handleMainChatMessage(content)
                }
              : msg
          )
        );
      }
    );
  };

  const handleEmbeddedChatMessage = async (message) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `I received your message: "${message}". How can I help you further?`;
  };

  return (
    <div className={`relative min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="fixed inset-0 z-0">
        <div className={`absolute inset-0 bg-gradient-to-br ${isDarkMode ? 'from-gray-900 via-gray-800 to-gray-900' : 'from-blue-50 via-indigo-50 to-purple-50'}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_100%)] opacity-75" />
        <div className="absolute inset-0 backdrop-blur-[100px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/5 to-transparent" />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-dark-accent via-dark-accent2 to-dark-accent animate-gradient">
              Advanced Streaming Chat
            </h1>
            <p className={`mt-2 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Secure HTML & Markdown processing with real-time streaming responses
            </p>
          </div>

          <div className={`rounded-2xl backdrop-blur-lg border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/20'} shadow-2xl overflow-hidden`}>
            <Header
              title="AI Assistant"
              subtitle="HTML-aware streaming chat with security"
              theme={{
                primaryColor: 'from-dark-accent to-dark-accent2',
                secondaryColor: 'from-dark-accent2 to-dark-accent',
              }}
            />
            <ChatContainer
              messages={mainMessages}
              onSendMessage={handleMainChatMessage}
            />
          </div>
        </div>
      </div>

      {/* Embedded Chat */}
      <div className="relative z-50">
        <EmbeddedChat
          initialMessages={initialMessages}
          position="bottom-right"
          buttonIcon={<MessageCircle className="h-6 w-6" />}
          title="Quick Assistant"
          subtitle="Here to help you 24/7"
          theme={{
            primaryColor: 'from-dark-accent to-dark-accent2',
            secondaryColor: 'from-dark-accent2 to-dark-accent',
            buttonColor: 'from-dark-accent to-dark-accent2'
          }}
          onSendMessage={handleEmbeddedChatMessage}
        />
      </div>
    </div>
  );
}

export default App;