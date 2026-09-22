import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-[10px] font-mono font-semibold uppercase tracking-widest text-emerald-400/70 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-slate-500 pointer-events-none flex items-center">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-slate-950/90 text-emerald-50 placeholder-slate-600 border rounded-lg px-3.5 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
            icon ? 'pl-10' : ''
          } ${
            error
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/30'
              : 'border-emerald-900/40 focus:border-emerald-500/80 hover:border-emerald-800/60'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-rose-400 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};
