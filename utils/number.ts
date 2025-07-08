import Decimal from 'decimal.js'

export function isValidDecimal(value: string) {
	try {
		const decimal = new Decimal(value)

		return !decimal.isNaN()
	} catch {
		return false
	}
}

export function formatNumber(value: string) {
	return value.replace(',', '.')
}
