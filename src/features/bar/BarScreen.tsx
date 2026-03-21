import type { Order } from '../../data/models';
import { SectionCard } from '../../components/SectionCard';

export function BarScreen({ order }: { order: Order }) {
  const lines = order.lines.filter((line) => line.department === 'bar');
  return (
    <SectionCard title="Bar queue" subtitle="Only bar items appear here.">
      <div className="queue-grid">
        <article className="queue-card compact">
          <header>
            <strong>{order.id}</strong>
            <span>{order.tableOrRef}</span>
          </header>
          {lines.map((line) => (
            <div key={line.id} className="queue-line">
              <strong>{line.quantity} × {line.name}</strong>
              {line.changeFlag ? <span className={`pill ${line.changeFlag}`}>{line.changeFlag.toUpperCase()}</span> : null}
            </div>
          ))}
          <div className="action-row"><button className="primary">Mark ready</button></div>
        </article>
      </div>
    </SectionCard>
  );
}
