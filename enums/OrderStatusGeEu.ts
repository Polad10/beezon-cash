export const OrderStatusGeEu = {
	New: 'New',
	AtWarehouse1: 'AtWarehouse1',
	AtWarehouse2: 'AtWarehouse2',
	Delivering: 'Delivering',
	Delivered: 'Delivered',
} as const

export type OrderStatusGeEu = (typeof OrderStatusGeEu)[keyof typeof OrderStatusGeEu]

export function toAdminDisplayString(orderStatus: OrderStatusGeEu) {
	switch (orderStatus) {
		case OrderStatusGeEu.New:
			return 'Создан'
		case OrderStatusGeEu.AtWarehouse1:
			return 'На складе Церетели'
		case OrderStatusGeEu.AtWarehouse2:
			return 'На складе Ортачала'
		case OrderStatusGeEu.Delivering:
			return 'Доставляется'
		case OrderStatusGeEu.Delivered:
			return 'Доставлен'
	}
}

export function toAdminColorCode(orderStatus: OrderStatusGeEu) {
	switch (orderStatus) {
		case OrderStatusGeEu.New:
			return '#ECECEC'
		case OrderStatusGeEu.AtWarehouse1:
			return '#B9C4FF'
		case OrderStatusGeEu.AtWarehouse2:
			return '#D8B4FE'
		case OrderStatusGeEu.Delivering:
			return '#FFD6B9'
		case OrderStatusGeEu.Delivered:
			return '#C3C3C3'
	}
}
