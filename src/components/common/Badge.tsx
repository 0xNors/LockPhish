import React from 'react';

export type BadgeVariant =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical'
  | 'active'
  | 'draft'
  | 'running'
  | 'paused'
  | 'completed'
  | 'stopped'
  | 'neutral'
  | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant | string;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = ''
}) => {
  const normVariant = (typeof variant === 'string' ? variant.toLowerCase() : 'neutral') as BadgeVariant;

  const variantStyles: Record<string, string> = {
    low: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
    beginner: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
    easy: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
    medium: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
    intermediate: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
    warning: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
    high: 'bg-orange-950/80 text-orange-300 border-orange-800/60',
    advanced: 'bg-orange-950/80 text-orange-300 border-orange-800/60',
    hard: 'bg-orange-950/80 text-orange-300 border-orange-800/60',
    critical: 'bg-rose-950/80 text-rose-300 border-rose-800/60 animate-pulse',
    expert: 'bg-purple-950/80 text-purple-300 border-purple-800/60 shadow-sm shadow-purple-950/50',
    extreme: 'bg-purple-950/80 text-purple-300 border-purple-800/60 shadow-sm shadow-purple-950/50',
    active: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
    running: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
    draft: 'bg-slate-800 text-slate-300 border-slate-700',
    paused: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
    completed: 'bg-teal-950/80 text-teal-300 border-teal-800/60',
    stopped: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
    info: 'bg-sky-950/80 text-sky-300 border-sky-800/60',
    neutral: 'bg-slate-800 text-slate-300 border-slate-700'
  };

  const dotColors: Record<string, string> = {
    low: 'bg-emerald-400',
    beginner: 'bg-emerald-400',
    easy: 'bg-emerald-400',
    medium: 'bg-amber-400',
    intermediate: 'bg-amber-400',
    warning: 'bg-amber-400',
    high: 'bg-orange-400',
    advanced: 'bg-orange-400',
    hard: 'bg-orange-400',
    critical: 'bg-rose-400',
    expert: 'bg-purple-400',
    extreme: 'bg-purple-400',
    active: 'bg-emerald-400',
    running: 'bg-emerald-400',
    draft: 'bg-slate-400',
    paused: 'bg-amber-400',
    completed: 'bg-teal-400',
    stopped: 'bg-rose-400',
    info: 'bg-sky-400',
    neutral: 'bg-slate-400'
  };

  const style = variantStyles[normVariant] || variantStyles.neutral;
  const dotColor = dotColors[normVariant] || dotColors.neutral;

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold font-mono tracking-wider rounded-full border ${style} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      {children}
    </span>
  );
};
