import colors from 'vuetify/es5/util/colors'

export default {
  server: {
    port: 8000, // default: 3000
    host: '0.0.0.0', // default: localhost
  },
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📖</text></svg>' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: 'red', continuous: true },
  /*
  ** Global CSS
  */
  css: [
    '@/styles/main.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: "@/plugins/filters.js" }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/proxy',
    '@nuxtjs/device',
    '@nuxtjs/toast',
    'nuxt-svg-loader',
    'vue-scrollto/nuxt',
  ],
  toast: {
    position: 'top-left',
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    // proxy: true
    retry: true
  },
  proxy: {
    '/api': {
      target: 'https://archive.org',
      pathRewrite: {
        '^/api': '/'
      }
    },
    '/librivox': {
      target: 'https://librivox.org/api/feed',
      pathRewrite: {
        '^/librivox': '/'
      }
    }
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    treeShake: true,
    defaultAssets: false,
    icons: {
      iconfont: 'md',
    },
    customVariables: ['~/styles/variables.scss'],
    theme: {
      options: {
        customProperties: true,
      },
      themes: {
        light: {
          primary: '#2A3663',
          secondary: colors.grey.darken1,
        }
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  },
  router: {
    middleware: 'pages'
  },
}
