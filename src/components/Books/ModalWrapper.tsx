import React from 'react';

interface ModalWrapperProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  maxHeight?: string;
}

export default function ModalWrapper({
  isOpen,
  title,
  onClose,
  children,
  maxWidth = 'max-w-lg',
  maxHeight = '',
}: ModalWrapperProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`bg-slate-800 rounded-xl border border-white/10 w-full ${maxWidth} ${maxHeight} overflow-y-auto`}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-slate-800">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
