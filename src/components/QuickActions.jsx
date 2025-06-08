import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, HelpCircle, FileText, Settings, ThumbsUp, Repeat, PlusCircle, Search } from 'lucide-react';

export const QuickActions = ({ onAction, messages = [] }) => {
  const lastMessage = messages[messages.length - 1];
  const isLastMessageFromBot = lastMessage?.sender.id === 'bot';

  const quickActions = useMemo(() => {
    const defaultActions = [
      {
        icon: <MessageSquare className="h-4 w-4" />,
        label: "New Topic",
        content: "I'd like to start a new topic.",
      },
      {
        icon: <HelpCircle className="h-4 w-4" />,
        label: "Help",
        content: "I need help with something.",
      },
    ];

    if (isLastMessageFromBot) {
      return [
        {
          icon: <ThumbsUp className="h-4 w-4" />,
          label: "Thanks!",
          content: "Thank you, that was helpful!",
        },
        {
          icon: <Repeat className="h-4 w-4" />,
          label: "Explain More",
          content: "Could you explain that in more detail?",
        },
        {
          icon: <PlusCircle className="h-4 w-4" />,
          label: "Examples",
          content: "Can you provide some examples?",
        },
        {
          icon: <Search className="h-4 w-4" />,
          label: "Related",
          content: "What other related topics should I know about?",
        },
      ];
    }

    return defaultActions;
  }, [isLastMessageFromBot, lastMessage]);

  return (
    <div className="border-t border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/50 px-4 py-3">
      <div className="flex flex-wrap gap-2 justify-center">
        {quickActions.map((action, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAction(action.content)}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm text-gray-700 shadow-sm ring-1 ring-gray-900/5 transition-colors hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:ring-white/5 dark:hover:bg-gray-700"
          >
            {action.icon}
            {action.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};