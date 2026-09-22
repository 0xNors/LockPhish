import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerBorder?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  action,
  children,
  className = '',
  headerBorder = true
}) => {
  return (
    <div className={`cyber-card bg-slate-900/80 border border-emerald-900/30 rounded-xl shadow-xl shadow-black/40 overflow-hidden backdrop-blur-sm ${className}`}>
      {(title || action) && (
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4.5 gap-2 ${headerBorder ? 'border-b border-emerald-900/30 bg-gradient-to-r from-emerald-950/40 via-slate-900/40 to-transparent' : ''}`}>
          <div>
            {title && <h3 className="text-base font-bold text-slate-100 tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};
