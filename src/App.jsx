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
    content: "<p>Hi! I'm your AI assistant with <strong>advanced HTML streaming support</strong>.</p><p>I can process both plain text and HTML content with real-time streaming responses. How can I help you today?</p>",
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
    isHtml: true,
  }
];

const userProfile = {
  id: 'user',
  name: 'John Doe',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  status: 'online'
};

// Enhanced mock responses with HTML and markdown content including <p> tags
const MOCK_STREAMING_RESPONSES = [
  [
    "<p>Let me help you with that question.</p>",
    "<p>I'm processing your request and gathering relevant information.</p>",
    "<p>Based on my analysis, here are the <strong>key points</strong> you should consider:</p>",
    "<ul><li>First important point</li><li>Second consideration</li><li>Third aspect to remember</li></ul>"
  ],
  [
    "<p>That's an interesting question about <strong>HTML content processing</strong>.</p>",
    "<p>Let me demonstrate different content types:</p>",
    "<p><strong>Markdown formatting</strong> works seamlessly with <em>italic</em> and <code>code</code> elements.</p>",
    "<p>Here's a <a href='https://example.com' target='_blank'>helpful link</a> for more information.</p>"
  ],
  [
    "<p>I can process various content formats:</p>",
    "<h3>HTML Elements</h3><ul><li><strong>Bold text</strong></li><li><em>Italic text</em></li><li><code>Code snippets</code></li></ul>",
    "<blockquote><p>This is a blockquote example</p><p>with multiple paragraphs</p></blockquote>",
    "<p>All content is <strong>sanitized</strong> for security while preserving formatting.</p>"
  ],
  [
    "<p>Security is a top priority in content processing.</p>",
    "<p>All HTML content goes through <em>sanitization</em> to prevent XSS attacks.</p>",
    "<p><strong>Supported elements include:</strong></p><ol><li>Text formatting</li><li>Lists and links</li><li>Code blocks</li><li>Blockquotes</li></ol>",
    "<p>Dangerous elements like <code><script></code> tags are automatically removed.</p>"
  ],
  [
    "<p>Let me show you <strong>interactive content</strong> capabilities:</p>",
    "<pre><code>const greeting = 'Hello World!';\nconsole.log(greeting);</code></pre>",
    "<p>The system supports:</p><ul><li>Real-time streaming</li><li>HTML sanitization</li><li>Markdown conversion</li><li>Error handling</li></ul>",
    "<p>All while maintaining <strong>accessibility</strong> and <strong>performance</strong>.</p>"
  ],
  [
    "<p>Here's an example with <strong>mixed HTML elements</strong>:</p>",
    "<p>You can use <em>emphasis</em>, <strong>strong text</strong>, and even <mark>highlighted content</mark>.</p>",
    "<p>Mathematical expressions: H<sub>2</sub>O and E=mc<sup>2</sup></p>",
    "<p><small>This is small text</small> and this is <del>deleted text</del> with <ins>inserted text</ins>.</p>"
  ]
];

// Enhanced embedded chat responses with HTML - now properly formatted for streaming
const EMBEDDED_CHAT_RESPONSES = [
  "<p>Thanks for using the embedded assistant!</p><p>I can help with:</p><ul><li>Quick questions</li><li>Information lookup</li><li>General assistance</li></ul><p><em>All with real-time HTML streaming!</em></p>",
  
  "<p>Hello from the embedded chat!</p><p>I support the same <strong>HTML streaming capabilities</strong> as the main chat.</p><p>Try asking me anything!</p>",
  
  "<p>I received your message and I'm processing it.</p><blockquote><p>This embedded chat has the same advanced features as the main interface.</p></blockquote><p>What else can I help you with?</p>",
  
  "<p>Great to hear from you!</p><p>This embedded assistant includes:</p><ol><li><strong>HTML streaming</strong></li><li><em>Typewriter effects</em></li><li><code>Loading indicators</code></li></ol><p>How can I assist you today?</p>"
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
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return HTML response for embedded chat streaming
    const randomResponse = EMBEDDED_CHAT_RESPONSES[Math.floor(Math.random() * EMBEDDED_CHAT_RESPONSES.length)];
    return randomResponse;
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

      {/* Enhanced Embedded Chat with HTML Streaming */}
      <div className="relative z-50">
        <EmbeddedChat
          initialMessages={[{
            id: '1',
            content: "<p>Hi! I'm your <strong>embedded assistant</strong> with HTML streaming support.</p><p>How can I help you today?</p>",
            sender: {
              id: 'bot',
              name: 'Quick Assistant',
              avatar: '',
              status: 'online'
            },
            timestamp: new Date(),
            read: true,
            reactions: [],
            attachments: [],
            edited: false,
            isHtml: true,
            typewriterComplete: true,
          }]}
          position="bottom-right"
          buttonIcon={<MessageCircle className="h-6 w-6" />}
          title="Quick Assistant"
          subtitle="HTML streaming support"
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