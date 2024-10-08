import type { OrderStatus } from './OrderStatus'

export interface Order {
  id: string
  date: Date
  original_price: number
  current_price: number
  status: OrderStatus
  bonus_received: number | null | undefined
  code: number
}
