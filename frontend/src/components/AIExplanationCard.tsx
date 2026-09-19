'use client';

import React from 'react';
import { Bot, Sparkles, Cpu, Check, Copy } from 'lucide-react';

interface AIExplanationCardProps {
  explanation: string;
  source: 'gemini' | 'deterministic_engine';
}

export const AIExplanationCard: React.FC<AIExplanationCardProps> = ({
  explanation,
  source,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(explanation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          {source === 'gemini' ? (
            <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
          ) : (
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
          )}
          <div>
            <h3 className="text-base font-bold text-white">
              Evidence-Grounded AI Explanation
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Strictly synthesizes provided structured evidence without altering figures.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Source Badge */}
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center space-x-1 ${
              source === 'gemini'
                ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
            }`}
          >
            <span>{source === 'gemini' ? 'Google Gemini 2.5 Flash' : 'Deterministic Explanation Engine'}</span>
          </span>

          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Copy explanation"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Markdown formatted text */}
      <div className="mt-5 prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-wrap font-sans">
        {explanation}
      </div>
    </div>
  );
};
