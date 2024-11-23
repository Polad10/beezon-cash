export interface OrderTrack {
  id: string
  order_id: string
  delivery_provider: DeliveryProvider
  track_number: string
}

export interface OrderTrackRequest {
  delivery_provider: DeliveryProvider
  track_number: string
}

export enum DeliveryProvider {
  CDEK,
  Post,
  Boxberry,
  POST5,
}

export function toDisplayString(deliveryProvider: DeliveryProvider) {
  switch (deliveryProvider) {
    case DeliveryProvider.CDEK:
      return 'CDEK'
    case DeliveryProvider.Post:
      return 'Post'
    case DeliveryProvider.Boxberry:
      return 'Boxberry'
    case DeliveryProvider.POST5:
      return '5POST'
  }
}
