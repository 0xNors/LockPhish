import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full bg-slate-900/90 text-slate-100 border rounded-lg px-3.5 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
          error
            ? 'border-rose-500/80 focus:border-rose-500'
            : 'border-slate-800 focus:border-emerald-500/80 hover:border-slate-700'
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-100">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-rose-400 font-medium">{error}</p>}
    </div>
  );
};
