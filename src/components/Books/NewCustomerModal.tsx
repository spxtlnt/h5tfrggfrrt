import React from 'react';
import ModalWrapper from './ModalWrapper';
import CustomerForm from './CustomerForm';

interface CustomerFormData {
  contact_name: string;
  email: string;
  phone: string;
  company_name: string;
}

interface NewCustomerModalProps {
  isOpen: boolean;
  form: CustomerFormData;
  setForm: (form: CustomerFormData) => void;
  saving: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function NewCustomerModal({
  isOpen,
  form,
  setForm,
  saving,
  onSubmit,
  onClose,
}: NewCustomerModalProps) {
  return (
    <ModalWrapper
      isOpen={isOpen}
      title="Create New Customer"
      onClose={onClose}
      maxWidth="max-w-lg"
    >
      <CustomerForm
        form={form}
        setForm={setForm}
        saving={saving}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </ModalWrapper>
  );
}
