import { defineConfig } from 'cypress'

export default defineConfig({
	e2e: {
		experimentalStudio: true,
		viewportWidth: 1000,
		viewportHeight: 1280,
		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
	},
})
