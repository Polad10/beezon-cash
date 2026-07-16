export const PaymentMethod = {
	NotPaid: 'NotPaid',
	TBC: 'TBC',
	Tinkoff: 'Tinkoff',
	Cash: 'Cash',
	Terminal: 'Terminal',
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
		case PaymentMethod.Terminal:
			return 'Терминал'
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
			return '#D5F0CA'
		case PaymentMethod.Terminal:
			return '#D8B4FE'
	}
}
