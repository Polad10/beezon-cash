import type { Order } from '~/models/Order'

export function getMaxDiscountAmount(order: Order) {
	return order.current_price.dividedBy(4)
}

export function getFinalPrice(order: Order) {
	return order.current_price.add(order.partner_cost)
}

export function getOriginalFinalPrice(order: Order) {
	return order.original_price.add(order.partner_cost)
}
