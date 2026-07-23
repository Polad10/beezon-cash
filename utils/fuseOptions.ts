import type { Order } from '~/models/Order'
import type { OrderGeRu } from '~/models/OrderGeRu'
import type { OrderGeEu } from '~/models/OrderGeEu'
import type { User } from '~/models/User'

export const fuseUsersOptions = {
	keys: [
		'id',
		'tg_username',
		'last_name',
		'first_name',
		'phone_nr',
		'referral_code',
		'invited_by',
		{ name: 'full_name', getFn: (user: User) => `${user.first_name} ${user.last_name}` },
	],
	threshold: 0.1,
}

export const fuseSelectUserOptions = {
	keys: [
		'tg_username',
		'last_name',
		'first_name',
		{ name: 'full_name', getFn: (user: User) => `${user.first_name} ${user.last_name}` },
	],
	threshold: 0.1,
}

export const fuseOrdersOptions = {
	keys: [
		'user.tg_username',
		'user.last_name',
		'user.first_name',
		'code',
		'description',
		'order_tracks.track_number',
		{ name: 'full_name', getFn: (order: Order) => `${order.user?.first_name} ${order.user?.last_name}` },
	],
	threshold: 0.1,
}

export const fuseGeRuOrdersOptions = {
	keys: [
		'user.tg_username',
		'user.last_name',
		'user.first_name',
		'code',
		'description',
		'cdek_track_nr',
		{ name: 'full_name', getFn: (order: OrderGeRu) => `${order.user?.first_name} ${order.user?.last_name}` },
	],
	threshold: 0.1,
}

export const fuseGeEuOrdersOptions = {
	keys: [
		'user.tg_username',
		'user.last_name',
		'user.first_name',
		'code',
		'description',
		'track_nr',
		{ name: 'full_name', getFn: (order: OrderGeEu) => `${order.user?.first_name} ${order.user?.last_name}` },
	],
	threshold: 0.1,
}
