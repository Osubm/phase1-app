import type { Order, OrderLine, Product } from '../data/models';

export const currency = (value: number): string => `$${value.toFixed(2)}`;

export const lineTotal = (line: OrderLine): number => line.unitPrice * line.quantity;

export const orderTotal = (order: Order): number => order.lines.filter((line) => line.status !== 'cancelled').reduce((sum, line) => sum + lineTotal(line), 0);

export const rewardCredit = (total: number): number => Number((total * 0.05).toFixed(2));

export const createWifiCode = (): string => `WIFI-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

export const createWeightLine = (product: Product, weightKg: number): OrderLine => ({
  id: crypto.randomUUID(),
  productId: product.id,
  name: product.name,
  department: product.department,
  quantity: 1,
  unitPrice: Number((product.unitPrice * weightKg).toFixed(2)),
  weightKg,
  modifiers: [],
  status: 'new',
  changeFlag: 'new',
});
