import Vue from 'vue'
import Router from 'vue-router'
import Home from 'views/Home.vue'

Vue.use(Router)

let routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    redirect: '/ContactCustomerService',
    meta: {
      title: '首页',
      keepAlive: true
    }
  },
  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ 'views/404.vue'),
    meta: {
      title: '404',
      keepAlive: true
    }
  }
]

const routerContext = require.context('./', true, /\.js$/)
routerContext.keys().forEach(route => {
  // 如果是根目录的 index.js 、不处理
  if (route.startsWith('./index')) {
    return
  }
  const routerModule = routerContext(route)
  /**
   * 兼容 import export 和 require module.export 两种规范
   */
  routes = routes.concat(routerModule.default || routerModule)
})

routes = routes.concat({
  path: '*',
  redirect: '/404'
})

const createRouter = () => new Router({
  // mode: 'history', // require service support
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes
})

const myRouter = createRouter()

// const myRouter = new Router({
//   mode: 'history',
//   base: process.env.BASE_URL,
//   routes
// })

export function resetRouter () {
  myRouter.replace('/HelperLogin')
}

export default myRouter
