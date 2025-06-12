import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';
import { Header } from './Header';
import { ChatContainer } from './ChatContainer';
import { useThemeStore } from '../store/useThemeStore';
import { streamingHandler } from '../utils/streamingHandler';

const defaultTheme = {
  primaryColor: 'from-indigo-500 to-purple-500',
  secondaryColor: 'from-pink-500 to-rose-500',
  buttonColor: 'from-indigo-500 to-purple-500',
};

// Enhanced mock responses with HTML content for embedded chat
const EMBEDDED_STREAMING_RESPONSES = [
  [
    "<p>Hello! I'm your embedded assistant.</p>",
    "<p>I can help you with <strong>quick questions</strong> and provide <em>instant support</em>.</p>",
    "<p>What would you like to know today?</p>"
  ],
  [
    "<p>Thanks for reaching out!</p>",
    "<p>I'm processing your request with <strong>advanced HTML support</strong>.</p>",
    "<p>Here are some things I can help with:</p>",
    "<ul><li>General questions</li><li>Quick assistance</li><li>Information lookup</li></ul>"
  ],
  [
    "<p>I understand you need help with something.</p>",
    "<p>Let me provide you with some <strong>useful information</strong>:</p>",
    "<blockquote><p>This embedded chat supports real-time streaming with HTML formatting.</p></blockquote>",
    "<p>Feel free to ask me anything!</p>"
  ],
  [
    "<p>Great question!</p>",
    "<p>Here's what I can tell you:</p>",
    "<p>The embedded chat features include:</p>",
    "<ol><li><strong>Real-time streaming</strong></li><li><em>HTML content support</em></li><li><code>Secure processing</code></li></ol>",
    "<p><small>All responses are processed securely.</small></p>"
  ]
];

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
      isHtml: false,
    };

    setMessages((prev) => [...prev, newMessage]);

    // Check if external handler is provided
    if (onSendMessage) {
      try {
        const response = await onSendMessage(content);
        
        // Check if response contains HTML
        const isHtmlResponse = /<[^>]+>/.test(response);
        
        if (isHtmlResponse) {
          // Use streaming handler for HTML responses
          const messageId = `bot-${Date.now()}`;
          
          // Add initial streaming message
          const streamingMessage = {
            id: messageId,
            content: '',
            streamingContent: '',
            isStreaming: true,
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
            progress: 0,
          };

          setMessages((prev) => [...prev, streamingMessage]);

          // Start streaming the HTML response
          await streamingHandler.startStreaming(
            messageId,
            [response], // Wrap single response in array
            // onUpdate callback
            (updateData) => {
              setMessages((prev) => 
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
              setMessages((prev) => 
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
              setMessages((prev) => 
                prev.map(msg => 
                  msg.id === messageId 
                    ? {
                        ...msg,
                        error: error,
                        isStreaming: false,
                        onRetry: () => handleSendMessage(content)
                      }
                    : msg
                )
              );
            }
          );
        } else {
          // Handle plain text response normally
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
            isHtml: false,
          };
          
          setMessages((prev) => [...prev, botResponse]);
        }
      } catch (error) {
        console.error('Error getting response:', error);
      }
    } else {
      // Use internal streaming handler with HTML support
      const randomResponse = EMBEDDED_STREAMING_RESPONSES[Math.floor(Math.random() * EMBEDDED_STREAMING_RESPONSES.length)];
      const messageId = `bot-${Date.now()}`;
      
      // Add initial streaming message
      const streamingMessage = {
        id: messageId,
        content: '',
        streamingContent: '',
        isStreaming: true,
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
        progress: 0,
      };

      setMessages((prev) => [...prev, streamingMessage]);

      // Start streaming with HTML support
      await streamingHandler.startStreaming(
        messageId,
        randomResponse,
        // onUpdate callback
        (updateData) => {
          setMessages((prev) => 
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
          setMessages((prev) => 
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
          setMessages((prev) => 
            prev.map(msg => 
              msg.id === messageId 
                ? {
                    ...msg,
                    error: error,
                    isStreaming: false,
                    onRetry: () => handleSendMessage(content)
                  }
                : msg
            )
          );
        }
      );
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
            className={`fixed ${positionClasses[position]} z-50 w-[40vw] min-w-[400px] max-w-[600px]`}
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