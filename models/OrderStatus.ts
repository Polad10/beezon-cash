export enum OrderStatus {
  New,
  WarehouseRF,
  Courier1,
  Courier2,
  ProcessedInTbilisi,
  ReadyForDeliveryInTbilisi,
  WarehouseTbilisi,
  ReadyForDeliveryByPony,
  WaitingForDeliveryByPony,
  Delivered,
}

export function toAdminDisplayString(orderStatus: OrderStatus) {
  switch (orderStatus) {
    case OrderStatus.New:
      return 'Создан'
    case OrderStatus.WarehouseRF:
      return 'Склад РФ'
    case OrderStatus.Courier1:
      return 'Курьер 1'
    case OrderStatus.Courier2:
      return 'Курьер 2'
    case OrderStatus.ProcessedInTbilisi:
      return 'Собран в Тбилиси'
    case OrderStatus.ReadyForDeliveryInTbilisi:
      return 'Рассылка Тбилиси'
    case OrderStatus.WarehouseTbilisi:
      return 'На складе в Тбилиси'
    case OrderStatus.ReadyForDeliveryByPony:
      return 'Рассылка PONY'
    case OrderStatus.WaitingForDeliveryByPony:
      return 'Ожидает отправки в PONY'
    case OrderStatus.Delivered:
      return 'Доставлен'
  }
}

export function toClientDisplayString(orderStatus: OrderStatus) {
  switch (orderStatus) {
    case OrderStatus.New:
      return 'Создан'
    case OrderStatus.WarehouseRF:
      return 'Передается в доставку'
    case OrderStatus.Courier1:
    case OrderStatus.Courier2:
      return 'В пути'
    case OrderStatus.ProcessedInTbilisi:
      return 'Сортировка'
    case OrderStatus.ReadyForDeliveryInTbilisi:
    case OrderStatus.WarehouseTbilisi:
      return 'Готов к выдаче'
    case OrderStatus.ReadyForDeliveryByPony:
    case OrderStatus.WaitingForDeliveryByPony:
      return 'На складе в Тбилиси'
    case OrderStatus.Delivered:
      return 'Доставлен'
  }
}

export function toAdminColorCode(orderStatus: OrderStatus) {
  switch (orderStatus) {
    case OrderStatus.New:
      return '#ECECEC'
    case OrderStatus.WarehouseRF:
      return '#B9C4FF'
    case OrderStatus.Courier1:
      return '#FFD6B9'
    case OrderStatus.Courier2:
      return '#FFF2B9'
    case OrderStatus.ProcessedInTbilisi:
      return '#B9D7EC'
    case OrderStatus.ReadyForDeliveryInTbilisi:
      return '#D5F0CA'
    case OrderStatus.WarehouseTbilisi:
      return '#BEB7FF'
    case OrderStatus.ReadyForDeliveryByPony:
      return '#EED5FF'
    case OrderStatus.WaitingForDeliveryByPony:
      return '#FFB7DC'
    case OrderStatus.Delivered:
      return '#C3C3C3'
  }
}

export function toClientColorCode(orderStatus: OrderStatus) {
  switch (orderStatus) {
    case OrderStatus.New:
      return '#ECECEC'
    case OrderStatus.WarehouseRF:
      return '#B9C4FF'
    case OrderStatus.Courier1:
    case OrderStatus.Courier2:
      return '#FFD6B9'
    case OrderStatus.ProcessedInTbilisi:
      return '#B9D7EC'
    case OrderStatus.ReadyForDeliveryInTbilisi:
    case OrderStatus.WarehouseTbilisi:
      return '#D5F0CA'
    case OrderStatus.ReadyForDeliveryByPony:
    case OrderStatus.WaitingForDeliveryByPony:
      return '#EED5FF'
    case OrderStatus.Delivered:
      return '#C3C3C3'
  }
}
