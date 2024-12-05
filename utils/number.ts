import Decimal from 'decimal.js'

export function isValidDecimal(value: string) {
  try {
    const decimal = new Decimal(value)

    return !decimal.isNaN()
  } catch {
    return false
  }
}
