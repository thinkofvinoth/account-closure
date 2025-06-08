import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';
import { Header } from './Header';
import { ChatContainer } from './ChatContainer';
import { useThemeStore } from '../store/useThemeStore';

const defaultTheme = {
  primaryColor: 'from-indigo-500 to-purple-500',
  secondaryColor: 'from-pink-500 to-rose-500',
  buttonColor: 'from-indigo-500 to-purple-500',
};

export const EmbeddedChat = ({
  initialMessages = [],
  position = 'bottom-right',
  buttonIcon,
  title = 'AI Assistant',
  subtitle = 'Always here to help',
  theme = defaultTheme,
  onSendMessage,
  isEmbedded = false,
}) => {
  const [isOpen, setIsOpen] = useState(isEmbedded);
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useThemeStore();

  const handleSendMessage = async (content) => {
    const newMessage = {
      id: Date.now().toString(),
      content,
      sender: {
        id: 'user',
        name: 'User',
        avatar: '',
        status: 'online'
      },
      timestamp: new Date(),
      read: true,
      reactions: [],
      attachments: [],
      edited: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    if (onSendMessage) {
      try {
        const response = await onSendMessage(content);
        const botResponse = {
          id: (Date.now() + 1).toString(),
          content: response,
          sender: {
            id: 'bot',
            name: title,
            avatar: '',
            status: 'online'
          },
          timestamp: new Date(),
          read: true,
          reactions: [],
          attachments: [],
          edited: false,
        };
        setMessages((prev) => [...prev, botResponse]);
      } catch (error) {
        console.error('Error getting response:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  const ChatWindow = () => (
    <div className={`overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm ring-1 ring-black/5 dark:ring-white/5 shadow-2xl ${isDarkMode ? 'dark' : ''}`}>
      <Header 
        title={title}
        subtitle={subtitle}
        onClose={isEmbedded ? undefined : () => setIsOpen(false)}
        theme={theme}
      />
      <ChatContainer
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );

  if (isEmbedded) {
    return <ChatWindow />;
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed ${positionClasses[position]} z-50 w-[380px] sm:w-[440px]`}
          >
            <ChatWindow />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed ${positionClasses[position]} z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r ${theme.buttonColor} text-white shadow-lg`}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          buttonIcon || <MessageSquare className="h-6 w-6" />
        )}
      </motion.button>
    </>
  );
};