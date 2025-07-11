import type Decimal from 'decimal.js'
import type { OrderStatus } from './OrderStatus'
import type { City } from './City'
import type { OrderTypeMapping, OrderTypeMappingRequest } from './OrderTypeMapping'
import type { OrderTrack, OrderTrackRequest } from './OrderTrack'
import type { User } from './User'
import type { PaymentMethod } from '~/enums/PaymentMethod'

export interface Order {
	id: string
	date: Date
	end_date?: Date
	original_price: Decimal
	current_price: Decimal
	status: OrderStatus
	bonus_received: Decimal
	user_id: string
	code: number
	city: City
	weight: Decimal
	weight_rounded: boolean
	additional_cost: Decimal
	partner_cost: Decimal
	description: string
	user?: User
	payment_method: PaymentMethod
	payment_date: Date | null
	order_type_mappings: OrderTypeMapping[]
	order_tracks: OrderTrack[]
}

export interface OrderRequest {
	original_price?: Decimal
	current_price?: Decimal
	status: OrderStatus
	bonus_received?: Decimal
	user_id: string
	city?: City
	weight?: Decimal
	weight_rounded: boolean
	additional_cost?: Decimal
	partner_cost?: Decimal
	description?: string
	payment_method?: PaymentMethod
	order_type_mappings: OrderTypeMappingRequest[]
	order_tracks: OrderTrackRequest[]
	send_notification?: boolean
}

export interface NewOrderRequest {
	city?: City
	description: string
	order_tracks: OrderTrackRequest[]
	order_type_mappings: OrderTypeMappingRequest[]
}

export interface OrderPatchRequest {
	status?: OrderStatus
	payment_method?: PaymentMethod
	send_notification?: boolean
}

export interface OrderBatchPatchRequest {
	patches: { id: string; status: OrderStatus }[]
	send_notification?: boolean
}
