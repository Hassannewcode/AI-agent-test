
import React from 'react';
import type { Source } from '../types';

interface SourcePillProps {
  source: Source;
  index: number;
}

const SourcePill: React.FC<SourcePillProps> = ({ source, index }) => {
  if (!source.uri) return null;

  let displayUrl;
  try {
    displayUrl = new URL(source.uri).hostname;
  } catch (error) {
    displayUrl = source.uri;
  }
  
  return (
    <a
      href={source.uri}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center bg-slate-600 hover:bg-slate-500 text-slate-100 text-xs font-medium px-2.5 py-1 rounded-full transition-colors duration-200"
      title={source.title}
    >
      <span className="w-4 h-4 flex items-center justify-center bg-slate-700 text-slate-200 rounded-full mr-1.5 text-[10px]">{index + 1}</span>
      <span className="truncate max-w-[200px]">{source.title || displayUrl}</span>
    </a>
  );
};

export default SourcePill;
