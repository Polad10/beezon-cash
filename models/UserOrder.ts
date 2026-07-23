import type { City } from './City'
import type { OrderTrackRequest } from './OrderTrack'
import type { OrderTypeMappingRequest } from './OrderTypeMapping'

export interface UserOrderRequest {
  first_name: string
  last_name: string
  phone_nr: string
  tg_username: string
  invite_code?: string
  description: string
  city?: City
  order_type_mappings: OrderTypeMappingRequest[]
  order_tracks: OrderTrackRequest[]
}

export interface UserGeRuOrderRequest {
  first_name: string
  last_name: string
  phone_nr: string
  tg_username: string
  receiver_name: string
  receiver_phone_nr: string
  receiver_address: string
  description: string
  hint_price: string
}

export interface UserGeEuOrderRequest {
  first_name: string
  last_name: string
  phone_nr: string
  tg_username: string
  receiver_name: string
  receiver_phone_nr: string
  receiver_address: string
  description: string
  hint_price: string
}
