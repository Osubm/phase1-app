import type { Order, WifiVoucher } from '../../data/models';
import { SectionCard } from '../../components/SectionCard';
import { currency, orderTotal } from '../../lib/utils';

export function ReportsScreen({ orders, vouchers }: { orders: Order[]; vouchers: WifiVoucher[] }) {
  const totalSales = orders.reduce((sum, order) => sum + orderTotal(order), 0);
  return (
    <div className="stacked-grid">
      <SectionCard title="Daily dashboard" subtitle="Operational reporting only for Phase 1.">
        <div className="metric-grid">
          <div className="metric-card"><span>Sales today</span><strong>{currency(totalSales)}</strong></div>
          <div className="metric-card"><span>Orders</span><strong>{orders.length}</strong></div>
          <div className="metric-card"><span>WiFi vouchers</span><strong>{vouchers.length}</strong></div>
          <div className="metric-card"><span>Top item</span><strong>Quarter Chicken</strong></div>
        </div>
      </SectionCard>
      <SectionCard title="What this rebuild covers" subtitle="Phase 1 only.">
        <ul className="plain-list">
          <li>Shared stock deduction from recipes</li>
          <li>Weight-based selling</li>
          <li>Kitchen / bar / WiFi workflows</li>
          <li>Last-minute order changes</li>
          <li>5% loyalty credit</li>
          <li>Barcode-assisted inventory operations</li>
        </ul>
      </SectionCard>
    </div>
  );
}
