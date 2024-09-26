// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  devServer: {
    https: {
      key: 'localhost-key.pem',
      cert: 'localhost.pem',
    },
  },
})
