import { AxiosError } from 'axios'
import type { ErrorResponseData } from '~/models/ErrorResponseData'

export function getErrorResponse(ex: any) {
  if (ex instanceof AxiosError) {
    const error = ex as AxiosError
    return error.response
  }

  return null
}

export function getErrorResponseData(ex: any) {
  const response = getErrorResponse(ex)
  const data = response?.data as any

  if (data) {
    const errorResponseData = data.data as ErrorResponseData
    return errorResponseData
  }

  return null
}

export function getErrorResponseStatusCode(ex: any) {
  const response = getErrorResponse(ex)

  return response?.status
}
