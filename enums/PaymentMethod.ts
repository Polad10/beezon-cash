export const PaymentMethod = {
	NotPaid: 'NotPaid',
	TBCGel: 'TBCGel',
	Tinkoff: 'Tinkoff',
	Cash: 'Cash',
	Terminal: 'Terminal',
	CREDOGel: 'CREDOGel',
	BOGGel: 'BOGGel',
	TBCEur: 'TBCEur',
	CREDOEur: 'CREDOEur',
	BOGEur: 'BOGEur',
	TBCUsd: 'TBCUsd',
	CREDOUsd: 'CREDOUsd',
	BOGUsd: 'BOGUsd',
	USDT: 'USDT',
} as const

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod]

export function toAdminDisplayString(paymentMethod: PaymentMethod) {
	switch (paymentMethod) {
		case PaymentMethod.NotPaid:
			return 'Не оплачен'
		case PaymentMethod.TBCGel:
			return 'TBC GEL'
		case PaymentMethod.Tinkoff:
			return 'Тинькофф'
		case PaymentMethod.Cash:
			return 'Наличные'
		case PaymentMethod.Terminal:
			return 'Терминал'
		case PaymentMethod.CREDOGel:
			return 'CREDO GEL'
		case PaymentMethod.BOGGel:
			return 'BOG GEL'
		case PaymentMethod.TBCEur:
			return 'TBC EURO'
		case PaymentMethod.CREDOEur:
			return 'CREDO EURO'
		case PaymentMethod.BOGEur:
			return 'BOG EURO'
		case PaymentMethod.TBCUsd:
			return 'TBC USD'
		case PaymentMethod.CREDOUsd:
			return 'CREDO USD'
		case PaymentMethod.BOGUsd:
			return 'BOG USD'
		case PaymentMethod.USDT:
			return 'USDT'
	}
}

export function toAdminColorCode(paymentMethod: PaymentMethod): string {
	switch (paymentMethod) {
		case PaymentMethod.NotPaid:
			return '#E5E7EB'
		case PaymentMethod.TBCGel:
			return '#BFDBFE'
		case PaymentMethod.Tinkoff:
			return '#FCA5A5'
		case PaymentMethod.Cash:
			return '#D8B4FE'
		case PaymentMethod.Terminal:
			return '#F9A8D4'
		case PaymentMethod.CREDOGel:
			return '#FDE68A'
		case PaymentMethod.BOGGel:
			return '#A7F3D0'
		case PaymentMethod.TBCEur:
			return '#93C5FD'
		case PaymentMethod.CREDOEur:
			return '#FCD34D'
		case PaymentMethod.BOGEur:
			return '#6EE7B7'
		case PaymentMethod.TBCUsd:
			return '#60A5FA'
		case PaymentMethod.CREDOUsd:
			return '#FBBF24'
		case PaymentMethod.BOGUsd:
			return '#34D399'
		case PaymentMethod.USDT:
			return '#5EEAD4'
	}
}
