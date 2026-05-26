import { Phone, User } from 'lucide-react';
import { motion } from 'framer-motion';

type DriverOrderCardCustomerProps = {
  name: string;
  phone: string;
  alternateNumber?: string;
};

export function DriverOrderCardCustomer({ name, phone, alternateNumber }: DriverOrderCardCustomerProps) {
  return (
    <div className="px-4 pb-3 border-t border-slate-100 pt-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50">
            <User className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{name}</p>
            <p className="text-xs text-slate-500 truncate">{phone}{alternateNumber ? ` · Alt: ${alternateNumber}` : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <motion.a
            href={`tel:${phone.replace(/\s/g, '')}`}
            whileTap={{ scale: 0.95 }}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-2.5 text-xs font-bold text-white active:bg-emerald-700 transition"
          >
            <Phone className="h-3.5 w-3.5" />Call
          </motion.a>
        </div>
      </div>
      {alternateNumber && (
        <motion.a
          href={`tel:${alternateNumber.replace(/\s/g, '')}`}
          whileTap={{ scale: 0.95 }}
          className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 active:bg-slate-200 transition"
        >
          <Phone className="h-3 w-3" />Call alt number
        </motion.a>
      )}
    </div>
  );
}
