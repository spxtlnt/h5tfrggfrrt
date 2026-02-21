import React from 'react';
import { Trash2, Mail, FileText } from 'lucide-react';

interface Vendor {
  contact_id: string;
  contact_name: string;
  email: string;
  company_name?: string;
  phone?: string;
}

interface VendorCardProps {
  vendor: Vendor;
  onDelete?: (vendorId: string) => void;
}

export default function VendorCard({ vendor, onDelete }: VendorCardProps) {
  return (
    <div className="bg-white/5 rounded-lg border border-white/10 p-6 hover:border-rose-500/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="text-white font-semibold">{vendor.contact_name}</h4>
          {vendor.company_name && <p className="text-sm text-gray-400">{vendor.company_name}</p>}
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(vendor.contact_id)}
            className="p-2 hover:bg-white/10 rounded transition-colors"
            title="Delete vendor"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        )}
      </div>
      <div className="space-y-2 text-sm">
        {vendor.email && (
          <p className="text-gray-400 flex items-center gap-2">
            <Mail className="w-4 h-4" /> {vendor.email}
          </p>
        )}
        {vendor.phone && (
          <p className="text-gray-400 flex items-center gap-2">
            <FileText className="w-4 h-4" /> {vendor.phone}
          </p>
        )}
      </div>
    </div>
  );
}
