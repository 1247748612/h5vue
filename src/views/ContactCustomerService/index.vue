<!-- 组件说明 -->
<template>
  <div class="container">
    <div class="header">
      <svg-icon v-if="!type" @click="toBack" icon-class="down-arrow" class-name="arrow-left"/>
      <span v-if="type" class="title">正在与{{ getUserInfo.helperName || '客服'}}沟通</span>
      <span v-else class="title">正在与{{userName || '用户'}}沟通</span>
    </div>
    <div class="footer">
      <send-box ref="emoji" @emoji-focus="emojiFocus"></send-box>
    </div>
    <div class="main" :style="{height: height}">
      <div v-if="messageList.length">
        <div v-for="(item, key) in messageList" :key="key">
          <div class="message-time" v-if="item.showTime">
            <span class="time">{{item.createdDate | formatTime}}</span>
          </div>
          <message-box :message-item="item" :type="messagePosition(item) ? 'me' : 'other'" v-if="key === messageList.length - 1" ref="messageWrap"></message-box>
          <message-box :message-item="item" :type="messagePosition(item) ? 'me' : 'other'" v-else></message-box>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MessageBox from './components/MessageBox'
import moment from 'moment'
import SendBox from './components/SendBox'
import { addChatHistorys, getUserChatHisotys, chatHistorysUser } from 'api/ChatHistorys'
import { getToken as userToken } from '@/utils/UserAuth'
import { getToken as customerServiceToken } from '@/utils/auth'
import { mapGetters, mapActions } from 'vuex'
import { Notify, Toast } from 'vant'
moment.locale('zh-cn')

export default {
  provide () {
    return {
      addChatHistorys: this.addChatHistorys
    }
  },
  components: {
    MessageBox,
    SendBox
  },
  filters: {
    formatTime: function (time) {
      // console.log(moment(time).calendar())
      return moment(time).calendar()
    }
  },
  data () {
    return {
      // true 为用户进入页面
      // false 为客服进入页面
      // 类型
      type: this.$route.name === 'ContactCustomerService',
      // 用户id
      userId: this.$route.query.userId,
      // 用户名
      userName: this.$route.query.userName,
      // 客服id
      helperId: '',
      // 消息列表
      messageList: [],
      // 展示时间对象 index索引，取时间
      messageTime: [],
      height: 'calc(100% - 40px - 50px)' // 聊天窗
    }
  },
  computed: {
    ...mapGetters([
      'isConnected',
      'getCustomerServiceInfo',
      'getUserInfo',
      'newMessage',
      'onlineMessage',
      'offlineMessage'
    ])
  },
  watch: {
    '$route' (newVal, oldVal) {
      if (this.type) {
        return
      }
      console.log('路由更新了')
      // 路由更新后先清空列表数据
      this.messageList = []
      // userId还是一样的话则不重新请求
      if (this.userId === newVal.query.userId) {
        return
      }
      // 然后重新获取userId
      this.userId = newVal.query.userId
      if (this.userId) {
        // 有userId获取新的数据
        this.customerServiceInit()
      } else if (newVal.name === 'ContactUser') {
        // 没有userId 跳到所有联系人页面
        this.$router.replace('/AllContact')
      }
    },
    'newMessage' (newVal, oldVal) {
      console.log(this.contactList, newVal)
      if (this.userId === newVal.userId) {
        this.messageList.push(newVal)
        this.setShowMessageTime(this.messageList)
      }
    },
    'onlineMessage' (newVal, oldVal) {
    },
    'offlineMessage' (newVal, oldVal) {
      // 用户
      if (newVal.helperId) {
        if (this.userId === newVal.id) {
          Toast.fail('当前用户已断开连接')
          setTimeout(() => {
            this.$router.replace('/AllContact')
          }, 1500)
        }
      } else {
        if (newVal.nickname) {
          Notify({ type: 'danger', message: `${newVal.nickname}已离线` })
        }
        this.userLogout()
      }
    }
  },
  created () {
    console.log(this.type, '类型')
    if (this.type) {
      this.userInit()
    } else {
      this.customerServiceInit()
    }
  },
  mounted () {
    console.log(this, 'pagepage')
    this.height = `calc(100% - 40px - ${this.$refs.emoji.$el.offsetHeight}px)`
  },
  updated () {
    console.log(this.$refs.messageWrap)
    if (this.$refs.messageWrap && this.$refs.messageWrap.length) {
      this.$refs.messageWrap[0].$el.scrollIntoView({ behavior: 'smooth' })
    }
  },
  methods: {
    ...mapActions({
      userGetInfo: 'user/getInfo',
      userLogin: 'user/login',
      userLogout: 'user/logout'
    }),
    messagePosition (item) {
      console.log(userToken(), customerServiceToken(), item.sessionId)
      if (this.type) {
        return userToken() === item.sessionId
      } else {
        console.log(this.customerServiceToken, item)
        return customerServiceToken() === item.sessionId
      }
    },
    toBack () {
      this.$router.go(-1)
    },
    // 表情键盘弹起
    emojiFocus () {
      setTimeout(() => {
        this.height = `calc(100% - 40px - ${this.$refs.emoji.$el.offsetHeight}px)`
        console.log(this.height)
      }, 200)
    },
    getUserChatHisotys () {
      console.log('getUserChatHisotys')
      getUserChatHisotys().then((res) => {
        console.log('获取成功', res)
        if (!res.data || !res.data.length) {
          Toast.clear()
          return
        }
        res.data.sort((a, b) => {
          return a.createdDate - b.createdDate
        })
        this.setShowMessageTime(res.data)
        Toast.clear()
        console.log(res, '获取历史消息')
      }).catch((err) => {
        Toast.clear()
        // this.userLogout()
        console.log(err, '获取历史消息 失败')
      })
    },
    userInit () {
      // 无token时代表未登录
      if (!userToken()) {
        this.userLogin().then((data) => {
          this.userId = data.id
          this.helperId = data.helperId
          setTimeout(() => {
            Toast.loading({
              duration: 0,
              message: '正在获取'
            })
            this.getUserChatHisotys()
          }, 1500)
        }).catch((err) => {
          console.log(err, '用户登录失败')
          setTimeout(() => {
            this.userInit()
          }, 1000 * 10)
        })
      } else {
        this.userGetInfo().then((data) => {
          this.userId = data.id
          this.helperId = data.helperId
          Toast.loading({
            duration: 0,
            message: '正在获取'
          })
          this.getUserChatHisotys()
        }).catch((err) => {
          console.log(err, '获取不到用户')
          this.userLogout()
        })
      }
    },
    // 客服初始化需要做的事情
    customerServiceInit () {
      const toast = Toast.loading({
        duration: 0,
        message: '正在获取'
      })
      // 赋值给helperId
      this.helperId = this.getCustomerServiceInfo.id
      console.log(this.userId, this.$route, 'www')
      chatHistorysUser(this.userId).then((res) => {
        if (!res.data || !res.data.length) {
          toast.clear()
          return
        }
        res.data.sort((a, b) => {
          return a.createdDate - b.createdDate
        })
        this.setShowMessageTime(res.data)
        toast.clear()
        console.log(res, '获取历史消息')
      }).catch((err) => {
        console.log(err, '失败')
      })
    },
    setShowMessageTime (data) {
      // 默认第一个展示时间
      let flag = data[0]
      data[0].showTime = true

      data.forEach((msgItem, index) => {
        let differenceMinute = (msgItem.createdDate - flag.createdDate) / (1000 * 60)
        // console.log(differenceMinute)
        if (differenceMinute > 3) {
          // console.log(data[index + 1])
          data[index].showTime = true
        }
        flag = msgItem
      })

      this.messageList = data
    },
    // 添加消息
    addChatHistorys (content) {
      const data = {
        userId: this.userId,
        helperId: this.helperId,
        content
      }
      addChatHistorys(data).then((res) => {
        // this.customerServiceInit()
        console.log(res)
      }).catch((err) => {
        console.log(err, 'wwww')
      })
    },
    // 使用momonet
    moment () {
      return moment(...arguments)
    }
  }
}
</script>

<style lang='scss' scoped>
//@import url()
  * {
    box-sizing: border-box;
  }

  .container {
    display: inline-block;
    // height: 100vh;
    background-color: #ecedf1;
    overflow: hidden;
    .header {
      display: flex;
      align-items: center;
      height: 40px;
      padding: 0 10px;
      background-color: #409eff;
      .title {
        color: #fff;
        font-size: 14px;
      }
    }
    .main {
      // height: calc(100% - 40px - 50px);
      overflow-y: auto;
      .message-time {
        padding: 10px 0;
        text-align: center
      }
    }
    .footer {
      background-color: #ecedf1;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      min-height: 50px;
      height: auto;
      z-index: 999;
    }
  }

  .arrow-left {
    font-size: 25px;
  }
</style>
