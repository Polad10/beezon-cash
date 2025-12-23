import { AxiosError } from 'axios'
import type { ErrorResponseData } from '~/models/ErrorResponseData'
import * as Sentry from '@sentry/nuxt'

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

export function logError(err: unknown) {
	Sentry.captureException(err)
}

export function setUser(id: string = 'unknown', username: string = 'unknown') {
	Sentry.setUser({
		id: id,
		username: username,
	})
}
