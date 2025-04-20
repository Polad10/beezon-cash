import type { OrderStatusGeRu } from '~/enums/OrderStatusGeRu'

export interface MessageGeRu {
  id: number
  name: string
  text: string
  order_status: OrderStatusGeRu
}

export interface MessageGeRuRequest {
  name: string
  text: string
  order_status: OrderStatusGeRu
}
