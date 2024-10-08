export enum OrderStatus {
  New,
  OnTheWay,
  ArrivedInDestinationCountry,
  WaitingForPayment,
  Delivered,
}

export function toDisplayString(orderStatus: OrderStatus) {
  switch (orderStatus) {
    case OrderStatus.New:
      return 'Создан'
    case OrderStatus.OnTheWay:
      return 'В пути'
    case OrderStatus.ArrivedInDestinationCountry:
      return 'Прибыл в Тбилиси'
    case OrderStatus.WaitingForPayment:
      return 'Ожидает оплаты'
    case OrderStatus.Delivered:
      return 'Доставлен'
  }
}

export function toColorCode(orderStatus: OrderStatus) {
  switch (orderStatus) {
    case OrderStatus.New:
      return 'primary'
    case OrderStatus.OnTheWay:
      return 'info'
    case OrderStatus.ArrivedInDestinationCountry:
      return 'warning'
    case OrderStatus.WaitingForPayment:
      return 'error'
    case OrderStatus.Delivered:
      return 'success'
  }
}
