import React from 'react';
import { Trash2, Mail, FileText } from 'lucide-react';

interface Customer {
  contact_id: string;
  contact_name: string;
  email: string;
  company_name?: string;
  phone?: string;
}

interface CustomerCardProps {
  customer: Customer;
  onDelete?: (customerId: string) => void;
}

export default function CustomerCard({ customer, onDelete }: CustomerCardProps) {
  return (
    <div className="bg-white/5 rounded-lg border border-white/10 p-6 hover:border-rose-500/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="text-white font-semibold">{customer.contact_name}</h4>
          {customer.company_name && <p className="text-sm text-gray-400">{customer.company_name}</p>}
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(customer.contact_id)}
            className="p-2 hover:bg-white/10 rounded transition-colors"
            title="Delete customer"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        )}
      </div>
      <div className="space-y-2 text-sm">
        {customer.email && (
          <p className="text-gray-400 flex items-center gap-2">
            <Mail className="w-4 h-4" /> {customer.email}
          </p>
        )}
        {customer.phone && (
          <p className="text-gray-400 flex items-center gap-2">
            <FileText className="w-4 h-4" /> {customer.phone}
          </p>
        )}
      </div>
    </div>
  );
}
