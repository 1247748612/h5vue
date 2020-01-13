<!-- 组件说明 -->
<template>
  <div class="send-box" @click.stop>
    <div class="input-wrap">
      <div class="emoji-box" :class="showEmojiPanel ? 'emoji-box-active' : ''">
        <svg-icon @click.stop="changeStatus" icon-class="emoji" class-name="emoji"/>
      </div>
      <div class="send-content">
        <div contenteditable="true" class="content" type="text"
          ref="contenteditable"
          @focus="showEmojiPanel = false;$emit('focus')"
          @click="$emit('click')"
          @blur="$emit('blur', $event)"
          @keydown="$emit('keydown', $event)"
          @keyup="$emit('keyup', $event)"
          @input="domInput"
        >
        </div>
      </div>
      <div class="send-button">
        <button @click.stop="sendMessage" class="send" :class="messageContent !== '' ? 'send-active' : ''">发送</button>
      </div>
    </div>
    <div class="emoji-wrap" :class="showEmojiPanel ? 'show-emoji' : ''">
      <emoji-panel @get-emoji="insertEmoji"></emoji-panel>
    </div>
  </div>
</template>

<script>
import EmojiPanel from '@/components/EmojiPanel'
export default {
  inject: ['addChatHistorys'],
  components: {
    EmojiPanel
  },
  data () {
    return {
      messageContent: '',
      showEmojiPanel: false
    }
  },
  computed: {

  },
  watch: {
    showEmojiPanel () {
      this.$emit('emoji-focus')
    }
  },
  created () {
    document.addEventListener('click', this.listenerCloseEmoji)
  },
  methods: {
    // 监听其他点击关闭表情弹窗
    listenerCloseEmoji () {
      this.showEmojiPanel = false
    },
    // 发送消息按钮点击
    sendMessage () {
      if (this.messageContent === '') {
        return null
      }
      this.addChatHistorys(encodeURIComponent(this.messageContent))
      console.log('message', this.messageContent)
      this.$refs.contenteditable.innerHTML = ''
      this.messageContent = ''
      this.showEmojiPanel = false
    },
    // 改变emoji弹窗状态
    changeStatus (status) {
      console.log(this.showEmojiPanel, 'wwww', status)
      this.showEmojiPanel = !this.showEmojiPanel
    },
    // input变动
    domInput (e) {
      // this.$emit('input', this.$el.innerHTML)
      this.messageContent = e.target.innerHTML
      console.log(this.messageContent)
      // console.log(e, 'domInput')
    },
    // 插入emoji
    insertEmoji (e) {
      const span = document.createElement('span')
      span.innerHTML = e
      console.log(this.$refs.contenteditable)
      this.$refs.contenteditable.appendChild(
        span
      )
      this.$refs.contenteditable.scrollTop = this.$refs.contenteditable.scrollHeight
      this.messageContent = this.$refs.contenteditable.innerHTML
      console.log(e)
    }
  },
  beforeDestroy () {
    document.removeEventListener('click', this.listenerCloseEmoji)
    console.log('end')
  }
}
</script>

<style lang='scss' scoped>
  * {
    box-sizing: border-box;
  }
  .send-box {
    min-height: 50px;
    height: auto;
    .input-wrap {
      display: flex;
      padding: 0 15px;
      justify-content: center;
      width: 100%;
      height: auto;
      min-height: 50px;
      .send-content {
        margin: 5px 0;
        display: flex;
        align-items: center;
        width: 100%;
        background: #fff;
        min-height: 40px;
        max-height: 120px;
        width: 100%;
        border-radius: 10px;
        overflow: hidden;
        .content {
          width: 100%;
          font-size: 15px;
          // min-height: 20px;
          height: auto;
          max-height: 120px;
          overflow-y: auto;
          outline: none;
          padding: 8px 12px;
          // box-sizing: content-box;
        }
        margin-right: 5px;
      }
      .send-button {
        margin-top: 5px;
        .send {
          display: inline-block;
          background-color: #e2e4e7;
          color: #666;
          border: none;
          white-space: nowrap;
          height: 35px;
          padding: 0 15px;
          border-radius: 5px;
          font-size: 16px;
          transition: all .3s ease-in-out;
        }
      }
    }
  }

  .send-active {
    background-color: #409eff !important;
    color: #fff !important;
  }
  .emoji-box {
    height: 40px;
    line-height: 40px;
    margin-top: 10px;
    margin-right: 10px;
    .emoji {
      font-size: 30px;
    }
    transition: all .3s linear
  }
  .emoji-box-active {
    transform: rotateY(180deg)
  }
  .emoji-wrap {
    box-sizing: border-box;
    height: 0;
    transition: height .2s ease;
    background: #fff;
  }
  .show-emoji {
    padding: 0;
    height: 130px;;
  }
</style>
