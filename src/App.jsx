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
    };

    setMainMessages((prev) => [...prev, newMessage]);

    setTimeout(() => {
      let botResponse;
      
      // Check if user is asking about account closure
      if (content.toLowerCase().includes('close') && content.toLowerCase().includes('account')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: "I can help you with account closure. Let me guide you through the secure process step by step.",
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
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: `I received your message: "${content}". How can I help you further? You can also ask me about account closure if needed.`,
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

          <div className="mt-8 p-6 bg-white/10 dark:bg-gray-800/20 backdrop-blur-md border border-white/10 dark:border-white/5 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              🚀 Account Closure Workflow
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Type <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 rounded font-mono text-sm">"close my account"</span> to start the interactive account closure process.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/20 dark:bg-gray-700/30 p-3 rounded-lg border border-white/10">
                <h4 className="font-medium text-gray-800 dark:text-gray-200">🔐 Step 1</h4>
                <p className="text-gray-600 dark:text-gray-400">Account Verification</p>
              </div>
              <div className="bg-white/20 dark:bg-gray-700/30 p-3 rounded-lg border border-white/10">
                <h4 className="font-medium text-gray-800 dark:text-gray-200">💳 Step 2</h4>
                <p className="text-gray-600 dark:text-gray-400">Balance Validation</p>
              </div>
              <div className="bg-white/20 dark:bg-gray-700/30 p-3 rounded-lg border border-white/10">
                <h4 className="font-medium text-gray-800 dark:text-gray-200">✅ Step 3</h4>
                <p className="text-gray-600 dark:text-gray-400">Secure Closure</p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-amber-50/50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800/50">
              <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
                Test Scenarios:
              </h4>
              <div className="space-y-1 text-xs text-amber-700 dark:text-amber-300">
                <div>• Valid accounts: 123456789012, 987654321098, 555666777888</div>
                <div>• Outstanding balance: 111222333444</div>
                <div>• Pending transactions: 999888777666</div>
              </div>
            </div>
          </div>
        </div>
      </div>

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