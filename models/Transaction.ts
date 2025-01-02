import type Decimal from 'decimal.js'
import type { TransactionType } from './TransactionType'

export interface Transaction {
  id: string
  datetime: Date
  order_id: string
  user_id: string
  type: TransactionType
  amount: Decimal
}
