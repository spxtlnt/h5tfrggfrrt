import React from 'react';

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

interface RecentExpensesListProps {
  expenses: Expense[];
  limit?: number;
}

export default function RecentExpensesList({ expenses, limit = 5 }: RecentExpensesListProps) {
  const expensesList = Array.isArray(expenses) ? expenses : [];

  return (
    <div className="bg-white/5 rounded-xl border border-white/10 p-6">
      <h3 className="text-xl font-bold text-white mb-4">Recent Expenses</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {expensesList.slice(0, limit).map((expense) => (
          <div key={expense.expense_id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white font-medium">{expense.vendor_name}</p>
              <p className="text-sm text-gray-400">{new Date(expense.expense_date).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">${expense.amount}</p>
              <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300">
                {expense.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
