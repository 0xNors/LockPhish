import React from 'react';
import { Loader2, Shield } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading security data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-16 text-center">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
        <Shield className="w-5 h-5 text-emerald-400 absolute" />
      </div>
      <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-emerald-400/70">{message}</p>
    </div>
  );
};
