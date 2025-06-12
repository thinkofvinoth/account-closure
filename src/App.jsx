import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { EmbeddedChat } from './components/EmbeddedChat';
import { Header } from './components/Header';
import { ChatContainer } from './components/ChatContainer';
import { useThemeStore } from './store/useThemeStore';

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
    typewriterComplete: true, // Skip typewriter for initial message
  }
];

const userProfile = {
  id: 'user',
  name: 'John Doe',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  status: 'online'
};

// Mock streaming responses
const MOCK_STREAMING_RESPONSES = [
  [
    "Let me help you with that question.",
    "I'm processing your request and gathering relevant information.",
    "Based on my analysis, here's what I found.",
    "I hope this information is helpful to you!"
  ],
  [
    "That's an interesting question you've asked.",
    "Let me break this down into manageable parts.",
    "Here are the key points you should consider.",
    "Feel free to ask if you need more clarification!"
  ],
  [
    "I understand what you're looking for.",
    "Let me provide you with a comprehensive answer.",
    "This topic has several important aspects to consider.",
    "I'm here if you have any follow-up questions!"
  ],
  [
    "Thank you for your question.",
    "I'll walk you through this step by step.",
    "Here's the information you requested.",
    "Let me know if you need additional details!"
  ]
];

function App() {
  const { isDarkMode } = useThemeStore();
  const [mainMessages, setMainMessages] = useState(initialMessages);

  const simulateStreamingResponse = async (responses) => {
    return new Promise((resolve) => {
      const streamingMessageId = `streaming-${Date.now()}`;
      
      // Add initial streaming message
      const streamingMessage = {
        id: streamingMessageId,
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
      };

      setMainMessages((prev) => [...prev, streamingMessage]);

      let fullContent = '';
      let currentResponseIndex = 0;

      const streamNextResponse = () => {
        if (currentResponseIndex >= responses.length) {
          // Streaming complete - convert to regular message
          setMainMessages((prev) => 
            prev.map(msg => 
              msg.id === streamingMessageId 
                ? {
                    ...msg,
                    content: fullContent.replace(/<br\s*\/?>/gi, '\n'),
                    isStreaming: false,
                    streamingContent: undefined,
                    typewriterComplete: false
                  }
                : msg
            )
          );
          resolve();
          return;
        }

        const currentResponse = responses[currentResponseIndex];
        
        // Add break tag if not the first response
        if (currentResponseIndex > 0) {
          fullContent += '<br /><br />';
          setMainMessages((prev) => 
            prev.map(msg => 
              msg.id === streamingMessageId 
                ? { ...msg, streamingContent: fullContent }
                : msg
            )
          );
        }

        // Stream each character of the current response
        let charIndex = 0;
        const streamChars = () => {
          if (charIndex < currentResponse.length) {
            fullContent += currentResponse[charIndex];
            setMainMessages((prev) => 
              prev.map(msg => 
                msg.id === streamingMessageId 
                  ? { ...msg, streamingContent: fullContent }
                  : msg
              )
            );
            charIndex++;
            setTimeout(streamChars, 50); // 50ms delay between characters
          } else {
            // Move to next response after a pause
            currentResponseIndex++;
            setTimeout(streamNextResponse, 1000); // 1s pause between responses
          }
        };

        streamChars();
      };

      // Start streaming after a short delay
      setTimeout(streamNextResponse, 500);
    });
  };

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
    };

    setMainMessages((prev) => [...prev, newMessage]);

    // Select random streaming response
    const randomResponse = MOCK_STREAMING_RESPONSES[Math.floor(Math.random() * MOCK_STREAMING_RESPONSES.length)];
    
    // Simulate streaming response
    await simulateStreamingResponse(randomResponse);
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
              CSW Genie
            </h1>
            <p className={`mt-2 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Experience our advanced chat interface with streaming responses
            </p>
          </div>

          <div className={`rounded-2xl backdrop-blur-lg border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/20'} shadow-2xl overflow-hidden`}>
            <Header
              title="AI Assistant"
              subtitle="Full-featured chat with streaming responses"
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