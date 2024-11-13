import type { OrderStatus } from './OrderStatus'

export interface Message {
  id: number
  name: string
  text: string
  order_status: OrderStatus
}

export interface MessageRequest {
  name: string
  text: string
  order_status: OrderStatus
}
