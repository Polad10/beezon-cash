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
