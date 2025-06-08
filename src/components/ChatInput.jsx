import React, { useState, useRef } from 'react';
import { Send, Smile, Paperclip, Mic } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

export const ChatInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiButtonRef = useRef(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  return (
    <div className="relative border-t border-gray-100/80 dark:border-gray-800/50">
      <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm" />
      <div className="relative px-4 py-4 sm:px-6">
        <div className="relative flex items-center gap-2">
          <button
            ref={emojiButtonRef}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            disabled={disabled}
            className="rounded-full p-2 text-gray-500 hover:bg-white/50 hover:text-dark-accent 
              dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Smile className="h-5 w-5" />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-12 left-0 z-50">
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                theme="light"
                previewPosition="none"
                skinTonePosition="none"
              />
            </div>
          )}
          <button 
            className="rounded-full p-2 text-gray-500 hover:bg-white/50 hover:text-dark-accent 
              dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disabled}
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={disabled}
            className="flex-1 rounded-xl border border-gray-200/80 bg-white/90 px-4 py-3 
              text-gray-700 placeholder-gray-400 shadow-sm
              dark:border-gray-700/50 dark:bg-gray-800/90 dark:text-gray-200 dark:placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-dark-accent/50
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button 
            className="rounded-full p-2 text-gray-500 hover:bg-white/50 hover:text-dark-accent 
              dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disabled}
          >
            <Mic className="h-5 w-5" />
          </button>
          <button
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            className="flex h-11 w-11 items-center justify-center rounded-full 
              bg-gradient-to-r from-dark-accent to-dark-accent2 text-white 
              shadow-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};