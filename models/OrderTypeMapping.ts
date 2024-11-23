export interface OrderTypeMapping {
  id: string
  order_id: string
  order_type: OrderType
}

export interface OrderTypeMappingRequest {
  order_type: OrderType
}

export enum OrderType {
  Drugs,
  Electronics,
  Commercial,
}

export function toDisplayString(orderType: OrderType) {
  switch (orderType) {
    case OrderType.Drugs:
      return 'Drugs'
    case OrderType.Electronics:
      return 'Electronics'
    case OrderType.Commercial:
      return 'Commercial'
  }
}
