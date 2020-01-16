import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    SearchKey: '',
    PopClampId: -1,
    // data Object
    // data.clamp-poster-id String
    // data.Posters Poster[]
    ClampPosters: {}
  },
  mutations: {
    // SearchKey
    updateSearchKey(state, newSearchKey) {
      state.SearchKey = newSearchKey
    },
    // PopClampId
    setPopClampId(state,newPopClampId){
      state.PopClampId = newPopClampId
    },
    clearPopClampId(state){
      state.PopClampId = -1
    },
    // ClampPosters
    setClampPosters(state,newClampPosters){
      state.ClampPosters = newClampPosters
    }
  },
  actions: {

  }
})
