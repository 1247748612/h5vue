import Vue from 'vue'
import Vuex from 'vuex'
// import createLoadingPlugin from 'utils/vuex-loading'
import getters from './getters'

Vue.use(Vuex)

const files = require.context('./modules', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

console.log(Vuex)
export default new Vuex.Store({
  getters: getters,
  modules
})
