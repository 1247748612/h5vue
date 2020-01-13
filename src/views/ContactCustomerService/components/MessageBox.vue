<!-- 组件说明 -->
<template>
  <div class="message-box" :class="type === 'me' ? 'me' : ''">
    <div class="avatar">
      <img :src="messageItem.iconUrl || '../../../assets/avatar.jpg'" alt="">
    </div>
    <div class="message-wrap" :class="type === 'me' ? 'me-triangle' : 'other-triangle'" ref="messageWrap">
      <div class="content" v-html="decodeBeforeMessage">
      </div>
    </div>
  </div>
</template>

<script>
// import x from ''
export default {
  components: {

  },
  filters: {
    decodeMessage: function (value) {
      if (!value) return ''
      return decodeURIComponent(value)
    }
  },
  props: {
    type: {
      type: String,
      required: true
    },
    messageItem: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      message: (+new Date())
    }
  },
  computed: {
    decodeBeforeMessage () {
      return decodeURIComponent(this.messageItem.content)
    }
  },
  methods: {

  },
  mounted () {
  }
}
</script>

<style lang='scss' scoped>
//@import url()
  * {
    box-sizing: border-box;
  }
  .me {
    flex-direction: row-reverse;
    text-align: right;
    .message-wrap{
      margin-left: 0 !important;
      margin-right: 10px;
      background-color: #bbdefb !important;
    }
  }
  .message-box {
    display: flex;
    padding: 10px;
    .avatar {
      display: inline-block;
      width: 40px;
      height: 40px;
      img {
        display: inline-block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .message-wrap {
      font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
      position: relative;
      display: inline-block;
      margin-left: 10px;
      min-height: 30px;
      border-radius: 10px;
      padding: 10px 10px;
      font-size: 16px;
      max-width: 72%;
      width: auto;
      text-align: justify;
      background-color: #fff;
      color: #333;
    }
    .other-triangle {
      &::before {
        content: '';
        width: 0;
        height: 0;
        border: 10px solid transparent;
        border-right-color: #fff;
        position: absolute;
        left: -18px;
        top: 8px;
      }
    }
    .me-triangle {
      &::before {
        content: '';
        width: 0;
        height: 0;
        border: 10px solid transparent;
        border-left-color: #bbdefb;
        position: absolute;
        right: -18px;
        top: 8px;
      }
    }
  }
  .emoji {
    font-size: 20px;
  }
</style>
