import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const StreamingMessage = ({ message, isStreaming }) => {
  // Convert HTML break tags to proper line breaks for display
  const formatMessage = (text) => {
    return text.split(/<br\s*\/?>/gi).filter(line => line.trim() !== '');
  };

  const lines = formatMessage(message);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-50/50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800/50"
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {isStreaming ? (
            <Loader2 className="h-5 w-5 text-blue-500 animate-spin mt-0.5" />
          ) : (
            <div className="h-5 w-5 bg-blue-500 rounded-full mt-0.5" />
          )}
        </div>
        <div className="flex-1">
          <div className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed space-y-3">
            {lines.map((line, index) => (
              <div key={index} className="block">
                {line.trim()}
              </div>
            ))}
            {isStreaming && (
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="inline-block w-2 h-4 bg-blue-500 ml-1"
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};