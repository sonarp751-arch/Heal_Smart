import React from 'react';
import { LiteratureArticle } from '../../types';
import { BookOpen, ExternalLink, FileText, Globe } from 'lucide-react';

export const LiteratureCard: React.FC<{ article: LiteratureArticle }> = ({ article }) => {
  return (
    <div className="glass-panel rounded-xl p-5 border-slate-800 space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <BookOpen className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span className="font-semibold">{article.journal}</span>
            <span className="text-slate-500">•</span>
            <span>{article.publicationYear}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
              {article.source}
            </span>
            {article.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
                title="View Primary Scientific Publication"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        <h4 className="text-sm font-bold text-slate-100 mt-2 leading-snug">
          {article.title}
        </h4>

        <div className="text-xs font-mono text-slate-400 mt-1">
          {article.authors.join(', ')}
        </div>

        <p className="text-xs text-slate-300 mt-2.5 line-clamp-3 leading-relaxed font-sans">
          {article.abstract}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs font-mono gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {article.relevanceKeywords.slice(0, 3).map((kw) => (
            <span
              key={kw}
              className="px-1.5 py-0.5 rounded bg-slate-900 text-[10px] text-slate-400 border border-slate-800"
            >
              {kw}
            </span>
          ))}
        </div>

        <div className="text-[11px] text-slate-400">
          {article.pmid && <span>PMID: <strong className="text-slate-200">{article.pmid}</strong></span>}
          {article.doi && <span className="ml-2">DOI: <strong className="text-slate-200 truncate max-w-[100px] inline-block">{article.doi}</strong></span>}
        </div>
      </div>
    </div>
  );
};
