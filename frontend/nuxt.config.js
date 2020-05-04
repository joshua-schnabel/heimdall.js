export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      {
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      }
    ]
  },
  srcDir: 'src/',
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#fff'
  },
  /*
   ** Global CSS
   */
  css: [
    '@/../node_modules/vue-material-design-icons/styles.css',
    '@/styles/default.scss'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxt/typescript-build'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    'nuxt-precompress',
    [
      'nuxt-i18n',
      {
        vueI18nLoader: true,
        lazy: true,
        langDir: 'i18n/',
        locales: [
          { code: 'en', iso: 'en-US', file: 'en.js' },
          { code: 'de', iso: 'de-DE', file: 'de.js' }
        ],
        detectBrowserLanguage: {
          useCookie: false,
          alwaysRedirect: false,
          fallbackLocale: 'en'
        },
        defaultLocale: 'en'
      }
    ]
  ],
  bootstrapVue: {
    bootstrapCSS: false, // Or `css: false`
    bootstrapVueCSS: false // Or `bvCSS: false`
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extractCSS: true,
    optimization: {
      splitChunks: {
        chunks: 'async',
        automaticNameDelimiter: '.',
        minSize: 124928,
        maxSize: 249856,
        maxInitialRequests: 5
      }
    }
    // extend(config, ctx) {}
  }
}
