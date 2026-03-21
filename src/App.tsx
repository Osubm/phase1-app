import { useState } from 'react';
import { Shell } from './components/Shell';
import { customers, ingredients, orders, products, wifiVouchers } from './data/seed';
import type { Screen } from './data/models';
import { POSScreen } from './features/pos/POSScreen';
import { KitchenScreen } from './features/kitchen/KitchenScreen';
import { BarScreen } from './features/bar/BarScreen';
import { WifiScreen } from './features/wifi/WifiScreen';
import { InventoryScreen } from './features/inventory/InventoryScreen';
import { ProductionScreen } from './features/production/ProductionScreen';
import { CustomersScreen } from './features/customers/CustomersScreen';
import { ReportsScreen } from './features/reports/ReportsScreen';
import { SetupScreen } from './features/setup/SetupScreen';

export function App() {
  const [screen, setScreen] = useState<Screen>('pos');
  const order = orders[0];

  return (
    <Shell active={screen} setActive={setScreen}>
      {screen === 'pos' && <POSScreen products={products} order={order} customers={customers} />}
      {screen === 'kitchen' && <KitchenScreen order={order} />}
      {screen === 'bar' && <BarScreen order={order} />}
      {screen === 'wifi' && <WifiScreen products={products} vouchers={wifiVouchers} />}
      {screen === 'inventory' && <InventoryScreen ingredients={ingredients} />}
      {screen === 'production' && <ProductionScreen />}
      {screen === 'customers' && <CustomersScreen customers={customers} />}
      {screen === 'reports' && <ReportsScreen orders={orders} vouchers={wifiVouchers} />}
      {screen === 'setup' && <SetupScreen products={products} />}
    </Shell>
  );
}
