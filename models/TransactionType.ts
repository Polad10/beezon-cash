export enum TransactionType {
  Deposit,
  Withdrawal,
}

export function toDisplayString(transactionType: TransactionType) {
  switch (transactionType) {
    case TransactionType.Deposit:
      return 'Начисление'
    case TransactionType.Withdrawal:
      return 'Списание'
  }
}

export function toColorCode(transactionType: TransactionType) {
  switch (transactionType) {
    case TransactionType.Deposit:
      return '#f0fdf4'
    case TransactionType.Withdrawal:
      return '#fef2f2'
  }
}

export function toTextColorCode(transactionType: TransactionType) {
  switch (transactionType) {
    case TransactionType.Deposit:
      return '#166534'
    case TransactionType.Withdrawal:
      return '#991b1b'
  }
}
