import type { OrderStatusGeEu } from '~/enums/OrderStatusGeEu'

export interface MessageGeEu {
  id: number
  name: string
  text: string
  order_status: OrderStatusGeEu
}

export interface MessageGeEuRequest {
  name: string
  text: string
  order_status: OrderStatusGeEu
}
