import React from 'react';

interface ProgressBarProps {
  value: number; // 0 - 100
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'emerald' | 'amber' | 'rose' | 'sky';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showPercentage = true,
  size = 'md',
  variant = 'emerald',
  className = ''
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  const sizeHeights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  const fillColors = {
    emerald: 'bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    sky: 'bg-sky-500'
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-semibold mb-1.5 text-slate-300">
          {label && <span>{label}</span>}
          {showPercentage && <span className="text-slate-400">{clamped}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-950 border border-emerald-900/30 rounded-full overflow-hidden ${sizeHeights[size]}`}>
        <div
          className={`${fillColors[variant]} ${sizeHeights[size]} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
