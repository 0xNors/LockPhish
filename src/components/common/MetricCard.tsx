import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
    label?: string;
  };
  icon?: React.ReactNode;
  variant?: 'emerald' | 'amber' | 'rose' | 'sky' | 'default';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  variant = 'default'
}) => {
  const accentBorders = {
    default: 'border-slate-800',
    emerald: 'border-emerald-800/40 hover:border-emerald-700/60',
    amber: 'border-amber-800/40 hover:border-amber-700/60',
    rose: 'border-rose-800/40 hover:border-rose-700/60',
    sky: 'border-sky-800/40 hover:border-sky-700/60'
  };

  const iconStyles = {
    default: 'bg-slate-800/80 text-slate-300',
    emerald: 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50',
    amber: 'bg-amber-950/80 text-amber-400 border border-amber-800/50',
    rose: 'bg-rose-950/80 text-rose-400 border border-rose-800/50',
    sky: 'bg-sky-950/80 text-sky-400 border border-sky-800/50'
  };

  return (
    <div className={`cyber-card p-5 rounded-xl bg-slate-950/80 border ${accentBorders[variant]} shadow-lg shadow-black/40 transition-all duration-150`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-emerald-400/70">{title}</p>
          <h3 className="text-2xl font-black font-mono text-slate-100 mt-1.5 tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {icon && <div className={`p-2.5 rounded-xl shrink-0 ${iconStyles[variant]}`}>{icon}</div>}
      </div>

      {trend && (
        <div className="mt-3.5 pt-3 border-t border-slate-800/70 flex items-center gap-1.5 text-xs">
          {trend.isPositive ? (
            <span className="flex items-center text-emerald-400 font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {trend.value}
            </span>
          ) : (
            <span className="flex items-center text-rose-400 font-bold">
              <ArrowDownRight className="w-3.5 h-3.5" />
              {trend.value}
            </span>
          )}
          <span className="text-slate-500">{trend.label || 'vs previous cycle'}</span>
        </div>
      )}
    </div>
  );
};
