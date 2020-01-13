import router from '@/router'
import store from '@/store'
import { Notify } from 'vant'
import { getToken } from '@/utils/auth' // get token from cookie
import { MyWebsocket } from '@/utils/websocket' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
const whiteList = ['/HelperLogin', '/ContactCustomerService', '/404'] // 白名单列表
const userWhiteList = ['/ContactCustomerService'] // 白名单列表

router.beforeEach(async (to, from, next) => {
  if (userWhiteList.includes(to.path)) {
    next()
    return
  }
  // 设置页面标题
  document.title = getPageTitle(to.meta.title)
  // determine whether the user has logged in
  const hasToken = getToken()
  console.log(hasToken, 'hasToken')
  if (hasToken) {
    const socketIsConnected = store.getters.isConnected
    if (!socketIsConnected) {
      MyWebsocket(hasToken)
    }

    if (to.path === '/HelperLogin') {
      // 已经登录，跳转到首页
      next({ path: '/AllContact' })
    } else {
      // 获取用户信息
      console.log(store, '获取用户信息并检查')
      const hasGetUserInfo = store.getters.getCustomerServiceInfo && store.getters.getCustomerServiceInfo.id
      console.log(2, hasGetUserInfo)
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('CustomerService/getInfo')
          next()
        } catch (error) {
          console.log(error)
          // 清除用户信息，退出登录，跳转登录页
          store.commit('CustomerService/LOGOUT')
          Notify({ type: 'danger', message: error.msg || error.message })
          next(`/HelperLogin?redirect=${to.path}`)
        }
      }
    }
  } else {
    console.log('wwwwwww', to, from)
    /* has no token */
    if (whiteList.indexOf(to.path) !== -1) {
      // 白名单中，无需验证
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/HelperLogin?redirect=${to.path}`)
    }
  }
})
