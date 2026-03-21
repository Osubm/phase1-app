import type { Order } from '../../data/models';
import { SectionCard } from '../../components/SectionCard';

export function KitchenScreen({ order }: { order: Order }) {
  const lines = order.lines.filter((line) => line.department === 'kitchen');
  return (
    <SectionCard title="Kitchen queue" subtitle="Show NEW / CHANGED / CANCELLED clearly so late order changes do not cause confusion.">
      <div className="queue-grid">
        <article className="queue-card">
          <header>
            <strong>{order.id}</strong>
            <span>{order.tableOrRef}</span>
          </header>
          {lines.map((line) => (
            <div key={line.id} className="queue-line">
              <div>
                <strong>{line.quantity} × {line.name}</strong>
                <div className="muted">{line.modifiers.join(', ') || 'No modifier'} {line.weightKg ? `· ${line.weightKg}kg` : ''}</div>
              </div>
              {line.changeFlag ? <span className={`pill ${line.changeFlag}`}>{line.changeFlag.toUpperCase()}</span> : null}
            </div>
          ))}
          <div className="action-row">
            <button className="secondary">Preparing</button>
            <button className="primary">Ready</button>
          </div>
        </article>
      </div>
    </SectionCard>
  );
}
