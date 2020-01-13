<!-- 组件说明 -->
<template>
  <div class="emoji-panel">
    <div class="emoji-box" @click="getEmoji">
      <span class="emoji" :data-code="emoji" v-for="(emoji, index) in getEmojiList" :key="index">
        {{emoji}}
      </span>
    </div>
  </div>
</template>

<script>
// import x from ''
export default {
  components: {

  },
  data () {
    return {

    }
  },
  computed: {
    getEmojiList () {
      const emojiList = []
      let start = 128513
      const end = 128591
      while (start <= end) {
        emojiList.push(String.fromCodePoint(start))
        start += 1
      }
      return emojiList
    }
  },
  methods: {
    getEmoji (e) {
      if (e.target.dataset.code) {
        this.$emit('get-emoji', e.target.dataset.code)
        console.log('得到了什么', e.target.dataset.code)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
  .emoji-panel {
    height: 130px;
    box-sizing: border-box;
    padding: 10px 0;
    overflow-y: auto;
    background-color: #fff;
    .emoji-box {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-auto-rows: 35px;
      justify-items: center;
      align-items: center;
      .emoji {
        width: 1.5em;
        height: 1.5em;
        line-height: 1.5em;
        text-align: center;
        font-size: 22px;
        &:active {
          background-color: #ecedf1;
        }
      }
    }
  }
//@import url()
</style>
