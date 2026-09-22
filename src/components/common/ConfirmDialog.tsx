import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" showCloseButton={!loading}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl shrink-0 ${variant === 'danger' ? 'bg-rose-950/80 text-rose-400 border border-rose-800/60' : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'}`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-100">{title}</h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-800/80">
        <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button variant={variant} size="sm" onClick={onConfirm} loading={loading}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};
