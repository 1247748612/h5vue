import axios from 'axios'
// import store from '@/store'
import router from '@/router'
import { Toast } from 'vant'
import { removeToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // if (store.getters.token) {
    //   config.headers['X-Token'] = getToken()
    // }
    return config
  },
  error => {
    // do something with request error
    console.log(error, 'err') // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    console.log(response, router, '看看拦截器')
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 503) {
        // to re-login
        // console.log(res.code, '我查看一下')
        // Dialog.confirm({
        //   title: '登录失效',
        //   message: '你是否需要重新登录',
        //   confirmButtonText: '重新登录',
        //   cancelButtonText: '取消'
        // }).then(() => {
        //   store.dispatch('user/resetToken').then(() => {
        //     location.reload()
        //   })
        // }).catch(() => {
        //   // on cancel
        // })
        removeToken()
        console.log(router)
        if (router.currentRoute.name !== 'ContactCustomerService' && router.currentRoute.name !== 'HelperLogin') {
          Toast.fail({
            message: response.data.msg,
            duration: 1.5 * 1000
          })
          setTimeout(() => {
            router.push('/HelperLogin')
          }, 1500)
        }
        if (router.currentRoute.name === 'HelperLogin') {
          Toast.fail({
            message: response.data.msg,
            duration: 1.5 * 1000
          })
        }
        // 用户不输出越权操作 503
        return Promise.reject(res)
      } else if (res.code === 500) {
        return Promise.reject(res)
      }
    } else {
      console.log('拦截器正常', res)
      return res
    }
  },
  error => {
    console.log('报错了为什么' + error) // for debug
    Toast.fail({
      message: error.message,
      duration: 1.5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
