export const OrderStatusGeEu = {
	New: 'New',
	InvoiceCreated: 'InvoiceCreated',
	TakenByCourier: 'TakenByCourier',
	DrivingInEu: 'DrivingInEu',
	Delivered: 'Delivered',
} as const

export type OrderStatusGeEu = (typeof OrderStatusGeEu)[keyof typeof OrderStatusGeEu]

export function toAdminDisplayString(orderStatus: OrderStatusGeEu) {
	switch (orderStatus) {
		case OrderStatusGeEu.New:
			return 'Создан'
		case OrderStatusGeEu.InvoiceCreated:
			return 'Создана накладная'
		case OrderStatusGeEu.TakenByCourier:
			return 'Забрал курьер'
		case OrderStatusGeEu.DrivingInEu:
			return 'Поехало внутри ЕС'
		case OrderStatusGeEu.Delivered:
			return 'Доставлен'
	}
}

export function toAdminColorCode(orderStatus: OrderStatusGeEu) {
	switch (orderStatus) {
		case OrderStatusGeEu.New:
			return '#ECECEC'
		case OrderStatusGeEu.InvoiceCreated:
			return '#B9C4FF'
		case OrderStatusGeEu.TakenByCourier:
			return '#D8B4FE'
		case OrderStatusGeEu.DrivingInEu:
			return '#FFD6B9'
		case OrderStatusGeEu.Delivered:
			return '#C3C3C3'
	}
}
