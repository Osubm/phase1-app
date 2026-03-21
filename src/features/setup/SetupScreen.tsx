import type { Product } from '../../data/models';
import { SectionCard } from '../../components/SectionCard';

export function SetupScreen({ products }: { products: Product[] }) {
  return (
    <div className="stacked-grid">
      <SectionCard title="Setup & import" subtitle="Retain CSV import/export and preserve old app field structures where operationally useful.">
        <div className="table-like">
          {products.map((product) => (
            <div className="table-row" key={product.id}>
              <div><strong>{product.name}</strong><div className="muted">{product.category}</div></div>
              <div>{product.pricingType}</div>
              <div>{product.department}</div>
            </div>
          ))}
        </div>
        <div className="action-row">
          <button className="secondary">Import CSV</button>
          <button className="secondary">Export CSV</button>
          <button className="primary">Manage recipes</button>
        </div>
      </SectionCard>
      <SectionCard title="Do not break" subtitle="Business rules preserved from the current app.">
        <ul className="plain-list">
          <li>Shared stock pools across flavour variants</li>
          <li>Department handoff between POS, kitchen, bar and WiFi</li>
          <li>Ability to change live orders late</li>
          <li>By-weight selling and stock deduction by weight</li>
          <li>WiFi as reward and standalone sale</li>
        </ul>
      </SectionCard>
    </div>
  );
}
