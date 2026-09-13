import React from 'react';
import { LucideIcon, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  unit?: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  badge?: string;
  footnote?: string;
  color?: 'cyan' | 'emerald' | 'purple' | 'amber' | 'blue';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subValue,
  unit,
  icon: Icon,
  trend,
  trendValue,
  badge,
  footnote,
  color = 'cyan',
}) => {
  const colorMap = {
    cyan: 'border-cyan-500/20 text-cyan-400 bg-cyan-500/5',
    emerald: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5',
    purple: 'border-purple-500/20 text-purple-400 bg-purple-500/5',
    amber: 'border-amber-500/20 text-amber-400 bg-amber-500/5',
    blue: 'border-blue-500/20 text-blue-400 bg-blue-500/5',
  };

  return (
    <div className="glass-card rounded-xl p-4 border border-slate-800 flex flex-col justify-between relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider font-mono text-slate-400 font-medium">
            {label}
          </span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-2xl font-bold font-mono text-slate-100 group-hover:text-cyan-200 transition-colors">
              {value}
            </span>
            {unit && <span className="text-xs font-mono text-slate-400">{unit}</span>}
          </div>
          {subValue && <div className="text-xs text-slate-400 mt-0.5">{subValue}</div>}
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-lg border ${colorMap[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(trendValue || badge || footnote) && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
          {trendValue && (
            <span className={`inline-flex items-center gap-1 font-mono ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-slate-400'}`}>
              {trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : trend === 'down' ? <ArrowDownRight className="w-3.5 h-3.5" /> : null}
              {trendValue}
            </span>
          )}
          {badge && (
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
              {badge}
            </span>
          )}
          {footnote && <span className="text-[11px] text-slate-400 truncate max-w-[180px]">{footnote}</span>}
        </div>
      )}
    </div>
  );
};

export const ScientificErrorState: React.FC<{
  title?: string;
  whatHappened: string;
  why: string;
  nextSteps: string;
  onRetry?: () => void;
}> = ({
  title = 'Computational Analysis Notice',
  whatHappened,
  why,
  nextSteps,
  onRetry,
}) => {
  return (
    <div className="glass-panel rounded-xl p-6 border-amber-500/30 bg-amber-950/10 text-slate-200">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="flex-1 space-y-3">
          <h4 className="text-base font-semibold text-amber-300 font-mono">{title}</h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="font-mono text-amber-400 font-semibold block mb-1">What happened?</span>
              <p className="text-slate-300">{whatHappened}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="font-mono text-cyan-400 font-semibold block mb-1">Why?</span>
              <p className="text-slate-300">{why}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="font-mono text-emerald-400 font-semibold block mb-1">Recommended next step:</span>
              <p className="text-slate-300">{nextSteps}</p>
            </div>
          </div>

          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono transition-colors"
            >
              Retry Action
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const EmptyState: React.FC<{
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}> = ({ title, description, actionText, onAction }) => {
  return (
    <div className="glass-panel rounded-xl p-10 text-center flex flex-col items-center justify-center border-slate-800">
      <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mb-3">
        <AlertTriangle className="w-6 h-6 text-cyan-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-200">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mt-1 mb-4">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-colors shadow-lg shadow-cyan-500/20"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
