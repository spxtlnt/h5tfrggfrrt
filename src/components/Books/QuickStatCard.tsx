import React from 'react';
import { LucideIcon } from 'lucide-react';

interface QuickStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  valueClass?: string;
}

export default function QuickStatCard({
  icon,
  label,
  value,
  valueClass = 'text-white',
}: QuickStatCardProps) {
  return (
    <div className="bg-white/5 rounded-lg border border-white/10 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{label}</p>
          <p className={`text-2xl font-bold ${valueClass}`}>{value}</p>
        </div>
        <div className="text-gray-500 opacity-50">
          {React.cloneElement(icon as React.ReactElement, {
            className: 'w-8 h-8',
          })}
        </div>
      </div>
    </div>
  );
}
