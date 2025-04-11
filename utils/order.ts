import type { Order } from '~/models/Order'

export function getMaxDiscountAmount(order: Order) {
  return order.current_price.dividedBy(4)
}
