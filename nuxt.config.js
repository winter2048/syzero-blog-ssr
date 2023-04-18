
import env from './env'

export default {
  mode: 'universal',
  srcDir: 'src/',
  dir: {
    static: '../static'
  },
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'stylesheet', href: 'http://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.css' },
      {rel:'stylesheet',href:'https://cdn.bootcdn.net/ajax/libs/highlight.js/9.12.0/styles/agate.min.css'}
    ]
  },
  env: env[process.env.UI_ENVIRONMENT],
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    'assets/css/shCoreDefault.css',
    'assets/css/sigmar.css',
    'assets/css/main.css',
    'element-ui/lib/theme-default/index.css',
    'mavon-editor/dist/css/index.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '@/plugins/typeit', ssr: false },
    { src: '@/plugins/mavon-editor', ssr: false },
    { src: '@/plugins/js-cookie', ssr: true },
    { src: '@/plugins/element-ui', ssr: true }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [

  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Simple usage
    'cookie-universal-nuxt',
    // With options
    ['cookie-universal-nuxt', { alias: 'cookiz' }],
  ],
  /*
  ** Build configuration
  */
  build: {
    vendor: ['axios'],
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
