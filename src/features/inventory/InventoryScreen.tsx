import type { Ingredient } from '../../data/models';
import { SectionCard } from '../../components/SectionCard';

export function InventoryScreen({ ingredients }: { ingredients: Ingredient[] }) {
  return (
    <div className="stacked-grid">
      <SectionCard title="Inventory" subtitle="Barcode-assisted lookup, receiving and stock take.">
        <div className="toolbar-row">
          <button className="primary">Scan barcode</button>
          <button className="secondary">Stock take</button>
          <button className="secondary">Receive stock</button>
        </div>
        <div className="table-like">
          {ingredients.map((item) => (
            <div key={item.id} className="table-row">
              <div>
                <strong>{item.name}</strong>
                <div className="muted">Barcode: {item.barcode ?? '—'}</div>
              </div>
              <div>{item.stock} {item.unit}</div>
              <div className={item.stock <= item.minStock ? 'danger' : 'muted'}>Min {item.minStock}</div>
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Stock take quick entry" subtitle="Phone-friendly count entry.">
        <div className="field-grid">
          <label className="field-label">Item<input value="Chicken Breast" readOnly /></label>
          <label className="field-label">Counted quantity<input value="11.8 kg" readOnly /></label>
        </div>
        <div className="action-row"><button className="primary">Save count</button></div>
      </SectionCard>
    </div>
  );
}
