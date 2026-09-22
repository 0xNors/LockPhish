import React from 'react';
import { ShieldAlert, Plus, FolderSearch } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  onAction,
  actionIcon = <Plus className="w-4 h-4" />
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 my-6 bg-slate-950/60 border border-dashed border-emerald-900/40 rounded-2xl">
      <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
        {icon || <FolderSearch className="w-7 h-7 text-emerald-400" />}
      </div>
      <h3 className="text-base font-bold text-slate-200 mb-1">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} icon={actionIcon} variant="primary" size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
};
