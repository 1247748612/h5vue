<!-- 组件说明 -->
<template>
  <div class="contact-message" @click="toContact">
    <div class="wrap">
      <div class="avatar">
        <img :src="messageItem.iconUrl || '../../../assets/avatar.jpg'" alt="">
      </div>
      <div class="content">
        <span class="name">{{messageItem.name}}</span>
        <span class="last-message" v-html="decodeBeforeMessage">
        </span>
      </div>
      <div class="right">
        <div class="last-time">{{moment(messageItem)}}</div>
        <div class="nothing-read" v-if="messageItem.lastMessageReadStatus === 2"></div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  components: {

  },
  props: {
    messageItem: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {

    }
  },
  computed: {
    decodeBeforeMessage () {
      if (this.messageItem.lastChatHistory) {
        return this.messageItem.lastChatHistory.content === '' ? '' : decodeURIComponent(this.messageItem.lastChatHistory.content)
      }
      return ''
    }
  },
  methods: {
    toContact () {
      this.messageItem.lastMessageReadStatus = 1
      this.$emit('update:message-item', this.messageItem)
      this.$router.push({ path: '/ContactUser', query: { userId: this.messageItem.id, userName: this.messageItem.name } })
    },
    moment (item) {
      moment.locale('zh-cn')
      console.log(moment.locale())
      let time = null
      if (item.lastChatHistory) {
        time = item.lastChatHistory.createdDate
      } else {
        time = item.createdDate
      }
      return moment(time).calendar()
    }
  }
}
</script>

<style lang='scss' scoped>
//@import url()
  .contact-message {
    border-bottom: 1px solid #e2e2e2;
    .wrap {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 80px;
      padding: 15px;
      .avatar {
        display: inline-block;
        width: 60px;
        height: 60px;
        padding-right: 15px;
        img {
          display: inline-block;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;
        flex: 1;
        height: 50px;
        .name {
          display: inline;
          font-weight: bold;
          font-size: 18px;
        }
        .last-message {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 14px;
          color: #666;
        }
      }
      .right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 50px;
        flex-direction: column;
        align-items: flex-end;
        width: 100px;
        .time {
          // white-space: nowrap;
          font-size: 13px;
          color: #666;
        }
        .nothing-read {
          display: inline-block;
          text-align: center;
          width: 10px;
          height: 10px;
          // line-height: 20px;
          border-radius: 50%;
          background-color: red;
          color: #fff;
        }
      }
    }
  }
</style>
