import { useMemo, useState } from 'react';
import type { Customer, Order, Product } from '../../data/models';
import { currency, createWeightLine, lineTotal, orderTotal, rewardCredit } from '../../lib/utils';
import { SectionCard } from '../../components/SectionCard';

const categories = ['Meals', 'Drinks', 'WiFi', 'Extras'] as const;

export function POSScreen({
  products,
  order,
  customers,
}: {
  products: Product[];
  order: Order;
  customers: Customer[];
}) {
  const [category, setCategory] = useState<(typeof categories)[number]>('Meals');
  const [selectedCustomer, setSelectedCustomer] = useState<string>(order.customerId ?? '');
  const filteredProducts = products.filter((product) => product.category === category);
  const total = orderTotal(order);
  const credit = rewardCredit(total);
  const activeCustomer = customers.find((customer) => customer.id === selectedCustomer);
  const previewWeightLine = useMemo(() => {
    const steak = products.find((product) => product.id === 'prod-steak-weight');
    return steak ? createWeightLine(steak, 0.35) : null;
  }, [products]);

  return (
    <div className="two-column-pos">
      <SectionCard title={order.id} subtitle={`${order.orderType} · ${order.tableOrRef}`}>
        <div className="order-lines">
          {order.lines.map((line) => (
            <div className="order-line" key={line.id}>
              <div>
                <strong>{line.quantity} × {line.name}</strong>
                <div className="muted">
                  {line.weightKg ? `${line.weightKg.toFixed(2)} kg` : 'Fixed price'}
                  {line.modifiers.length ? ` · ${line.modifiers.join(', ')}` : ''}
                  {line.changeFlag ? <span className={`pill ${line.changeFlag}`}>{line.changeFlag.toUpperCase()}</span> : null}
                </div>
              </div>
              <div>{currency(lineTotal(line))}</div>
            </div>
          ))}
        </div>
        <div className="summary-box">
          <div><span>Subtotal</span><strong>{currency(total)}</strong></div>
          <div><span>Loyalty credit (5%)</span><strong>{currency(credit)}</strong></div>
          <div><span>Customer</span><strong>{activeCustomer?.name ?? 'Walk-in'}</strong></div>
        </div>
        <label className="field-label">
          Attach customer
          <select value={selectedCustomer} onChange={(event) => setSelectedCustomer(event.target.value)}>
            <option value="">Walk-in</option>
            {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
          </select>
        </label>
        <div className="action-row">
          <button className="secondary">Hold</button>
          <button className="secondary">Edit order</button>
          <button className="primary">Pay</button>
        </div>
      </SectionCard>

      <SectionCard title="Quick sell" subtitle="Shared stock, weight items, WiFi and modifiers all in one flow.">
        <div className="chip-row">
          {categories.map((item) => (
            <button key={item} className={item === category ? 'chip active' : 'chip'} onClick={() => setCategory(item)}>
              {item}
            </button>
          ))}
        </div>
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <button key={product.id} className="product-card">
              <div className="product-image" aria-hidden="true">{product.category === 'WiFi' ? '📶' : product.category === 'Drinks' ? '🥤' : '🍽️'}</div>
              <strong>{product.name}</strong>
              <span>{product.pricingType === 'weight' ? `${currency(product.unitPrice)}/${product.unitLabel}` : currency(product.unitPrice)}</span>
            </button>
          ))}
        </div>
        {previewWeightLine ? (
          <div className="weight-preview">
            <strong>Weight item popup preview</strong>
            <div className="muted">{previewWeightLine.name} · {previewWeightLine.weightKg}kg · {currency(previewWeightLine.unitPrice)}</div>
            <div className="quick-weights">
              {[0.25, 0.35, 0.5, 0.75].map((weight) => <button key={weight} className="secondary small">{weight}kg</button>)}
            </div>
          </div>
        ) : null}
      </SectionCard>
    </div>
  );
}
