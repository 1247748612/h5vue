import { currentHelper, customerServicesLogin, helperLogout } from 'api/system'
import { removeToken, setToken } from '@/utils/auth'
import { MyWebsocket } from '@/utils/websocket'
import { resetRouter } from '@/router'
import { Toast } from 'vant'

export default {
  namespaced: true,
  state: {
    helperInfo: null
  },
  mutations: {
    'SET_HELPER_INFO' (state, info) {
      state.helperInfo = info
    },
    'LOGOUT' (state) {
      state.helperInfo = null
      removeToken()
      resetRouter()
    }
  },
  actions: {
    getInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        currentHelper().then(response => {
          const { data } = response
          if (!data) {
            // eslint-disable-next-line
            reject('Verification failed, please Login again.')
          }
          commit('SET_HELPER_INFO', data)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    login ({ commit }, data) {
      return new Promise((resolve, reject) => {
        customerServicesLogin(data).then((res) => {
          console.log('登录成功')
          if (res.helper) {
            setToken(res.helper.sessionId)
            MyWebsocket(res.helper.sessionId)
            commit('SET_HELPER_INFO', res.helper)
          }
          Toast({
            message: res.msg,
            position: 'middle',
            duration: 1500
          })
          resolve(res.data)
        }).catch((err) => {
          if (err.msg) {
            Toast.fail(err.msg || err.message)
          }
          reject(err)
          console.log(err, 'err')
        })
      })
    },
    logout ({ commit }, data) {
      return new Promise((resolve, reject) => {
        helperLogout().then((res) => {
          Toast.success(res.msg)
          commit('LOGOUT')
          resolve(res)
        }).catch((err) => {
          Toast.fail(err.msg || err.message)
          reject(err)
        })
      })
    }
  }
}
