import type Decimal from 'decimal.js'
import type { OrderStatusGeRu } from '~/enums/OrderStatusGeRu'
import type { User } from './User'
import type { PaymentMethod } from '~/enums/PaymentMethod'

export interface OrderGeRu {
	id: string
	hint_price: string
	original_price: Decimal
	current_price: Decimal
	status: OrderStatusGeRu
	user_id: string
	code: number
	description: string | null
	weight: Decimal
	weight_rounded: boolean
	receiver_name: string
	receiver_phone_nr: string
	receiver_address: string
	cdek_track_nr: string | null
	created_at: Date
	delivered_at: Date | null
	user?: User
	payment_method: PaymentMethod
	payment_date: Date | null
}

export interface OrderGeRuRequest {
	original_price?: Decimal
	current_price?: Decimal
	status?: OrderStatusGeRu
	user_id: string
	description?: string
	weight?: Decimal
	weight_rounded?: boolean
	hint_price: string
	receiver_name: string
	receiver_phone_nr: string
	receiver_address: string
	cdek_track_nr?: string
	send_notification?: boolean
}

export interface OrderGeRuPatchRequest {
	status?: OrderStatusGeRu
	payment_method?: PaymentMethod
	send_notification?: boolean
}

export interface OrderGeRuBatchPatchRequest {
	patches: { id: string; status: OrderStatusGeRu }[]
	send_notification?: boolean
}
