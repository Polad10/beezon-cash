import type Decimal from 'decimal.js'
import type { OrderStatus } from './OrderStatus'
import type { City } from './City'
import type { OrderTypeMapping, OrderTypeMappingRequest } from './OrderTypeMapping'
import type { OrderTrack, OrderTrackRequest } from './OrderTrack'
import type { User } from './User'

export interface Order {
  id: string
  date: Date
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
  order_type_mappings: OrderTypeMapping[]
  order_tracks: OrderTrack[]
}

export interface OrderRequest {
  date: Date
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
  order_type_mappings: OrderTypeMappingRequest[]
  order_tracks: OrderTrackRequest[]
  send_notification?: boolean
}
