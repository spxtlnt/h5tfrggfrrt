import React from 'react';
import { FileText, Users, TrendingUp, BarChart3 } from 'lucide-react';

interface Invoice {
  invoice_id: string;
  invoice_number: string;
  customer_name: string;
  total: number;
  status: string;
  invoice_date: string;
  due_date: string;
}

interface Customer {
  contact_id: string;
  contact_name: string;
  email: string;
  company_name?: string;
  phone?: string;
}

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

interface QuickStatsSectionProps {
  invoicesCount: number;
  customersCount: number;
  expenses: Expense[];
  hasReports: boolean;
}

export default function QuickStatsSection({
  invoicesCount,
  customersCount,
  expenses,
  hasReports,
}: QuickStatsSectionProps) {
  const expensesList = Array.isArray(expenses) ? expenses : [];
  const totalExpenses = expensesList.reduce((sum, e) => sum + (e.amount || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-2">Total Invoices</p>
            <p className="text-3xl font-bold text-white">{invoicesCount}</p>
          </div>
          <FileText className="w-8 h-8 text-blue-400" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-2">Customers</p>
            <p className="text-3xl font-bold text-white">{customersCount}</p>
          </div>
          <Users className="w-8 h-8 text-emerald-400" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-2">Total Expenses</p>
            <p className="text-3xl font-bold text-white">
              ${totalExpenses.toFixed(2)}
            </p>
          </div>
          <TrendingUp className="w-8 h-8 text-orange-400" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-2">Reports</p>
            <p className="text-3xl font-bold text-white">
              {hasReports ? 'Ready' : 'Pending'}
            </p>
          </div>
          <BarChart3 className="w-8 h-8 text-purple-400" />
        </div>
      </div>
    </div>
  );
}
