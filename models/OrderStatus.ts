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

export function toColorCode(orderStatus: OrderStatus) {
  switch (orderStatus) {
    case OrderStatus.New:
      return 'gray-800'
    case OrderStatus.WarehouseRF:
      return 'indigo-800'
    case OrderStatus.Courier1:
    case OrderStatus.Courier2:
      return 'rose-800'
    case OrderStatus.ProcessedInTbilisi:
      return 'blue-800'
    case OrderStatus.ReadyForDeliveryInTbilisi:
    case OrderStatus.WarehouseTbilisi:
      return 'amber-800'
    case OrderStatus.ReadyForDeliveryByPony:
    case OrderStatus.WaitingForDeliveryByPony:
      return 'violet-800'
    case OrderStatus.Delivered:
      return 'emerald-800'
  }
}
