export const OrderStatusGeRu = {
  New: 'New',
  InvoiceCreated: 'InvoiceCreated',
  DrivingInRf: 'DrivingInRf',
  Delivered: 'Delivered',
} as const

export type OrderStatusGeRu = (typeof OrderStatusGeRu)[keyof typeof OrderStatusGeRu]

export function toAdminDisplayString(orderStatus: OrderStatusGeRu) {
  switch (orderStatus) {
    case OrderStatusGeRu.New:
      return 'Создан'
    case OrderStatusGeRu.InvoiceCreated:
      return 'Создана накладная'
    case OrderStatusGeRu.DrivingInRf:
      return 'Поехало внутри РФ'
    case OrderStatusGeRu.Delivered:
      return 'Доставлен'
  }
}

export function toAdminColorCode(orderStatus: OrderStatusGeRu) {
  switch (orderStatus) {
    case OrderStatusGeRu.New:
      return '#ECECEC'
    case OrderStatusGeRu.InvoiceCreated:
      return '#B9C4FF'
    case OrderStatusGeRu.DrivingInRf:
      return '#FFD6B9'
    case OrderStatusGeRu.Delivered:
      return '#C3C3C3'
  }
}
