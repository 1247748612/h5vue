import Vue from 'vue'
import store from '@/store'
import VueNativeSock from 'vue-native-websocket'

import {
  SOCKET_ONOPEN,
  SOCKET_ONCLOSE,
  SOCKET_ONERROR,
  SOCKET_ONMESSAGE,
  SOCKET_RECONNECT,
  SOCKET_RECONNECT_ERROR
} from '@/store/mutation-types'

const mutations = {
  SOCKET_ONOPEN,
  SOCKET_ONCLOSE,
  SOCKET_ONERROR,
  SOCKET_ONMESSAGE,
  SOCKET_RECONNECT,
  SOCKET_RECONNECT_ERROR
}

export const MyWebsocket = (SESSION_ID) => {
  console.log(SESSION_ID, '连接socket')
  Vue.use(VueNativeSock,
    `ws://192.168.0.224:9998/websocket/${SESSION_ID}`,
    {
      store,
      mutations,
      format: 'json',
      // reconnection: true,
      // // 尝试重连的次数
      // reconnectionAttempts: 5,
      // // 重连间隔时间
      // reconnectionDelay: 3000,
      passToStoreHandler: function (eventName, event) {
        if (!eventName.startsWith('SOCKET_')) { return }
        let method = 'commit'
        let target = eventName.toUpperCase()
        let msg = event

        // 没有传值的时候
        if (!msg) {
          this.store[method](mutations[target], msg)
          return
        }

        if (this.format === 'json' && event.data) {
          msg = JSON.parse(event.data)
          if (msg.data && !(msg.data instanceof Object)) {
            msg.data = JSON.parse(msg.data)
          }
          if (msg.mutation) {
            target = [msg.namespace || '', msg.mutation].filter((e) => !!e).join('/')
          } else if (msg.action) {
            method = 'dispatch'
            target = [msg.namespace || '', msg.action].filter((e) => !!e).join('/')
          }
        }
        // console.log(this.store, method, target, msg)
        this.store[method](mutations[target], msg)
      }
    })
}
