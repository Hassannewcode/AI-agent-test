
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { browseAndAnswer } from './services/geminiService';
import type { ChatMessage } from './types';
import ChatBubble from './components/ChatBubble';
import Spinner from './components/Spinner';
import GlobeIcon from './components/icons/GlobeIcon';
import SendIcon from './components/icons/SendIcon';
import SparklesIcon from './components/icons/SparklesIcon';

const App: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [task, setTask] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);
  
  useEffect(() => {
    setChatHistory([
      {
        id: 'init',
        role: 'model',
        content: "Hello! I am an AI Browser Agent. Give me a task or question, and optionally a URL for context. I'll use Google Search to find the information you need.",
      }
    ]);
  }, []);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!task.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: `${task}${url ? `\nContext URL: ${url}` : ''}`,
    };
    setChatHistory(prev => [...prev, userMessage]);
    
    // Clear inputs after adding to history
    setTask('');
    // Optionally clear URL too, or keep it for follow-up questions
    // setUrl('');

    try {
      const { text, sources } = await browseAndAnswer(url, task);
      const modelMessage: ChatMessage = {
        id: Date.now().toString() + '-model',
        role: 'model',
        content: text,
        sources: sources,
      };
      setChatHistory(prev => [...prev, modelMessage]);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      const errorMessageBubble: ChatMessage = {
          id: Date.now().toString() + '-error',
          role: 'model',
          content: `I'm sorry, something went wrong: ${errorMessage}`
      }
      setChatHistory(prev => [...prev, errorMessageBubble]);
    } finally {
      setIsLoading(false);
    }
  }, [task, url, isLoading]);

  return (
    <div className="h-screen w-screen bg-slate-900 text-white flex flex-col font-sans">
      <header className="p-4 border-b border-slate-700 shadow-md bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <SparklesIcon className="w-6 h-6 text-indigo-400" />
          <h1 className="text-xl font-bold text-slate-100">AI Browser Agent</h1>
        </div>
      </header>

      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4">
        <div className="max-w-5xl mx-auto">
          {chatHistory.map(msg => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {isLoading && (
             <div className="flex items-start gap-4 my-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-indigo-500">
                    <Spinner className="w-6 h-6 text-white"/>
                </div>
                <div className="max-w-2xl w-full">
                    <div className="rounded-lg px-4 py-3 bg-slate-700 animate-pulse">
                        <p className="text-slate-400">The agent is browsing the web...</p>
                    </div>
                </div>
            </div>
          )}
          {error && (
            <div className="max-w-5xl mx-auto my-4 p-3 rounded-md bg-red-500/20 border border-red-500/50 text-red-300">
                <p><strong>Error:</strong> {error}</p>
            </div>
          )}
        </div>
      </main>

      <footer className="p-4 border-t border-slate-700 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <GlobeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="Optional: Provide a URL for context..."
                className="w-full bg-slate-800 border border-slate-700 rounded-md py-2 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                disabled={isLoading}
              />
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={task}
                onChange={e => setTask(e.target.value)}
                placeholder="Ask a question or describe a task..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-md py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                disabled={isLoading}
                required
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center w-28"
                disabled={isLoading || !task.trim()}
              >
                {isLoading ? <Spinner className="w-6 h-6"/> : <SendIcon className="w-6 h-6" />}
              </button>
            </div>
          </form>
        </div>
      </footer>
    </div>
  );
};

export default App;
