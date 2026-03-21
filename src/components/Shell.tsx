import type { ReactNode } from 'react';
import type { Screen } from '../data/models';

const nav: Array<{ id: Screen; label: string }> = [
  { id: 'pos', label: 'POS' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'bar', label: 'Bar' },
  { id: 'wifi', label: 'WiFi' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'production', label: 'Production' },
  { id: 'customers', label: 'Customers' },
  { id: 'reports', label: 'Reports' },
  { id: 'setup', label: 'Setup' },
];

export function Shell({ active, setActive, children }: { active: Screen; setActive: (screen: Screen) => void; children: ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Prep & Profit Pilot</div>
        <nav className="nav-list">
          {nav.map((item) => (
            <button key={item.id} className={item.id === active ? 'nav-item active' : 'nav-item'} onClick={() => setActive(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="main-panel">{children}</main>
      <nav className="bottom-nav">
        {nav.slice(0, 5).map((item) => (
          <button key={item.id} className={item.id === active ? 'nav-item active' : 'nav-item'} onClick={() => setActive(item.id)}>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
