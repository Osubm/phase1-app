import type { Customer, Ingredient, Order, Product, WifiVoucher } from './models';

export const ingredients: Ingredient[] = [
  { id: 'ing-chicken-quarter', name: 'Quarter Chicken Portion', unit: 'each', stock: 38, minStock: 12, barcode: '600100001' },
  { id: 'ing-steak', name: 'Beef Steak', unit: 'kg', stock: 24.28, minStock: 5, barcode: '600100002' },
  { id: 'ing-chips', name: 'Potato Chips', unit: 'kg', stock: 12.5, minStock: 4, barcode: '600100003' },
  { id: 'ing-coke', name: 'Coke 300ml', unit: 'each', stock: 48, minStock: 12, barcode: '600100004' },
];

export const products: Product[] = [
  {
    id: 'prod-quarter-chicken',
    name: 'Quarter Chicken',
    category: 'Meals',
    department: 'kitchen',
    pricingType: 'fixed',
    unitPrice: 8.5,
    recipe: [{ ingredientId: 'ing-chicken-quarter', quantity: 1 }],
  },
  {
    id: 'prod-steak-weight',
    name: 'Steak by Weight',
    category: 'Meals',
    department: 'kitchen',
    pricingType: 'weight',
    unitPrice: 18,
    unitLabel: 'kg',
    recipe: [{ ingredientId: 'ing-steak', quantity: 1 }],
  },
  {
    id: 'prod-chips',
    name: 'Chips',
    category: 'Extras',
    department: 'kitchen',
    pricingType: 'fixed',
    unitPrice: 2,
    recipe: [{ ingredientId: 'ing-chips', quantity: 0.18 }],
  },
  {
    id: 'prod-coke',
    name: 'Coke',
    category: 'Drinks',
    department: 'bar',
    pricingType: 'fixed',
    unitPrice: 2,
    recipe: [{ ingredientId: 'ing-coke', quantity: 1 }],
  },
  {
    id: 'prod-wifi-30',
    name: '30 Min WiFi',
    category: 'WiFi',
    department: 'wifi',
    pricingType: 'fixed',
    unitPrice: 1,
    recipe: [],
  },
  {
    id: 'prod-wifi-60',
    name: '1 Hour WiFi',
    category: 'WiFi',
    department: 'wifi',
    pricingType: 'fixed',
    unitPrice: 2,
    recipe: [],
  },
];

export const customers: Customer[] = [
  { id: 'cust-1', name: 'MM Dlomo', phone: '0770000001', creditBalance: 3.4, totalSpend: 224 },
  { id: 'cust-2', name: 'Tariro M', phone: '0770000002', creditBalance: 0.5, totalSpend: 18 },
];

export const orders: Order[] = [
  {
    id: 'ORD-205',
    orderType: 'dine-in',
    tableOrRef: 'Table 5',
    customerId: 'cust-1',
    status: 'sent',
    paymentStatus: 'unpaid',
    lines: [
      { id: 'line-1', productId: 'prod-quarter-chicken', name: 'Quarter Chicken', department: 'kitchen', quantity: 1, unitPrice: 8.5, modifiers: ['BBQ'], status: 'new' },
      { id: 'line-2', productId: 'prod-coke', name: 'Coke', department: 'bar', quantity: 1, unitPrice: 2, modifiers: [], status: 'new' },
      { id: 'line-3', productId: 'prod-steak-weight', name: 'Steak by Weight', department: 'kitchen', quantity: 1, unitPrice: 10.5, weightKg: 0.35, modifiers: [], status: 'new', changeFlag: 'changed' },
    ],
    events: [
      { id: 'evt-1', type: 'created', message: 'Order created', createdAt: '09:18' },
      { id: 'evt-2', type: 'item-updated', message: 'Steak weight changed to 0.35kg', createdAt: '09:21' },
    ],
  },
];

export const wifiVouchers: WifiVoucher[] = [
  { id: 'wifi-1', code: 'WIFI-AB12', durationMinutes: 60, status: 'active', source: 'sale' },
  { id: 'wifi-2', code: 'WIFI-CD34', durationMinutes: 30, status: 'active', source: 'reward' },
];
