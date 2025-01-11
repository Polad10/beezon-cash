import type { ErrorName } from '~/enums/exceptions/ErrorName'
import type { TelegramEntityErrorType } from '~/enums/exceptions/TelegramEntityErrorType'

export interface ErrorResponseData {
  errorName: ErrorName
  errorType: TelegramEntityErrorType // merge new enums by | NewEnumType
}
