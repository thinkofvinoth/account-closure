import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { EmbeddedChat } from './components/EmbeddedChat';
import { Header } from './components/Header';
import { ChatContainer } from './components/ChatContainer';
import { AccountClosureChatbot } from './components/AccountClosureChatbot';
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

function App() {
  const { isDarkMode } = useThemeStore();
  const [mainMessages, setMainMessages] = useState(initialMessages);
  const [showAccountClosure, setShowAccountClosure] = useState(false);

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

    setTimeout(() => {
      let botResponse;
      
      // Check if user is asking about account closure
      if (content.toLowerCase().includes('close') && content.toLowerCase().includes('account')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: "I can help you with account closure. Let me start the secure closure process for you.",
          type: 'account_closure',
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
          typewriterComplete: false, // Enable typewriter effect
        };
        
        // Show account closure chatbot after a delay
        setTimeout(() => {
          setShowAccountClosure(true);
        }, 2000);
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: `I received your message: "${content}". How can I help you further? You can ask me about account closure if needed.`,
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
          typewriterComplete: false, // Enable typewriter effect
        };
      }
      
      setMainMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleEmbeddedChatMessage = async (message) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (message.toLowerCase().includes('close') && message.toLowerCase().includes('account')) {
      return "I can help you with account closure. Let me guide you through the secure process step by step.";
    }
    
    return `I received your message: "${message}". How can I help you further?`;
  };

  const handleAccountClosureComplete = () => {
    setShowAccountClosure(false);
    
    // Add completion message to chat
    const completionMessage = {
      id: Date.now().toString(),
      content: "Account closure process completed successfully. Thank you for using our service!",
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
      typewriterComplete: false,
    };
    
    setMainMessages((prev) => [...prev, completionMessage]);
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
              Experience our advanced chat interface with account closure workflow
            </p>
          </div>

          <div className={`rounded-2xl backdrop-blur-lg border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/20'} shadow-2xl overflow-hidden`}>
            <Header
              title="Main Chat Interface"
              subtitle="Full-featured chat experience with account closure"
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

      {/* Account Closure Overlay */}
      {showAccountClosure && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl">
            <AccountClosureChatbot onComplete={handleAccountClosureComplete} />
          </div>
        </div>
      )}

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
  );
}

export default App;