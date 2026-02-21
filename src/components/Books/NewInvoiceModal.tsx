import React from 'react';
import ModalWrapper from './ModalWrapper';
import InvoiceForm from './InvoiceForm';

interface Customer {
  contact_id: string;
  contact_name: string;
  email: string;
  company_name?: string;
  phone?: string;
}

interface InvoiceFormData {
  customer_id: string;
  description: string;
  quantity: number;
  rate: number;
  invoice_date: string;
  due_date: string;
  notes: string;
}

interface NewInvoiceModalProps {
  isOpen: boolean;
  form: InvoiceFormData;
  setForm: (form: InvoiceFormData) => void;
  customers: Customer[];
  saving: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function NewInvoiceModal({
  isOpen,
  form,
  setForm,
  customers,
  saving,
  onSubmit,
  onClose,
}: NewInvoiceModalProps) {
  return (
    <ModalWrapper
      isOpen={isOpen}
      title="Create New Invoice"
      onClose={onClose}
      maxWidth="max-w-lg"
      maxHeight="max-h-96"
    >
      <InvoiceForm
        form={form}
        setForm={setForm}
        customers={customers}
        saving={saving}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </ModalWrapper>
  );
}
