
import React from 'react';
import type { ChatMessage } from '../types';
import SourcePill from './SourcePill';
import UserIcon from './icons/UserIcon';
import BotIcon from './icons/BotIcon';

interface ChatBubbleProps {
  message: ChatMessage;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isModel = message.role === 'model';
  
  const formattedContent = message.content.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <div className={`flex items-start gap-4 my-6 ${!isModel && 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isModel ? 'bg-indigo-500' : 'bg-slate-600'}`}>
        {isModel ? <BotIcon className="w-6 h-6 text-white" /> : <UserIcon className="w-6 h-6 text-white" />}
      </div>
      <div className={`max-w-2xl w-full ${isModel ? 'order-first' : 'order-last'}`}>
        <div className={`rounded-lg px-4 py-3 ${isModel ? 'bg-slate-700' : 'bg-sky-500'}`}>
          <p className="text-white whitespace-pre-wrap">{formattedContent}</p>
        </div>
        {isModel && message.sources && message.sources.length > 0 && (
          <div className="mt-3">
            <h4 className="text-xs text-slate-400 font-semibold mb-2">Sources:</h4>
            <div className="flex flex-wrap gap-2">
              {message.sources.map((source, index) => (
                <SourcePill key={source.uri + index} source={source} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
