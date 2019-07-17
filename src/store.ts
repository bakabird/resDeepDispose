import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    SearchKey: '',
  },
  mutations: {
    updateSearchKey(state, newSearchKey) {
      state.SearchKey = newSearchKey
    }
  },
  actions: {

  }
})
