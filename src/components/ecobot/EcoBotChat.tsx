import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Trash2, 
  User, 
  RefreshCw, 
  HelpCircle, 
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import { ChatMessage } from '../../types';
import { LocalStore } from '../../lib/storage';
import { chatWithEcoBot, getStoredGeminiKey } from '../../lib/gemini';

const SUGGESTED_QUESTIONS = [
  'Can I recycle greasy pizza boxes?',
  'How should I safely dispose of lithium batteries?',
  'What are the best rules for home composting?',
  'What do plastic resin codes 1-7 mean?',
  'How do I recycle aerosol spray cans?',
  'How can I reduce single-use plastics when shopping?'
];

export const EcoBotChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => LocalStore.getChatMessages());
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const geminiKey = getStoredGeminiKey();

  useEffect(() => {
    LocalStore.setChatMessages(messages);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isTyping) return;

    setError(null);
    setInputMessage('');

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const responseText = await chatWithEcoBot(text, history, geminiKey);

      const botMsg: ChatMessage = {
        id: 'msg_' + (Date.now() + 1),
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'EcoBot encountered an issue';
      setError(message);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Clear entire conversation history?')) {
      const defaultChat = LocalStore.getChatMessages().slice(0, 1);
      setMessages(defaultChat);
      LocalStore.setChatMessages(defaultChat);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl glass-card border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-emerald-500 to-lime-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                EcoBot AI Assistant
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                Online
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Ask anything about packaging codes, hazardous waste drop-offs, and circular habits.
            </p>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Main Chat Box Container */}
      <div className="rounded-3xl glass-card border border-emerald-500/20 shadow-xl overflow-hidden flex flex-col h-[600px]">
        
        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isBot = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                    isBot
                      ? 'glass-panel text-slate-800 dark:text-slate-100 border border-emerald-500/20'
                      : 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-600/20'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>

                  {/* Suggestion Chips inside initial message */}
                  {msg.suggestions && (
                    <div className="pt-2 mt-2 border-t border-slate-200 dark:border-emerald-950/60 space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Suggested Topics:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestions.map((s, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(s)}
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 transition-colors text-left font-medium"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className={`text-[9px] text-right ${isBot ? 'text-slate-400' : 'text-emerald-100'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-emerald-950 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl glass-panel border border-emerald-500/20 flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="ml-1 text-[11px]">EcoBot is researching best circular practices...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Questions Bar */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-emerald-950/60 overflow-x-auto flex items-center gap-2 bg-slate-50/50 dark:bg-emerald-950/20 no-scrollbar">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] whitespace-nowrap px-3 py-1 rounded-full bg-white dark:bg-emerald-950/80 border border-slate-200 dark:border-emerald-500/20 hover:border-emerald-500 text-slate-600 dark:text-slate-300 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Field Form */}
        <div className="p-4 bg-white/70 dark:bg-[#081c13]/70 border-t border-emerald-500/20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask EcoBot anything about recycling or sustainability..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isTyping}
              className="flex-1 px-4 py-3 rounded-2xl text-xs bg-slate-100 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-md shadow-emerald-600/25 transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
