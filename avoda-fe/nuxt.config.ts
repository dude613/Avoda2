// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  // css: ['~/assets/css/main.css'],
  modules: ['@vueuse/nuxt', '@nuxtjs/tailwindcss', 'shadcn-nuxt'],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui',
  },
  // vite: {
  //   plugins: [tailwindcss()],
  // },
  devServer: {
    port: 4000,
  },
  runtimeConfig: {
    public: {
      BASE_URL: import.meta.env.BASE_URL,
    },
  },
  routeRules: {
    '/': {
      ssr: false,
    },
    '/dashboard/**': {
      ssr: false,
      swr: true,
    },
  },
});
