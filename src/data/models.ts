export type Department = 'kitchen' | 'bar' | 'wifi';
export type RewardType = 'credit' | 'wifi' | 'free-item' | 'discount-voucher';
export type PaymentMethod = 'cash' | 'card' | 'wallet';
export type Screen =
  | 'pos'
  | 'kitchen'
  | 'bar'
  | 'wifi'
  | 'inventory'
  | 'production'
  | 'customers'
  | 'reports'
  | 'setup';

export interface Product {
  id: string;
  name: string;
  category: 'Meals' | 'Drinks' | 'WiFi' | 'Extras';
  department: Department;
  pricingType: 'fixed' | 'weight';
  unitPrice: number;
  unitLabel?: string;
  image?: string;
  recipe: Array<{ ingredientId: string; quantity: number }>;
}

export interface Ingredient {
  id: string;
  name: string;
  unit: 'kg' | 'g' | 'each' | 'ltr';
  stock: number;
  minStock: number;
  barcode?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  creditBalance: number;
  totalSpend: number;
}

export interface OrderLine {
  id: string;
  productId: string;
  name: string;
  department: Department;
  quantity: number;
  unitPrice: number;
  weightKg?: number;
  modifiers: string[];
  status: 'new' | 'preparing' | 'ready' | 'cancelled';
  changeFlag?: 'new' | 'changed' | 'cancelled';
}

export interface OrderEvent {
  id: string;
  type: 'created' | 'item-added' | 'item-updated' | 'item-cancelled' | 'paid';
  message: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderType: 'dine-in' | 'takeaway';
  tableOrRef: string;
  customerId?: string;
  lines: OrderLine[];
  status: 'draft' | 'sent' | 'completed';
  paymentStatus: 'unpaid' | 'paid';
  events: OrderEvent[];
}

export interface WifiVoucher {
  id: string;
  code: string;
  durationMinutes: number;
  status: 'active' | 'expired';
  source: 'sale' | 'reward';
}
