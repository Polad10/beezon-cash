export interface OrderTrack {
	id: string
	order_id: string
	delivery_provider: DeliveryProvider
	track_number?: string
}

export interface OrderTrackRequest {
	delivery_provider: DeliveryProvider
	track_number?: string
}

export enum DeliveryProvider {
	Ozon,
	Wilbderries,
	CDEK,
	PostRussia,
	Boxberry,
	POST5,
	DPD,
	Cold,
	AptekaRu,
}

export function toDisplayString(deliveryProvider: DeliveryProvider) {
	switch (deliveryProvider) {
		case DeliveryProvider.Ozon:
			return 'Ozon'
		case DeliveryProvider.Wilbderries:
			return 'Wildberries'
		case DeliveryProvider.CDEK:
			return 'CDEK'
		case DeliveryProvider.PostRussia:
			return 'Почта России'
		case DeliveryProvider.Boxberry:
			return 'Boxberry'
		case DeliveryProvider.POST5:
			return '5POST'
		case DeliveryProvider.DPD:
			return 'DPD'
		case DeliveryProvider.Cold:
			return 'Доставка в холоде'
		case DeliveryProvider.AptekaRu:
			return 'Аптека.ру'
	}
}
