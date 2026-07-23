import type Decimal from 'decimal.js'
import type { OrderStatusGeEu } from '~/enums/OrderStatusGeEu'
import type { User } from './User'
import type { PaymentMethod } from '~/enums/PaymentMethod'

export interface OrderGeEu {
	id: string
	hint_price: string
	original_price: Decimal
	current_price: Decimal
	status: OrderStatusGeEu
	user_id: string
	code: number
	description: string | null
	weight: Decimal
	weight_rounded: boolean
	receiver_name: string
	receiver_phone_nr: string
	receiver_address: string
	track_nr: string | null
	created_at: Date
	delivered_at: Date | null
	user?: User
	payment_method: PaymentMethod
	payment_date: Date | null
}

export interface OrderGeEuRequest {
	original_price?: Decimal
	current_price?: Decimal
	status?: OrderStatusGeEu
	user_id: string
	description?: string
	weight?: Decimal
	weight_rounded?: boolean
	hint_price: string
	receiver_name: string
	receiver_phone_nr: string
	receiver_address: string
	track_nr?: string
	payment_method?: PaymentMethod
	send_notification?: boolean
}

export interface OrderGeEuPatchRequest {
	status?: OrderStatusGeEu
	payment_method?: PaymentMethod
	send_notification?: boolean
}

export interface OrderGeEuBatchPatchRequest {
	patches: { id: string; status: OrderStatusGeEu }[]
	send_notification?: boolean
}
