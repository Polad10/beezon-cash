export const DateType = {
	Creation: 'creation',
	Delivery: 'delivery',
	Payment: 'payment',
} as const

export type DateType = (typeof DateType)[keyof typeof DateType]
