import { currentUser, userLogin } from 'api/system'
import { removeToken, setToken, getToken } from '@/utils/UserAuth'
import { MyWebsocket } from '@/utils/websocket'
import { Toast } from 'vant'

export default {
  namespaced: true,
  state: {
    userInfo: null,
    toast: null
  },
  getters: {
    toast: (state) => state.toast
  },
  mutations: {
    'SET_USER_INFO' (state, info) {
      state.userInfo = info
    },
    'LOGOUT' (state, info) {
      state.userInfo = null
    },
    'SET_TOAST_STATE' (state, toast) {
      state.toast = toast
    }
  },
  actions: {
    getInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        // 有token时获取个人信息
        currentUser().then((res) => {
          const { data } = res
          if (!data) {
            // eslint-disable-next-line
            reject('Verification failed, please Login again.')
          }
          MyWebsocket(getToken())
          commit('SET_USER_INFO', data)
          resolve(data)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    logout ({ commit }) {
      commit('LOGOUT')
      removeToken()
      setTimeout(() => {
        location.reload()
      }, 1500)
    },
    login ({ commit, getters }) {
      return new Promise((resolve, reject) => {
        userLogin().then((res) => {
          console.log('登录成功')
          console.log(res)
          if (res.data) {
            setToken(res.data.sessionId)
            MyWebsocket(res.data.sessionId)
            commit('SET_USER_INFO', res.data)
          }
          Toast({
            message: res.msg,
            position: 'middle',
            duration: 1500
          })
          if (getters.toast) {
            commit('SET_TOAST_STATE', false)
          }
          resolve(res.data)
        }).catch((err) => {
          if (!getters.toast && err.msg) {
            const toast = Toast.loading({
              duration: 0, // 持续展示 toast
              forbidClick: true,
              message: err.msg,
              overlay: true
            })
            commit('SET_TOAST_STATE', toast)
          }
          reject(err)
          console.log(err, 'err')
        })
      })
    }
  }
}
