import React from 'react';
import { Zap } from 'lucide-react';

interface Vendor {
  contact_id: string;
  contact_name: string;
  email: string;
  company_name?: string;
  phone?: string;
}

interface ExpenseAccount {
  account_id: string;
  account_name: string;
}

interface ExpenseFormData {
  vendor_id: string;
  account_id: string;
  reference_number: string;
  amount: number;
  expense_date: string;
  notes: string;
}

interface ExpenseFormProps {
  form: ExpenseFormData;
  setForm: (form: ExpenseFormData) => void;
  vendors: Vendor[];
  expenseAccounts: ExpenseAccount[];
  loading: boolean;
  saving: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function ExpenseForm({
  form,
  setForm,
  vendors,
  expenseAccounts,
  loading,
  saving,
  onSubmit,
  onCancel,
}: ExpenseFormProps) {
  return (
    <form onSubmit={onSubmit} className="p-6 space-y-4">
      {/* Load expense accounts on modal open */}
      {expenseAccounts.length === 0 && (
        <div className="text-center py-2 text-sm text-gray-400">
          {loading ? 'Loading expense accounts...' : 'No expense accounts found'}
        </div>
      )}
      {vendors.length === 0 ? (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-yellow-300 text-sm mb-4">
          <p className="font-medium mb-2">⚠️ No vendors found</p>
          <p>Please create at least one vendor before creating an expense. Go to the Vendors tab and click "New Vendor".</p>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Vendor *
          </label>
          <select
            value={form.vendor_id}
            onChange={(e) => setForm({ ...form, vendor_id: e.target.value })}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-rose-500 transition-colors"
          >
            <option value="">Select a vendor</option>
            {vendors.map((vendor) => (
              <option key={vendor.contact_id} value={vendor.contact_id}>
                {vendor.contact_name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Expense Account *
        </label>
        <select
          value={form.account_id}
          onChange={(e) => setForm({ ...form, account_id: e.target.value })}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-rose-500 transition-colors"
        >
          <option value="">Select an expense account</option>
          {expenseAccounts.map((account) => (
            <option key={account.account_id} value={account.account_id}>
              {account.account_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Reference Number
        </label>
        <input
          type="text"
          value={form.reference_number}
          onChange={(e) => setForm({ ...form, reference_number: e.target.value })}
          placeholder="Leave empty for auto-generated reference"
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Amount *
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
          placeholder="0.00"
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Expense Date *
        </label>
        <input
          type="date"
          value={form.expense_date}
          onChange={(e) => setForm({ ...form, expense_date: e.target.value })}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-rose-500 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Notes
        </label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Add any notes..."
          rows={2}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 transition-colors"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving || vendors.length === 0 || expenseAccounts.length === 0}
          className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50 transition-colors font-medium flex items-center justify-center gap-2"
        >
          {saving && <Zap className="w-4 h-4 animate-spin" />}
          {saving ? 'Creating...' : 'Create Expense'}
        </button>
      </div>
    </form>
  );
}
