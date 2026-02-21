import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title?: string;
  message: string;
}

export default function EmptyState({ icon, title, message }: EmptyStateProps) {
  return (
    <div className="bg-white/5 rounded-lg border border-white/10 p-12 text-center">
      <div className="flex justify-center mb-4">
        {React.cloneElement(icon as React.ReactElement, {
          className: 'w-12 h-12 text-gray-500',
        })}
      </div>
      {title && <h3 className="text-white font-semibold mb-2">{title}</h3>}
      <p className="text-gray-400">{message}</p>
    </div>
  );
}
