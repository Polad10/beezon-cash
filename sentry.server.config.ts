import * as Sentry from '@sentry/nuxt'

Sentry.init({
	dsn: 'https://28918c437ba8254b5bdd9101fe95caeb@o4510585750880256.ingest.de.sentry.io/4510585757106256',

	// We recommend adjusting this value in production, or using tracesSampler
	// for finer control
	tracesSampleRate: 0.2,

	// Enable logs to be sent to Sentry
	enableLogs: true,

	// Enable sending of user PII (Personally Identifiable Information)
	// https://docs.sentry.io/platforms/javascript/guides/nuxt/configuration/options/#sendDefaultPii
	sendDefaultPii: true,

	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: false,

	environment: useRuntimeConfig().public.ENVIRONMENT,
})
