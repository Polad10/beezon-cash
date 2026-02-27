import { HttpStatusCode } from 'axios'
import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'

export default defineNuxtRouteMiddleware(async (to) => {
	if (!to.path.startsWith('/admin') || to.path === '/admin/login') return

	try {
		const headers = process.server ? useRequestHeaders(['cookie']) : undefined

		await $fetch('/api/admin/me', { headers })
	} catch (ex: any) {
		if (ex?.statusCode === HttpStatusCode.Unauthorized) {
			return navigateTo('/admin/login', { replace: true })
		}

		logError(ex)
	}
})
