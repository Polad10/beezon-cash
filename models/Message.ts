import type { OrderStatus } from './OrderStatus'

export interface Message {
  id: number
  name: string
  text: string
  order_status: OrderStatus
}
