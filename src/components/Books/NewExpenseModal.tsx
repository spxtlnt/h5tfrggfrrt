import React from 'react';
import ModalWrapper from './ModalWrapper';
import ExpenseForm from './ExpenseForm';

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

interface NewExpenseModalProps {
  isOpen: boolean;
  form: ExpenseFormData;
  setForm: (form: ExpenseFormData) => void;
  vendors: Vendor[];
  expenseAccounts: ExpenseAccount[];
  loading: boolean;
  saving: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function NewExpenseModal({
  isOpen,
  form,
  setForm,
  vendors,
  expenseAccounts,
  loading,
  saving,
  onSubmit,
  onClose,
}: NewExpenseModalProps) {
  return (
    <ModalWrapper
      isOpen={isOpen}
      title="Create New Expense"
      onClose={onClose}
      maxWidth="max-w-lg"
      maxHeight="max-h-96"
    >
      <ExpenseForm
        form={form}
        setForm={setForm}
        vendors={vendors}
        expenseAccounts={expenseAccounts}
        loading={loading}
        saving={saving}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </ModalWrapper>
  );
}
