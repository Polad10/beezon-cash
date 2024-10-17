import type Decimal from 'decimal.js'
import type { OrderStatus } from './OrderStatus'

export interface Order {
  id: string
  date: Date
  original_price: Decimal
  current_price: Decimal
  status: OrderStatus
  bonus_received: Decimal | null | undefined
  code: number
}
