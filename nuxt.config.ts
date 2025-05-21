// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  app: {
    head: {
      title: 'Beezon',
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon-96x96.png',
          sizes: '96x96',
        },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg',
        },
        {
          rel: 'shortcut icon',
          href: '/favicon.ico',
        },
        {
          rel: 'apple-touch-icon',
          href: '/apple-touch-icon.png',
          sizes: '180x180',
        },
        {
          rel: 'manifest',
          href: '/site.webmanifest',
        },
        {
          rel: 'manifest',
          href: '/site.webmanifest',
        },
      ],
      meta: [{ charset: 'utf-8' }, { name: 'description', content: 'Beezon Logistics' }],
    },
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['@/assets/css/tailwind.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: ['@kgierke/nuxt-basic-auth', 'nuxt-mongoose'],
  basicAuth: {
    enabled: true,
    users: [
      {
        username: process.env.ADMIN_USERNAME!,
        password: process.env.ADMIN_PASSWORD!,
      },
    ],
    allowedRoutes: ['/neworder', '/geruorder', '/client', '/api/public', '/api/client'],
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('ion-'),
    },
  },
  runtimeConfig: {
    public: {
      ENVIRONMENT: process.env.NUXT_ENVIRONMENT,
    },
  },
})
