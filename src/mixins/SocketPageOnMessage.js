import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      newMessage: {}
    }
  },
  computed: {
    ...mapGetters(['isConnected'])
  },
  watch: {
    'isConnected' (newVal) {
      if (newVal) {
        this.onmessage()
      }
    }
  },
  // mounted () {
  //   if (isConnected)
  // },
  methods: {
    onmessage () {
      console.log(this.$options.sockets)
      this.$options.sockets.onmessage = (res) => {
        const data = JSON.parse(res.data)
        if (data.code && data.code === 2) {
          console.log(data, 'onmessage')
          this.newMessage = data.data
        }
      }
    }
  }
}
