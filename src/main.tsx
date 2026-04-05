import React, { useEffect, useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'

type StockCategory = 'raw' | 'finished' | 'resale' | 'ingredient'
type Unit = 'each' | 'kg' | 'g' | 'litre' | 'ml'
type MovementType =
  | 'receive'
  | 'sale'
  | 'sale_edit_add'
  | 'sale_edit_reduce'
  | 'sale_cancellation_reversal'
  | 'stock_take_adjustment'
  | 'production_input'
  | 'production_output'
  | 'wastage'

type StockItem = {
  id: string
  name: string
  category: StockCategory
  unit: Unit
  currentQty: number
  minQty: number
  active: boolean
}

type Product = {
  id: string
  name: string
  category: string
  basePrice: number
  linkedRecipeId?: string
  finishedStockItemId?: string
  bypassProduction: boolean
  active: boolean
}

type Modifier = {
  id: string
  name: string
  priceDelta: number
  stockEffectType: 'none' | 'add'
  linkedStockItemId?: string
  stockQtyPerUse?: number
  active: boolean
}

type RecipeLine = {
  id: string
  recipeId: string
  stockItemId: string
  qtyPerUnit: number
}

type OrderLineModifier = { modifierId: string; qty: number }
type OrderLine = {
  id: string
  productId: string
  qty: number
  unitPrice: number
  notes?: string
  modifiers: OrderLineModifier[]
}

type Order = {
  id: string
  orderType: 'dine_in' | 'takeaway'
  tableOrRef: string
  status: 'draft' | 'sent' | 'completed' | 'cancelled'
  paymentStatus: 'unpaid' | 'paid' | 'refunded'
  lines: OrderLine[]
  subtotal: number
  discount: number
  total: number
  createdBy: string
  createdAt: string
  updatedAt: string
}

type StockMovement = {
  id: string
  stockItemId: string
  movementType: MovementType
  qtyChange: number
  beforeQty: number
  afterQty: number
  unit: Unit
  referenceType: 'order' | 'production_batch' | 'stock_take' | 'goods_receipt'
  referenceId: string
  user: string
  notes?: string
  createdAt: string
}

type ProductionBatch = {
  id: string
  recipeId: string
  outputStockItemId: string
  plannedQty: number
  actualQty?: number
  status: 'draft' | 'completed' | 'cancelled'
  createdBy: string
  notes?: string
  createdAt: string
  completedAt?: string
  wasteQty?: number
}

type AppState = {
  stockItems: StockItem[]
  products: Product[]
  modifiers: Modifier[]
  recipeLines: RecipeLine[]
  orders: Order[]
  orderVersions: Array<{ orderId: string; snapshot: Order; reason: string; createdAt: string }>
  movements: StockMovement[]
  batches: ProductionBatch[]
}

const today = () => new Date().toISOString()
const uid = (prefix: string) => `${prefix}_${crypto.randomUUID()}`

const seedState = (): AppState => ({
  stockItems: [
    { id: 'raw_chicken_whole', name: 'Whole Chicken', category: 'raw', unit: 'each', currentQty: 20, minQty: 5, active: true },
    { id: 'fin_quarter_chicken', name: 'Quarter Chicken Portion', category: 'finished', unit: 'each', currentQty: 24, minQty: 8, active: true },
    { id: 'raw_potatoes', name: 'Potatoes Raw', category: 'raw', unit: 'kg', currentQty: 20, minQty: 5, active: true },
    { id: 'fin_chips_portion', name: 'Chips Portion', category: 'finished', unit: 'each', currentQty: 30, minQty: 10, active: true },
    { id: 'raw_beef_bulk', name: 'Beef Steak Bulk', category: 'raw', unit: 'kg', currentQty: 8, minQty: 2, active: true },
    { id: 'fin_steak_portion', name: 'Steak Portion', category: 'finished', unit: 'each', currentQty: 12, minQty: 4, active: true },
    { id: 'fin_salad_portion', name: 'Salad Portion', category: 'finished', unit: 'each', currentQty: 20, minQty: 6, active: true },
    { id: 'fin_wrap_base', name: 'Wrap Base', category: 'finished', unit: 'each', currentQty: 15, minQty: 5, active: true },
    { id: 'fin_coke_300', name: 'Coke 300ml', category: 'resale', unit: 'each', currentQty: 24, minQty: 6, active: true },
    { id: 'ing_cheese_slice', name: 'Cheese Slice', category: 'ingredient', unit: 'each', currentQty: 40, minQty: 10, active: true }
  ],
  products: [
    { id: 'prd_qtr_bbq', name: '1/4 Chicken BBQ', category: 'Meals', basePrice: 7, linkedRecipeId: 'rec_qtr_chicken', bypassProduction: false, active: true },
    { id: 'prd_qtr_peri', name: '1/4 Chicken Peri Peri', category: 'Meals', basePrice: 7, linkedRecipeId: 'rec_qtr_chicken', bypassProduction: false, active: true },
    { id: 'prd_steak_meal', name: 'Steak Meal', category: 'Meals', basePrice: 10, linkedRecipeId: 'rec_steak_meal', bypassProduction: false, active: true },
    { id: 'prd_chicken_wrap', name: 'Chicken Wrap', category: 'Meals', basePrice: 8, linkedRecipeId: 'rec_chicken_wrap', bypassProduction: false, active: true },
    { id: 'prd_coke', name: 'Coke 300ml', category: 'Drinks', basePrice: 1.5, finishedStockItemId: 'fin_coke_300', bypassProduction: true, active: true }
  ],
  modifiers: [
    { id: 'mod_extra_chips', name: 'Extra Chips', priceDelta: 1.2, stockEffectType: 'add', linkedStockItemId: 'fin_chips_portion', stockQtyPerUse: 1, active: true },
    { id: 'mod_add_cheese', name: 'Add Cheese', priceDelta: 0.8, stockEffectType: 'add', linkedStockItemId: 'ing_cheese_slice', stockQtyPerUse: 1, active: true },
    { id: 'mod_no_onion', name: 'No Onion', priceDelta: 0, stockEffectType: 'none', active: true }
  ],
  recipeLines: [
    { id: 'rl1', recipeId: 'rec_qtr_chicken', stockItemId: 'fin_quarter_chicken', qtyPerUnit: 1 },
    { id: 'rl2', recipeId: 'rec_qtr_chicken', stockItemId: 'fin_chips_portion', qtyPerUnit: 1 },
    { id: 'rl3', recipeId: 'rec_qtr_chicken', stockItemId: 'fin_salad_portion', qtyPerUnit: 1 },
    { id: 'rl4', recipeId: 'rec_steak_meal', stockItemId: 'fin_steak_portion', qtyPerUnit: 1 },
    { id: 'rl5', recipeId: 'rec_steak_meal', stockItemId: 'fin_chips_portion', qtyPerUnit: 1 },
    { id: 'rl6', recipeId: 'rec_steak_meal', stockItemId: 'fin_salad_portion', qtyPerUnit: 1 },
    { id: 'rl7', recipeId: 'rec_chicken_wrap', stockItemId: 'fin_quarter_chicken', qtyPerUnit: 1 },
    { id: 'rl8', recipeId: 'rec_chicken_wrap', stockItemId: 'fin_wrap_base', qtyPerUnit: 1 }
  ],
  orders: [],
  orderVersions: [],
  movements: [],
  batches: []
})

const STORAGE_KEY = 'restaurant-phase1-engine-v1'

function loadState(): AppState {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return seedState()
  try {
    return JSON.parse(raw) as AppState
  } catch {
    return seedState()
  }
}

function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function money(n: number) {
  return `$${n.toFixed(2)}`
}

function getProduct(state: AppState, id: string) {
  const product = state.products.find((p) => p.id === id)
  if (!product) throw new Error(`Missing product ${id}`)
  return product
}
function getModifier(state: AppState, id: string) {
  const modifier = state.modifiers.find((m) => m.id === id)
  if (!modifier) throw new Error(`Missing modifier ${id}`)
  return modifier
}

function expandOrderToEffects(state: AppState, order: Order) {
  const effects = new Map<string, number>()
  for (const line of order.lines) {
    const product = getProduct(state, line.productId)
    if (product.bypassProduction && product.finishedStockItemId) {
      effects.set(product.finishedStockItemId, (effects.get(product.finishedStockItemId) ?? 0) + line.qty)
    } else if (product.linkedRecipeId) {
      const lines = state.recipeLines.filter((r) => r.recipeId === product.linkedRecipeId)
      for (const recipeLine of lines) {
        effects.set(recipeLine.stockItemId, (effects.get(recipeLine.stockItemId) ?? 0) + recipeLine.qtyPerUnit * line.qty)
      }
    }
    for (const mod of line.modifiers) {
      const modifier = getModifier(state, mod.modifierId)
      if (modifier.stockEffectType === 'add' && modifier.linkedStockItemId && modifier.stockQtyPerUse) {
        effects.set(
          modifier.linkedStockItemId,
          (effects.get(modifier.linkedStockItemId) ?? 0) + modifier.stockQtyPerUse * mod.qty * line.qty,
        )
      }
    }
  }
  return effects
}

function recalcTotals(state: AppState, order: Order): Order {
  const subtotal = order.lines.reduce((sum, line) => {
    const modifiersTotal = line.modifiers.reduce((mSum, m) => mSum + getModifier(state, m.modifierId).priceDelta * m.qty * line.qty, 0)
    return sum + line.qty * line.unitPrice + modifiersTotal
  }, 0)
  return { ...order, subtotal, total: subtotal - order.discount, updatedAt: today() }
}

function postMovement(state: AppState, args: Omit<StockMovement, 'id' | 'createdAt' | 'beforeQty' | 'afterQty' | 'unit'> & { qtyChange: number }) {
  const stockItem = state.stockItems.find((s) => s.id === args.stockItemId)
  if (!stockItem) throw new Error(`Missing stock item ${args.stockItemId}`)
  const beforeQty = stockItem.currentQty
  const afterQty = Number((beforeQty + args.qtyChange).toFixed(4))
  if (afterQty < 0) throw new Error(`Insufficient stock for ${stockItem.name}. Need ${Math.abs(args.qtyChange)}, available ${beforeQty}`)
  stockItem.currentQty = afterQty
  const movement: StockMovement = {
    id: uid('mov'),
    stockItemId: args.stockItemId,
    movementType: args.movementType,
    qtyChange: args.qtyChange,
    beforeQty,
    afterQty,
    unit: stockItem.unit,
    referenceType: args.referenceType,
    referenceId: args.referenceId,
    user: args.user,
    notes: args.notes,
    createdAt: today(),
  }
  state.movements.unshift(movement)
}

function applyEffectsAsMovements(
  state: AppState,
  effects: Map<string, number>,
  movementType: MovementType,
  referenceId: string,
  user: string,
  notes?: string,
) {
  for (const [stockItemId, qty] of effects.entries()) {
    if (qty === 0) continue
    postMovement(state, {
      stockItemId,
      movementType,
      qtyChange: -qty,
      referenceType: 'order',
      referenceId,
      user,
      notes,
    })
  }
}

function createDraftOrder(state: AppState, createdBy: string) {
  const order: Order = {
    id: uid('ord'),
    orderType: 'dine_in',
    tableOrRef: '',
    status: 'draft',
    paymentStatus: 'unpaid',
    lines: [],
    subtotal: 0,
    discount: 0,
    total: 0,
    createdBy,
    createdAt: today(),
    updatedAt: today(),
  }
  state.orders.unshift(order)
  return order.id
}

function saveOrderVersion(state: AppState, order: Order, reason: string) {
  state.orderVersions.unshift({ orderId: order.id, snapshot: JSON.parse(JSON.stringify(order)), reason, createdAt: today() })
}

function sendOrder(state: AppState, orderId: string, user: string) {
  const order = state.orders.find((o) => o.id === orderId)
  if (!order) throw new Error('Order not found')
  if (order.status !== 'draft') throw new Error('Only draft orders can be sent')
  const effects = expandOrderToEffects(state, order)
  applyEffectsAsMovements(state, effects, 'sale', order.id, user, 'Order sent')
  order.status = 'sent'
  order.updatedAt = today()
  saveOrderVersion(state, order, 'send_order')
}

function editSentOrder(state: AppState, orderId: string, nextOrder: Order, user: string) {
  const existing = state.orders.find((o) => o.id === orderId)
  if (!existing) throw new Error('Order not found')
  const oldEffects = existing.status === 'draft' ? new Map<string, number>() : expandOrderToEffects(state, existing)
  const newEffects = nextOrder.status === 'draft' ? new Map<string, number>() : expandOrderToEffects(state, nextOrder)
  const ids = new Set([...oldEffects.keys(), ...newEffects.keys()])
  for (const stockItemId of ids) {
    const oldQty = oldEffects.get(stockItemId) ?? 0
    const newQty = newEffects.get(stockItemId) ?? 0
    const delta = Number((newQty - oldQty).toFixed(4))
    if (delta === 0 || existing.status === 'draft') continue
    postMovement(state, {
      stockItemId,
      movementType: delta > 0 ? 'sale_edit_add' : 'sale_edit_reduce',
      qtyChange: -delta,
      referenceType: 'order',
      referenceId: orderId,
      user,
      notes: 'Order edit delta',
    })
  }
  Object.assign(existing, recalcTotals(state, nextOrder), { updatedAt: today() })
  saveOrderVersion(state, existing, 'edit_order')
}

function cancelOrder(state: AppState, orderId: string, user: string) {
  const order = state.orders.find((o) => o.id === orderId)
  if (!order) throw new Error('Order not found')
  if (order.status === 'cancelled') return
  if (order.status !== 'draft') {
    const effects = expandOrderToEffects(state, order)
    for (const [stockItemId, qty] of effects.entries()) {
      postMovement(state, {
        stockItemId,
        movementType: 'sale_cancellation_reversal',
        qtyChange: qty,
        referenceType: 'order',
        referenceId: order.id,
        user,
        notes: 'Order cancelled',
      })
    }
  }
  order.status = 'cancelled'
  order.updatedAt = today()
  saveOrderVersion(state, order, 'cancel_order')
}

function completeBatch(state: AppState, batch: ProductionBatch) {
  const factor = batch.actualQty ?? batch.plannedQty
  if (batch.recipeId === 'prod_quarter_chicken') {
    postMovement(state, { stockItemId: 'raw_chicken_whole', movementType: 'production_input', qtyChange: -factor, referenceType: 'production_batch', referenceId: batch.id, user: batch.createdBy, notes: 'Whole chickens used' })
    postMovement(state, { stockItemId: 'fin_quarter_chicken', movementType: 'production_output', qtyChange: factor * 4, referenceType: 'production_batch', referenceId: batch.id, user: batch.createdBy, notes: 'Quarter chicken output' })
  }
  if (batch.recipeId === 'prod_chips') {
    postMovement(state, { stockItemId: 'raw_potatoes', movementType: 'production_input', qtyChange: -factor, referenceType: 'production_batch', referenceId: batch.id, user: batch.createdBy, notes: 'Raw potatoes used' })
    postMovement(state, { stockItemId: 'fin_chips_portion', movementType: 'production_output', qtyChange: factor * 4, referenceType: 'production_batch', referenceId: batch.id, user: batch.createdBy, notes: 'Chips output' })
  }
  if (batch.recipeId === 'prod_steak') {
    postMovement(state, { stockItemId: 'raw_beef_bulk', movementType: 'production_input', qtyChange: -factor, referenceType: 'production_batch', referenceId: batch.id, user: batch.createdBy, notes: 'Bulk steak used' })
    postMovement(state, { stockItemId: 'fin_steak_portion', movementType: 'production_output', qtyChange: factor * 4, referenceType: 'production_batch', referenceId: batch.id, user: batch.createdBy, notes: 'Steak portions output' })
  }
  if (batch.wasteQty && batch.wasteQty > 0) {
    postMovement(state, { stockItemId: batch.outputStockItemId, movementType: 'wastage', qtyChange: -batch.wasteQty, referenceType: 'production_batch', referenceId: batch.id, user: batch.createdBy, notes: 'Batch waste' })
  }
  const existing = state.batches.find((b) => b.id === batch.id)
  if (existing) Object.assign(existing, batch, { status: 'completed', completedAt: today() })
}

function receiveStock(state: AppState, stockItemId: string, qty: number, user: string) {
  postMovement(state, { stockItemId, movementType: 'receive', qtyChange: qty, referenceType: 'goods_receipt', referenceId: uid('grn'), user, notes: 'Manual receive' })
}

function stockTakeAdjust(state: AppState, stockItemId: string, countedQty: number, user: string) {
  const item = state.stockItems.find((s) => s.id === stockItemId)
  if (!item) throw new Error('Stock item not found')
  const diff = Number((countedQty - item.currentQty).toFixed(4))
  if (diff === 0) return
  postMovement(state, { stockItemId, movementType: 'stock_take_adjustment', qtyChange: diff, referenceType: 'stock_take', referenceId: uid('st'), user, notes: `Counted ${countedQty}` })
}

function App() {
  const [state, setState] = useState<AppState>(() => loadState())
  const [tab, setTab] = useState<'dashboard' | 'inventory' | 'pos' | 'production' | 'reports'>('dashboard')
  const [error, setError] = useState<string>('')
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null)
  const [userName] = useState('Admin')

  useEffect(() => saveState(state), [state])

  const currentOrder = useMemo(() => state.orders.find((o) => o.id === currentOrderId) ?? null, [state.orders, currentOrderId])

  const run = (fn: () => void) => {
    try {
      setError('')
      setState((prev) => {
        const next = JSON.parse(JSON.stringify(prev)) as AppState
        fn.call(null)
        return next
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  const safeSetState = (updater: (draft: AppState) => void) => {
    try {
      setError('')
      setState((prev) => {
        const next = JSON.parse(JSON.stringify(prev)) as AppState
        updater(next)
        return next
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  const lowStock = state.stockItems.filter((s) => s.currentQty <= s.minQty)
  const sentOrders = state.orders.filter((o) => o.status === 'sent')

  return (
    <div style={{ fontFamily: 'Inter, Arial, sans-serif', padding: 16, maxWidth: 1200, margin: '0 auto', color: '#1f2937' }}>
      <h1 style={{ marginBottom: 6 }}>Restaurant Ops Phase 1 Engine</h1>
      <p style={{ marginTop: 0, color: '#6b7280' }}>Deployable Vite starter with inventory ledger, POS deduction, production batches, stock take, and reports.</p>
      {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: 12, borderRadius: 10, marginBottom: 12 }}>{error}</div>}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {['dashboard', 'inventory', 'pos', 'production', 'reports'].map((t) => (
          <button key={t} onClick={() => setTab(t as typeof tab)} style={{ padding: '10px 14px', borderRadius: 12, border: '1px solid #d1d5db', background: tab === t ? '#111827' : '#fff', color: tab === t ? '#fff' : '#111827' }}>
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
        <button onClick={() => { localStorage.removeItem(STORAGE_KEY); setState(seedState()); setCurrentOrderId(null) }} style={{ marginLeft: 'auto', padding: '10px 14px', borderRadius: 12, border: '1px solid #d1d5db', background: '#fff' }}>Reset Demo Data</button>
      </div>

      {tab === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: 16 }}>
          <Card title="Low stock items">
            {lowStock.length ? lowStock.map((s) => <Row key={s.id} left={s.name} right={`${s.currentQty} ${s.unit}`} />) : <Muted>None</Muted>}
          </Card>
          <Card title="Open sent orders">
            {sentOrders.length ? sentOrders.map((o) => <Row key={o.id} left={o.tableOrRef || o.id} right={money(o.total)} />) : <Muted>None</Muted>}
          </Card>
          <Card title="Ledger movements">
            <div style={{ fontSize: 30, fontWeight: 700 }}>{state.movements.length}</div>
            <Muted>Total auditable stock movements</Muted>
          </Card>
          <Card title="Production batches">
            <div style={{ fontSize: 30, fontWeight: 700 }}>{state.batches.length}</div>
            <Muted>Draft and completed batches</Muted>
          </Card>
        </div>
      )}

      {tab === 'inventory' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16 }}>
          <Card title="Current stock">
            <table style={tableStyle}><thead><tr><Th>Item</Th><Th>Category</Th><Th>Qty</Th><Th>Min</Th></tr></thead><tbody>
              {state.stockItems.map((s) => <tr key={s.id}><Td>{s.name}</Td><Td>{s.category}</Td><Td>{s.currentQty} {s.unit}</Td><Td>{s.minQty}</Td></tr>)}
            </tbody></table>
          </Card>
          <div style={{ display: 'grid', gap: 16 }}>
            <ReceivingPanel state={state} onReceive={(stockItemId, qty) => safeSetState((draft) => receiveStock(draft, stockItemId, qty, userName))} />
            <StockTakePanel state={state} onAdjust={(stockItemId, counted) => safeSetState((draft) => stockTakeAdjust(draft, stockItemId, counted, userName))} />
          </div>
        </div>
      )}

      {tab === 'pos' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 16 }}>
          <Card title="POS order editor">
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <button onClick={() => safeSetState((draft) => { const id = createDraftOrder(draft, userName); setCurrentOrderId(id) })} style={primaryBtn}>New draft order</button>
              {currentOrder && <button onClick={() => safeSetState((draft) => sendOrder(draft, currentOrder.id, userName))} style={secondaryBtn}>Send order</button>}
              {currentOrder && <button onClick={() => safeSetState((draft) => cancelOrder(draft, currentOrder.id, userName))} style={dangerBtn}>Cancel order</button>}
            </div>
            <select value={currentOrderId ?? ''} onChange={(e) => setCurrentOrderId(e.target.value || null)} style={inputStyle}>
              <option value="">Select order</option>
              {state.orders.map((o) => <option key={o.id} value={o.id}>{o.id} · {o.status} · {o.tableOrRef || 'No ref'}</option>)}
            </select>
            {currentOrder ? <OrderEditor state={state} order={currentOrder} onChange={(next) => safeSetState((draft) => {
              if (next.status === 'draft') {
                const idx = draft.orders.findIndex((o) => o.id === next.id)
                draft.orders[idx] = recalcTotals(draft, next)
              } else {
                editSentOrder(draft, next.id, recalcTotals(draft, next), userName)
              }
            })} /> : <Muted>Create or select an order.</Muted>}
          </Card>
          <Card title="Order list">
            <table style={tableStyle}><thead><tr><Th>ID</Th><Th>Status</Th><Th>Ref</Th><Th>Total</Th></tr></thead><tbody>
              {state.orders.map((o) => <tr key={o.id}><Td>{o.id}</Td><Td>{o.status}</Td><Td>{o.tableOrRef || '-'}</Td><Td>{money(o.total)}</Td></tr>)}
            </tbody></table>
          </Card>
        </div>
      )}

      {tab === 'production' && (
        <ProductionScreen state={state} onComplete={(batch) => safeSetState((draft) => {
          draft.batches.unshift(batch)
          completeBatch(draft, batch)
        })} />
      )}

      {tab === 'reports' && (
        <div style={{ display: 'grid', gap: 16 }}>
          <Card title="Recent movements">
            <table style={tableStyle}><thead><tr><Th>When</Th><Th>Type</Th><Th>Item</Th><Th>Change</Th><Th>Ref</Th></tr></thead><tbody>
              {state.movements.slice(0, 25).map((m) => {
                const item = state.stockItems.find((s) => s.id === m.stockItemId)
                return <tr key={m.id}><Td>{new Date(m.createdAt).toLocaleString()}</Td><Td>{m.movementType}</Td><Td>{item?.name}</Td><Td>{m.qtyChange}</Td><Td>{m.referenceType}:{m.referenceId}</Td></tr>
              })}
            </tbody></table>
          </Card>
          <Card title="Current stock report">
            <table style={tableStyle}><thead><tr><Th>Item</Th><Th>Qty</Th><Th>Status</Th></tr></thead><tbody>
              {state.stockItems.map((s) => <tr key={s.id}><Td>{s.name}</Td><Td>{s.currentQty} {s.unit}</Td><Td>{s.currentQty <= s.minQty ? 'Low' : 'OK'}</Td></tr>)}
            </tbody></table>
          </Card>
        </div>
      )}
    </div>
  )
}

function ReceivingPanel({ state, onReceive }: { state: AppState; onReceive: (stockItemId: string, qty: number) => void }) {
  const [stockItemId, setStockItemId] = useState(state.stockItems[0]?.id ?? '')
  const [qty, setQty] = useState(1)
  return <Card title="Receive stock">
    <select value={stockItemId} onChange={(e) => setStockItemId(e.target.value)} style={inputStyle}>{state.stockItems.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
    <input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} style={inputStyle} />
    <button style={primaryBtn} onClick={() => onReceive(stockItemId, qty)}>Post receive</button>
  </Card>
}

function StockTakePanel({ state, onAdjust }: { state: AppState; onAdjust: (stockItemId: string, counted: number) => void }) {
  const [stockItemId, setStockItemId] = useState(state.stockItems[0]?.id ?? '')
  const [counted, setCounted] = useState(0)
  const item = state.stockItems.find((s) => s.id === stockItemId)
  return <Card title="Stock take adjustment">
    <select value={stockItemId} onChange={(e) => { setStockItemId(e.target.value); const found = state.stockItems.find((s) => s.id === e.target.value); setCounted(found?.currentQty ?? 0) }} style={inputStyle}>{state.stockItems.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
    <Muted>System qty: {item?.currentQty} {item?.unit}</Muted>
    <input type="number" value={counted} onChange={(e) => setCounted(Number(e.target.value))} style={inputStyle} />
    <button style={secondaryBtn} onClick={() => onAdjust(stockItemId, counted)}>Post stock take variance</button>
  </Card>
}

function OrderEditor({ state, order, onChange }: { state: AppState; order: Order; onChange: (order: Order) => void }) {
  const addLine = (productId: string) => {
    const product = getProduct(state, productId)
    onChange(recalcTotals(state, { ...order, lines: [...order.lines, { id: uid('line'), productId, qty: 1, unitPrice: product.basePrice, modifiers: [] }] }))
  }
  return <div>
    <input placeholder="Table / Ref" value={order.tableOrRef} onChange={(e) => onChange({ ...order, tableOrRef: e.target.value })} style={inputStyle} />
    <select value={order.orderType} onChange={(e) => onChange({ ...order, orderType: e.target.value as Order['orderType'] })} style={inputStyle}>
      <option value="dine_in">Dine in</option>
      <option value="takeaway">Takeaway</option>
    </select>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
      {state.products.map((p) => <button key={p.id} style={secondaryBtn} onClick={() => addLine(p.id)}>{p.name}</button>)}
    </div>
    {order.lines.map((line, idx) => {
      const product = getProduct(state, line.productId)
      return <div key={line.id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 12, marginBottom: 10 }}>
        <strong>{product.name}</strong>
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px', gap: 8, marginTop: 8 }}>
          <input type="number" value={line.qty} onChange={(e) => {
            const next = { ...order, lines: order.lines.map((l, i) => i === idx ? { ...l, qty: Number(e.target.value) } : l) }
            onChange(recalcTotals(state, next))
          }} style={inputStyle} />
          <input placeholder="Notes" value={line.notes ?? ''} onChange={(e) => {
            const next = { ...order, lines: order.lines.map((l, i) => i === idx ? { ...l, notes: e.target.value } : l) }
            onChange(next)
          }} style={inputStyle} />
          <button style={dangerBtn} onClick={() => onChange(recalcTotals(state, { ...order, lines: order.lines.filter((_, i) => i !== idx) }))}>Remove</button>
        </div>
        <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {state.modifiers.map((m) => {
            const exists = line.modifiers.find((lm) => lm.modifierId === m.id)
            return <button key={m.id} style={exists ? primaryBtn : secondaryBtn} onClick={() => {
              const nextMods = exists ? line.modifiers.filter((lm) => lm.modifierId !== m.id) : [...line.modifiers, { modifierId: m.id, qty: 1 }]
              const next = { ...order, lines: order.lines.map((l, i) => i === idx ? { ...l, modifiers: nextMods } : l) }
              onChange(recalcTotals(state, next))
            }}>{m.name}</button>
          })}
        </div>
      </div>
    })}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
      <Metric label="Subtotal" value={money(order.subtotal)} />
      <Metric label="Total" value={money(order.total)} />
    </div>
  </div>
}

function ProductionScreen({ state, onComplete }: { state: AppState; onComplete: (batch: ProductionBatch) => void }) {
  const [recipeId, setRecipeId] = useState<'prod_quarter_chicken' | 'prod_chips' | 'prod_steak'>('prod_quarter_chicken')
  const [plannedQty, setPlannedQty] = useState(1)
  const [wasteQty, setWasteQty] = useState(0)
  const map = {
    prod_quarter_chicken: { outputStockItemId: 'fin_quarter_chicken', label: 'Whole Chicken → Quarter Portions' },
    prod_chips: { outputStockItemId: 'fin_chips_portion', label: 'Potatoes → Chips Portions' },
    prod_steak: { outputStockItemId: 'fin_steak_portion', label: 'Beef Bulk → Steak Portions' },
  }
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
    <Card title="Complete production batch">
      <select value={recipeId} onChange={(e) => setRecipeId(e.target.value as typeof recipeId)} style={inputStyle}>
        {Object.entries(map).map(([id, cfg]) => <option key={id} value={id}>{cfg.label}</option>)}
      </select>
      <input type="number" value={plannedQty} onChange={(e) => setPlannedQty(Number(e.target.value))} style={inputStyle} />
      <input type="number" value={wasteQty} onChange={(e) => setWasteQty(Number(e.target.value))} style={inputStyle} placeholder="Waste qty" />
      <button style={primaryBtn} onClick={() => onComplete({ id: uid('batch'), recipeId, outputStockItemId: map[recipeId].outputStockItemId, plannedQty, actualQty: plannedQty, status: 'draft', createdBy: 'Admin', createdAt: today(), wasteQty })}>Complete batch</button>
    </Card>
    <Card title="Batch history">
      <table style={tableStyle}><thead><tr><Th>ID</Th><Th>Recipe</Th><Th>Status</Th><Th>Qty</Th></tr></thead><tbody>
        {state.batches.map((b) => <tr key={b.id}><Td>{b.id}</Td><Td>{b.recipeId}</Td><Td>{b.status}</Td><Td>{b.actualQty ?? b.plannedQty}</Td></tr>)}
      </tbody></table>
    </Card>
  </div>
}

function Card({ title, children }: React.PropsWithChildren<{ title: string }>) {
  return <section style={{ border: '1px solid #e5e7eb', borderRadius: 18, padding: 16, background: '#fff' }}><h3 style={{ marginTop: 0 }}>{title}</h3>{children}</section>
}
function Row({ left, right }: { left: string; right: string }) {
  return <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}><span>{left}</span><strong>{right}</strong></div>
}
function Muted({ children }: React.PropsWithChildren) { return <div style={{ color: '#6b7280' }}>{children}</div> }
function Metric({ label, value }: { label: string; value: string }) { return <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 12 }}><Muted>{label}</Muted><div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div></div> }
const inputStyle: React.CSSProperties = { width: '100%', padding: 10, borderRadius: 12, border: '1px solid #d1d5db', marginBottom: 8, boxSizing: 'border-box' }
const primaryBtn: React.CSSProperties = { padding: '10px 12px', borderRadius: 12, border: '1px solid #111827', background: '#111827', color: '#fff' }
const secondaryBtn: React.CSSProperties = { padding: '10px 12px', borderRadius: 12, border: '1px solid #d1d5db', background: '#fff', color: '#111827' }
const dangerBtn: React.CSSProperties = { padding: '10px 12px', borderRadius: 12, border: '1px solid #ef4444', background: '#fff', color: '#b91c1c' }
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse' }
const Th = ({ children }: React.PropsWithChildren) => <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e5e7eb' }}>{children}</th>
const Td = ({ children }: React.PropsWithChildren) => <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6' }}>{children}</td>

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>)
