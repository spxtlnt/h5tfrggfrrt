import React from 'react';
import { Zap } from 'lucide-react';

interface LoadingBlockProps {
  message?: string;
}

export default function LoadingBlock({ message = 'Loading...' }: LoadingBlockProps) {
  return (
    <div className="text-center py-12">
      <Zap className="w-8 h-8 text-rose-400 mx-auto mb-4 animate-spin" />
      <p className="text-gray-400">{message}</p>
    </div>
  );
}
