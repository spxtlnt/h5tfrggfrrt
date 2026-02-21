import React from 'react';
import ModalWrapper from './ModalWrapper';
import VendorForm from './VendorForm';

interface VendorFormData {
  contact_name: string;
  email: string;
  phone: string;
  company_name: string;
}

interface NewVendorModalProps {
  isOpen: boolean;
  form: VendorFormData;
  setForm: (form: VendorFormData) => void;
  saving: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function NewVendorModal({
  isOpen,
  form,
  setForm,
  saving,
  onSubmit,
  onClose,
}: NewVendorModalProps) {
  return (
    <ModalWrapper
      isOpen={isOpen}
      title="Create New Vendor"
      onClose={onClose}
      maxWidth="max-w-lg"
    >
      <VendorForm
        form={form}
        setForm={setForm}
        saving={saving}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </ModalWrapper>
  );
}
