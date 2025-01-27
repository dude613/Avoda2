import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },
  devServer: {
    port: 4000,
  },
  runtimeConfig: {
    public: {
      PROJECT_NAME: import.meta.env.PROJECT_NAME,
      SUPABASE_PROJECT_URL: import.meta.env.SUPABASE_PROJECT_URL,
      SUPABASE_ANON_KEY: import.meta.env.SUPABASE_PROJECT_KEY,
      SUPABASE_SERVICE_ROLE_KEY: import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
    },
  },
});
