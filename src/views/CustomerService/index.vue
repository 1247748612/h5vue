<!-- 组件说明 -->
<template>
  <div class="customer-service">
    <header class="header">
      <span class="title">
        所有联系人
      </span>
    <div class="right-btn">
      <svg-icon @click="logout" icon-class="off" class-name="off-class"/>
    </div>
    </header>
    <div class="content" v-if="$store.state.websocket.contactList">
      <div v-for="(item, index) in getContactList" :key="index">
        <!-- {{item.lastChatHistory}} -->
        <contact-message :message-item.sync="item" v-if="item.status === 0"></contact-message>
      </div>
    </div>
    <footer class="footer">
      <span class="tip">
        ~已经到底了~
      </span>
    </footer>
  </div>
</template>

<script>
import ContactMessage from './components/ContactMessage'
import { mapGetters, mapActions } from 'vuex'
import { Dialog, Toast } from 'vant'

export default {
  components: {
    ContactMessage
  },
  data () {
    return {
      contactList: null
    }
  },
  watch: {
    'onlineMessage' (newVal, oldVal) {
      this.helperAllUser()
    }
  },
  computed: {
    ...mapGetters([
      'getCustomerServiceInfo',
      'newMessage',
      'onlineMessage', // 上限
      'offlineMessage',
      'getContactList' // 所有数据
    ])
  },
  created () {
    console.log(this.getContactList, '输入 getContactList', this.$store)
    this.helperAllUser()
  },
  methods: {
    ...mapActions({
      customerServiceLogout: 'CustomerService/logout',
      closeSocket: 'closeSocket',
      getHelperAllUser: 'getHelperAllUser'
    }),
    helperAllUser () {
      Toast.loading({
        message: '正在加载······',
        duration: 0, // 持续展示 toast
        forbidClick: true
      })
      const id = this.getCustomerServiceInfo.id
      this.getHelperAllUser(id).then((res) => {
        this.$nextTick(() => {
          Toast.clear()
        })
      }).catch((err) => {
        console.log(err)
        Toast.clear()
      })
    },
    logout () {
      Dialog.confirm({
        title: '退出登录',
        message: '你是否要退出登录'
      }).then(() => {
        this.customerServiceLogout().then((res) => {
          this.closeSocket()
        })
      })
    }
  },
  beforeDestroy () {
    // delete this.$options.sockets.onmessage
  }
}
</script>
<style lang='scss' scoped>
//@import url()
.customer-service {
  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      display: inline-block;
      font-size: 16px;
      // line-height: 40px;
      font-weight: bold;
      color: #fff;
      padding: 0 10px;
    }
    .right-btn {
      padding: 0 10px;
    }
    // padding-left: 10px;
    background: #409eff;
    box-shadow: 5px 0 25px 10px #999
  }
  .content {
    margin-top: 40px;
  }
  .footer {
    text-align: center;
    padding: 10px 0;
    .tip {
      font-size: 14px;
    }
  }
  .off-class {
    font-size: 25px;
  }
}
</style>
