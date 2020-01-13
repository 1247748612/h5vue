// import { MyWebsocket } from '@/utils/websocket'
import { helperAllUser } from 'api/ClientUser'
import { getToken } from '@/utils/auth'
import { Notify } from 'vant'

import Vue from 'vue'
import {
  SOCKET_ONOPEN,
  SOCKET_ONCLOSE,
  SOCKET_ONERROR,
  SOCKET_ONMESSAGE,
  SOCKET_RECONNECT,
  SOCKET_RECONNECT_ERROR
} from '../mutation-types'

export default {
  state: {
    contactList: [],
    socket: {
      isConnected: false,
      newMessage: '',
      onlineMessage: '',
      offlineMessage: '',
      reconnectError: false,
      isReconnected: false,
      reconnectTimer: null,
      sessionId: 'sessionId默认值'
    }
  },
  getters: {
    getContactList: (state) => {
      return state.contactList
    },
    isConnected: (state) => state.socket.isConnected,
    isReconnected: (state) => state.socket.isReconnected,
    newMessage: (state) => state.socket.newMessage,
    sessionId: (state) => state.socket.sessionId,
    onlineMessage: (state) => state.socket.onlineMessage,
    offlineMessage: (state) => state.socket.offlineMessage
  },
  mutations: {
    ADD_CONTACT (state, contact) {
      state.contactList = contact
    },
    PUSH_CONTACT (state, contact) {
      state.contactList.push(contact)
    },
    ONLINE_MESSAGE (state, message) {

    },
    OFFLINE_MESSAGE (state, message) {

    },
    [SOCKET_ONOPEN] (state, event) {
      console.log('onOpen', event)
      Vue.prototype.$socket = event.currentTarget
    },
    [SOCKET_ONCLOSE] (state, event) {
      console.error(state, event, '关闭socket')
      // state.socket.isConnected = false
    },
    [SOCKET_ONERROR] (state, event) {
      console.error(state, event, 1)
    },
    // default handler called for all methods
    [SOCKET_ONMESSAGE] (state, message) {
      const token = getToken()
      console.log(message, state.socket.isConnected, token, 'newMessage')

      // console.log(Vue)
      // 重连
      if (message.sessionId) {
        state.socket.sessionId = message.sessionId
      }
      if (message.code === 200) {
        console.log(message.msg)
        state.socket.isConnected = true
      }
      if (state.socket.isConnected && message.code === 2) {
        // console.log(message.data, 'onMessage')
        if (message.data.pushId) {
          Vue.prototype.$socket.sendObj({ pushId: message.data.pushId })
        }
        for (let index in state.contactList) {
          console.log(state.contactList[index], message.data)
          if (state.contactList[index].id === message.data.userId) {
            console.log('找到了，新的数据')
            if (token !== message.data.sessionId) {
              state.contactList[index].lastMessageReadStatus = 2
            }
            state.contactList[index].lastChatHistory = message.data
            if (!state.contactList[index].lastChatHistory) {
              console.log('更新')
              state.contactList = [...state.contactList]
            }
            break
          }
        }
        console.log(state)
        // let ls = state.contactList
        state.contactList.sort((a, b) => {
          if (!a.lastChatHistory || !b.lastChatHistory) {
            if (a.lastChatHistory) {
              return b.createdDate - a.lastChatHistory.createdDate
            } else if (b.lastChatHistory) {
              return b.lastChatHistory.createdDate - a.createdDate
            }
            return b.createdDate - a.createdDate
          }
          return b.lastChatHistory.createdDate - a.lastChatHistory.createdDate
        })
        state.socket.newMessage = message.data
      } else if (state.socket.isConnected && message.code === 0) {
        if (token) {
          Notify({ type: 'primary', message: `${message.data.name}已连接` })
          let flag = false
          state.contactList.forEach((item) => {
            console.log(item, message.data)
            if (item.id === message.data.id) {
              item.status = 0
              flag = true
            }
          })
          console.log(flag, '插入人员')
          if (!flag) {
            state.contactList.unshift(message.data)
            state.contactList = [...state.contactList]
            console.log(state.contactList)
          }
        }
        // Toast.success(message.data.name + '已连接')
        state.socket.onlineMessage = message.data
      } else if (state.socket.isConnected && message.code === 1) {
        if (token) {
          if (message.data.helperId) {
            Notify({ type: 'danger', message: `${message.data.name}已离线` })
          }
          for (let index in state.contactList) {
            console.log(state.contactList[index], message.data)
            if (state.contactList[index].id === message.data.id) {
              state.contactList.splice(index, 1)
              state.contactList = [...state.contactList]
              break
            }
          }
        }
        state.socket.offlineMessage = message.data
        // Toast.fail(message.data.name + '已离线')
      }
    },
    // mutations for reconnect methods
    [SOCKET_RECONNECT] (state, count) {
      console.info(state, count)
    },
    [SOCKET_RECONNECT_ERROR] (state) {
      state.socket.reconnectError = true
    },
    START_SOCKET_RECONNECT (state, sessionId) {
      // const timer = setInterval(() => {
      // }, 5 * 1000)
      location.reload()
      // state.socket.reconnectTimer = timer
    },
    SET_SESSION_ID_NULL (state) {
      state.socket.sessionId = null
    }
  },
  actions: {
    sendMessage ({ commit }, message) {
      try {
        Vue.prototype.$socket.sendObj(message)
      } catch (e) {
        commit(SOCKET_ONERROR)
        console.log(e, '')
      }
    },
    closeSocket (store) {
      console.log(Vue.prototype.$socket.onclose(), 'closeSocket')
    },
    reconnectSocket ({ commit }, sessionId) {
      console.log(Object.keys(Vue.prototype.$socket), '重连时的socket')
      commit('START_SOCKET_RECONNECT', sessionId)
    },
    getHelperAllUser ({ commit }, helperId) {
      return new Promise((resolve, reject) => {
        helperAllUser(helperId).then((res) => {
          const filterData = res.data.filter((item) => {
            return item.status === 0
          })
          filterData.sort((a, b) => {
            if (!a.lastChatHistory || !b.lastChatHistory) {
              if (a.lastChatHistory) {
                return b.createdDate - a.lastChatHistory.createdDate
              } else if (b.lastChatHistory) {
                return b.lastChatHistory.createdDate - a.createdDate
              }
              return b.createdDate - a.createdDate
            }
            return b.lastChatHistory.createdDate - a.lastChatHistory.createdDate
          })
          console.log(res, '该客服所有联系人列表')
          commit('ADD_CONTACT', filterData)
          resolve(res.data)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    setSessionIdNull ({ commit }) {
      commit('SET_SESSION_ID_NULL')
    }
  }
}
