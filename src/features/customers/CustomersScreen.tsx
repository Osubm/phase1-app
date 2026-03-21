import type { Customer } from '../../data/models';
import { SectionCard } from '../../components/SectionCard';
import { currency } from '../../lib/utils';

export function CustomersScreen({ customers }: { customers: Customer[] }) {
  return (
    <SectionCard title="Customers & rewards" subtitle="5% credit default, with room for WiFi and alternative rewards.">
      <div className="table-like">
        {customers.map((customer) => (
          <div key={customer.id} className="table-row">
            <div>
              <strong>{customer.name}</strong>
              <div className="muted">{customer.phone}</div>
            </div>
            <div>{currency(customer.creditBalance)} credit</div>
            <div>{currency(customer.totalSpend)} lifetime</div>
          </div>
        ))}
      </div>
      <div className="action-row">
        <button className="secondary">Issue goodwill reward</button>
        <button className="primary">Add customer</button>
      </div>
    </SectionCard>
  );
}
