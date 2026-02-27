import { AxiosError } from 'axios'
import * as Sentry from '@sentry/nuxt'

export function logError(err: unknown) {
	Sentry.captureException(err)
}

export function setUser(id: string = 'unknown', username: string = 'unknown') {
	Sentry.setUser({
		id: id,
		username: username,
	})
}
