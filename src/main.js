import Vue from 'vue'
import 'lib-flexible'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import FastClick from 'fastclick'
import SvgIcon from 'components/SvgIcon'
import defaultSettings from '@/settings'
import VuePageStack from 'vue-page-stack'
import 'utils/permission'
import '@/icons' // icon
import '@/style/common.scss'
import { Lazyload, Toast } from 'vant'

Vue.use(VuePageStack, { router })

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from '../mock'

// if (process.env.NODE_ENV === 'production') {
//   mockXHR()
// }

FastClick.attach(document.body)

// options 为可选参数，无则不传
Vue.use(Lazyload)
Vue.use(Toast)
console.log(Toast, 'toast')
Vue.component('svg-icon', SvgIcon)

if (process.env.NODE_ENV === 'development' && defaultSettings.vconsole) {
  const VConsole = require('vconsole')
  // eslint-disable-next-line
  const my_console = new VConsole()
}
// var vConsole = new VConsole(option)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
