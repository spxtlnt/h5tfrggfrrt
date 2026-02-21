import React from 'react';
import { Eye, Trash2 } from 'lucide-react';

interface Expense {
  expense_id: string;
  vendor_name: string;
  vendor_id?: string;
  amount: number;
  status: string;
  expense_date: string;
  reference_number?: string;
  customer_name?: string;
  paid_through?: string;
  account_name?: string;
  account_id?: string;
  currency?: string;
}

interface ExpenseTableProps {
  expenses: Expense[];
  currency: string;
  onView?: (expense: Expense) => void;
  onDelete?: (expenseId: string) => void;
}

export default function ExpenseTable({
  expenses,
  currency,
  onView,
  onDelete,
}: ExpenseTableProps) {
  return (
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-white/10 border-b border-white/10">
          <tr>
            <th className="px-3 py-3 text-left text-white font-semibold">Vendor</th>
            <th className="px-3 py-3 text-left text-white font-semibold">Amount</th>
            <th className="px-3 py-3 text-left text-white font-semibold">Ref #</th>
            <th className="px-3 py-3 text-left text-white font-semibold">Account</th>
            <th className="px-3 py-3 text-left text-white font-semibold">Status</th>
            <th className="px-3 py-3 text-left text-white font-semibold">Date</th>
            <th className="px-3 py-3 text-left text-white font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {expenses.map((expense) => (
            <tr key={expense.expense_id} className="hover:bg-white/5 transition-colors">
              <td className="px-3 py-3 text-white">{expense.vendor_name}</td>
              <td className="px-3 py-3 text-white font-semibold">
                {currency} {expense.amount.toFixed(2)}
              </td>
              <td className="px-3 py-3 text-gray-400 text-xs">{expense.reference_number || '-'}</td>
              <td className="px-3 py-3 text-gray-400 text-xs">{expense.account_name || '-'}</td>
              <td className="px-3 py-3">
                <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-300">
                  {expense.status}
                </span>
              </td>
              <td className="px-3 py-3 text-gray-300">{new Date(expense.expense_date).toLocaleDateString()}</td>
              <td className="px-3 py-3 flex gap-1">
                {onView && (
                  <button
                    onClick={() => onView(expense)}
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                    title="View details"
                  >
                    <Eye className="w-4 h-4 text-gray-400" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(expense.expense_id)}
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                    title="Delete"
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
