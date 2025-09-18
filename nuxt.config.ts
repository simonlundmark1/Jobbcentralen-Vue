// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-09-17',
  
  modules: [
    '@nuxtjs/supabase',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],
  components: true,
  typescript: { strict: true },
  runtimeConfig: {
    // server-only
    openaiApiKey: process.env.OPENAI_API_KEY,
    // public (sent to client)
    public: {
      appName: 'Jobbcentralen',
    },
  },
  supabase: {

      redirect: false,
  
    // Explicitly configure Supabase with fallbacks for development
    url: process.env.NUXT_SUPABASE_URL || 'https://example.supabase.co',
    key: process.env.NUXT_SUPABASE_ANON_KEY || 'MOCKAPIKEY'
  },
  app: {
    head: {
      // Simple baseline; you'll tighten later
      meta: [{ name: 'referrer', content: 'no-referrer' }],
    }
  },
  nitro: {
    experimental: {
      wasm: true
    }
  }
})
