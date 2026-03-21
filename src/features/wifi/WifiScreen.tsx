import type { Product, WifiVoucher } from '../../data/models';
import { SectionCard } from '../../components/SectionCard';
import { currency } from '../../lib/utils';

export function WifiScreen({ products, vouchers }: { products: Product[]; vouchers: WifiVoucher[] }) {
  const wifiProducts = products.filter((product) => product.category === 'WiFi');
  return (
    <SectionCard title="WiFi business unit" subtitle="Sell vouchers directly or issue them as rewards.">
      <div className="wifi-layout">
        <div className="product-grid narrow">
          {wifiProducts.map((product) => (
            <button key={product.id} className="product-card wifi">
              <div className="product-image">📶</div>
              <strong>{product.name}</strong>
              <span>{currency(product.unitPrice)}</span>
            </button>
          ))}
        </div>
        <div className="card nested-card">
          <h3>Active vouchers</h3>
          {vouchers.map((voucher) => (
            <div key={voucher.id} className="list-row">
              <span>{voucher.code}</span>
              <span>{voucher.durationMinutes} min · {voucher.source}</span>
            </div>
          ))}
          <div className="action-row">
            <button className="secondary">Lookup</button>
            <button className="primary">Print / display</button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
