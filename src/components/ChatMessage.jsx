import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, ThumbsUp, ThumbsDown, Share2, User, Clock, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../utils/cn';
import { Spinner } from './Spinner';
import { TypewriterText } from './TypewriterText';
import { ConversationalAccountClosure } from './ConversationalAccountClosure';

const MessageSkeleton = () => (
  <div className="flex gap-4">
    <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center">
        <Spinner size="small" className="border-dark-accent/50" />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="h-6 w-6 text-gray-400 dark:text-gray-500"
      >
        <Bot className="h-6 w-6" />
      </motion.div>
    </div>
    <div className="flex-1 space-y-3">
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="space-y-3"
      >
        <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-2">
          <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </motion.div>
    </div>
  </div>
);

const Avatar = ({ sender, size = 'default' }) => {
  const sizeClasses = {
    default: 'h-10 w-10',
    small: 'h-8 w-8',
  };

  return (
    <div className={cn(
      "flex items-center justify-center rounded-full",
      sender.id === 'bot' 
        ? "bg-gradient-to-br from-indigo-500 to-purple-500" 
        : "bg-gradient-to-br from-pink-500 to-rose-500",
      sizeClasses[size]
    )}>
      {sender.id === 'bot' ? (
        <Bot className="h-6 w-6 text-white" />
      ) : (
        <User className="h-6 w-6 text-white" />
      )}
    </div>
  );
};

export const ChatMessage = ({ message, isBot, isLoading, onSendMessage }) => {
  const [reaction, setReaction] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showTypewriter, setShowTypewriter] = useState(isBot && !message.typewriterComplete);
  const [typewriterComplete, setTypewriterComplete] = useState(message.typewriterComplete || false);

  if (isLoading) {
    return <MessageSkeleton />;
  }

  const handleReaction = (type) => {
    setReaction(type);
  };

  const handleShare = async (method) => {
    switch (method) {
      case 'copy':
        await navigator.clipboard.writeText(message.content);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message.content)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(message.content)}`);
        break;
    }
    setShowShareMenu(false);
  };

  const handleTypewriterComplete = () => {
    setTypewriterComplete(true);
    setShowTypewriter(false);
  };

  // Check if this message should show the account closure workflow
  const shouldShowAccountClosure = message.type === 'account_closure' || 
    (isBot && message.content.toLowerCase().includes('account closure') && typewriterComplete);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'group flex gap-4',
        isBot ? 'justify-start' : 'flex-row-reverse'
      )}
    >
      <Avatar sender={message.sender} />

      <div className="flex flex-col gap-2 max-w-[80%]">
        <div
          className={cn(
            'rounded-2xl px-4 py-2.5',
            isBot
              ? 'rounded-bl-sm bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border border-white/10 dark:border-white/5'
              : 'rounded-br-sm bg-gradient-to-br from-indigo-500 to-purple-500'
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${isBot ? 'text-gray-700 dark:text-gray-200' : 'text-white'}`}>
              {message.sender.name}
            </span>
            <button className={`p-1 rounded-full ${isBot ? 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          <div className={`text-[15px] leading-relaxed whitespace-pre-line ${isBot ? 'text-gray-700 dark:text-gray-200' : 'text-white'}`}>
            {isBot && showTypewriter ? (
              <TypewriterText 
                text={message.content} 
                speed={30}
                onComplete={handleTypewriterComplete}
              />
            ) : (
              message.content
            )}
          </div>
        </div>

        {/* Show Account Closure Component for specific messages - positioned inline */}
        {shouldShowAccountClosure && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-2"
          >
            <ConversationalAccountClosure onSendMessage={onSendMessage} />
          </motion.div>
        )}

        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {format(message.timestamp, 'h:mm a')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleReaction('up')}
              className={cn(
                'rounded-full p-1.5',
                reaction === 'up' ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
              )}
            >
              <ThumbsUp className="h-4 w-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleReaction('down')}
              className={cn(
                'rounded-full p-1.5',
                reaction === 'down' ? 'text-red-500 dark:text-red-400' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
              )}
            >
              <ThumbsDown className="h-4 w-4" />
            </motion.button>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="rounded-full p-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <Share2 className="h-4 w-4" />
              </motion.button>

              {showShareMenu && (
                <div className="absolute bottom-8 right-0 z-10 w-48 rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 dark:ring-white/5">
                  <div className="p-1">
                    <button
                      onClick={() => handleShare('copy')}
                      className="w-full rounded-md px-2 py-1 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Copy to clipboard
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full rounded-md px-2 py-1 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Share on Twitter
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="w-full rounded-md px-2 py-1 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Share on LinkedIn
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};