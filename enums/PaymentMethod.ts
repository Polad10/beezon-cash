export const PaymentMethod = {
	NotPaid: 'NotPaid',
	TBC: 'TBC',
	Tinkoff: 'Tinkoff',
	Cash: 'Cash',
} as const

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod]

export function toAdminDisplayString(paymentMethod: PaymentMethod) {
	switch (paymentMethod) {
		case PaymentMethod.NotPaid:
			return 'Не оплачен'
		case PaymentMethod.TBC:
			return 'TBC'
		case PaymentMethod.Tinkoff:
			return 'Тинькофф'
		case PaymentMethod.Cash:
			return 'Наличные'
	}
}

export function toAdminColorCode(paymentMethod: PaymentMethod) {
	switch (paymentMethod) {
		case PaymentMethod.NotPaid:
			return '#ECECEC'
		case PaymentMethod.TBC:
			return '#B9C4FF'
		case PaymentMethod.Tinkoff:
			return '#FFD6B9'
		case PaymentMethod.Cash:
			return '#8ae5dc'
	}
}
