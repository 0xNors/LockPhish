import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variantStyles = {
    primary: 'bg-gradient-to-b from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white shadow-lg shadow-emerald-950/60 focus:ring-emerald-500 border border-emerald-400/40 font-bold tracking-wide',
    secondary: 'bg-slate-900 hover:bg-slate-800 text-emerald-200 border border-emerald-900/60 focus:ring-slate-600',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/20 focus:ring-rose-500 border border-rose-500/30',
    success: 'bg-teal-600 hover:bg-teal-500 text-white focus:ring-teal-500',
    outline: 'bg-transparent hover:bg-emerald-950/40 text-emerald-300 border border-emerald-800/60 hover:border-emerald-500/60 focus:ring-emerald-600',
    ghost: 'bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 focus:ring-slate-700'
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-2.5 gap-2.5'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin text-current" /> : icon}
      {children}
    </button>
  );
};
