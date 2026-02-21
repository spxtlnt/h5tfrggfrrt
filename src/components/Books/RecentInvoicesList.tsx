import React from 'react';

interface Invoice {
  invoice_id: string;
  invoice_number: string;
  customer_name: string;
  total: number;
  status: string;
  invoice_date: string;
  due_date: string;
}

interface RecentInvoicesListProps {
  invoices: Invoice[];
  limit?: number;
}

export default function RecentInvoicesList({ invoices, limit = 5 }: RecentInvoicesListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-500/20 text-emerald-300';
      case 'overdue':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-yellow-500/20 text-yellow-300';
    }
  };

  return (
    <div className="bg-white/5 rounded-xl border border-white/10 p-6">
      <h3 className="text-xl font-bold text-white mb-4">Recent Invoices</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {invoices.slice(0, limit).map((invoice) => (
          <div key={invoice.invoice_id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white font-medium">{invoice.invoice_number}</p>
              <p className="text-sm text-gray-400">{invoice.customer_name}</p>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">${invoice.total}</p>
              <span className={`text-xs px-2 py-1 rounded ${getStatusColor(invoice.status)}`}>
                {invoice.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
