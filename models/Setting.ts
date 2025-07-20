import type Decimal from 'decimal.js'

export interface Setting {
	id: number
	exchange_rate: Decimal
}

export interface UpdateSettingRequest {
	exchange_rate: Decimal
}
