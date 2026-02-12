export const MapOption = {
	Google: 'google',
	Yandex: 'yandex',
} as const

export type MapOption = (typeof MapOption)[keyof typeof MapOption]
