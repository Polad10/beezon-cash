import { AxiosError } from 'axios'
import type { ErrorResponseData } from '~/models/ErrorResponseData'

export function getErrorResponseData(ex: any) {
  if (ex instanceof AxiosError) {
    const error = ex as AxiosError
    const data = error.response?.data as any

    if (data) {
      const errorResponseData = data.data as ErrorResponseData
      return errorResponseData
    }

    return null
  }

  return null
}
