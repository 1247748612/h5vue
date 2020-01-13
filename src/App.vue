<template>
  <div id="app">
    <transition :name="transitionName">
      <!-- <vue-page-stack> -->
        <!-- <keep-alive v-if="$route.meta.keepAlive"> -->
          <router-view :key="$route.fullPath" class="router"></router-view>
        <!-- </keep-alive> -->
      <!-- </vue-page-stack> -->
    </transition>
  </div>
</template>
<script>
// import defaultSetting from './settings'
import { mapGetters, mapActions } from 'vuex'
import { getToken as customerServiceToken } from '@/utils/auth'
import { getToken as userToken } from '@/utils/UserAuth'

export default {
  name: 'app',
  computed: {
    ...mapGetters(['isConnected', 'isReconnected', 'sessionId'])
  },
  data: function () {
    return {
      socketTimer: null,
      transitionName: 'forward'
    }
  },
  watch: {
    $route (to, from) {
      if (to.params['stack-key-dir'] === 'forward') {
        this.transitionName = 'forward'
      } else {
        this.transitionName = 'back'
      }
    },
    'isConnected' (newVal, oldVal) {
      if (newVal === false && this.socketTimer) {
        console.log('停止心跳')
        clearInterval(this.socketTimer)
        this.socketTimer = null
      } else if (newVal) {
        const token1 = customerServiceToken()
        const token2 = userToken()
        this.socketTimer = setInterval(() => {
          if (!this.sessionId) {
            console.log('开始重连')
            this.reconnectSocket(token1 || token2)
            // clearInterval(this.socketTimer)
            return
          }
          if (token1) {
            console.log('客服心跳', token1)
          } else if (token2) {
            console.log('用户心跳', token2)
          }
          this.sendMessage({
            sessionId: token1 || token2
          })
          this.setSessionIdNull()
        }, 1000 * 30) // 10s
      }
      console.log(this.$socket, 'app.vue')
    }
  },
  methods: {
    ...mapActions(['sendMessage', 'reconnectSocket', 'setSessionIdNull'])
  },
  mounted () {
  }
}
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  position: relative;
}

.router {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  // background-color: #fff;
}
</style>
