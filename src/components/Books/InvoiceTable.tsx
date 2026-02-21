import React from 'react';
import { Eye, Edit2, Trash2, AlertCircle, CheckCircle2, Mail, Clock } from 'lucide-react';

interface Invoice {
  invoice_id: string;
  invoice_number: string;
  customer_name: string;
  total: number;
  status: string;
  invoice_date: string;
  due_date: string;
}

interface InvoiceTableProps {
  invoices: Invoice[];
  onView?: (invoice: Invoice) => void;
  onEdit?: (invoice: Invoice) => void;
  onDelete?: (invoiceId: string) => void;
}

export default function InvoiceTable({
  invoices,
  onView,
  onEdit,
  onDelete,
}: InvoiceTableProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-500/20 text-emerald-300';
      case 'overdue':
        return 'bg-red-500/20 text-red-300';
      case 'sent':
        return 'bg-yellow-500/20 text-yellow-300';
      default:
        return 'bg-yellow-500/20 text-yellow-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="w-3 h-3" />;
      case 'overdue':
        return <AlertCircle className="w-3 h-3" />;
      case 'sent':
        return <Mail className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
      <table className="w-full">
        <thead className="bg-white/10 border-b border-white/10">
          <tr>
            <th className="px-6 py-3 text-left text-white font-semibold">Invoice #</th>
            <th className="px-6 py-3 text-left text-white font-semibold">Customer</th>
            <th className="px-6 py-3 text-left text-white font-semibold">Amount</th>
            <th className="px-6 py-3 text-left text-white font-semibold">Status</th>
            <th className="px-6 py-3 text-left text-white font-semibold">Due Date</th>
            <th className="px-6 py-3 text-left text-white font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {invoices.map((invoice) => (
            <tr key={invoice.invoice_id} className="hover:bg-white/5 transition-colors">
              <td className="px-6 py-3 text-white">{invoice.invoice_number}</td>
              <td className="px-6 py-3 text-gray-300">{invoice.customer_name}</td>
              <td className="px-6 py-3 text-white font-semibold">${invoice.total}</td>
              <td className="px-6 py-3">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getStatusStyles(invoice.status)}`}>
                  {getStatusIcon(invoice.status)}
                  {invoice.status}
                </span>
              </td>
              <td className="px-6 py-3 text-gray-300">{new Date(invoice.due_date).toLocaleDateString()}</td>
              <td className="px-6 py-3 flex gap-2">
                {onView && (
                  <button
                    onClick={() => onView(invoice)}
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                    title="View invoice"
                  >
                    <Eye className="w-4 h-4 text-gray-400" />
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={() => onEdit(invoice)}
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                    title="Edit invoice"
                  >
                    <Edit2 className="w-4 h-4 text-gray-400" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(invoice.invoice_id)}
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                    title="Delete invoice"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
