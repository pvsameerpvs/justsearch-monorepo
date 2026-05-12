import { CustomerHeader } from './customer-header';
import { CustomerDetails } from './customer-details';
import { CustomerStats } from './customer-stats';
import type { Customer } from './types/customer.types';

export function CustomerCard({ customer }: { customer: Customer }) {
  return (
    <div className="card-premium-hover p-5">
      <CustomerHeader customer={customer} />
      <CustomerDetails customer={customer} />
      <CustomerStats customer={customer} />
    </div>
  );
}
