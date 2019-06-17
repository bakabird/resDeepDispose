<template>
  <div id="app">
    <header>
      <div class='introduction'>
        <img class="logo" width="100" src="./assets/iz-one-logo.png">
        <div class="new">刚出炉的熟肉呈浅珊瑚色</div>
        <div class="raw">较难食用的生肉呈墨绿色</div>
        <div class="clampTip">包含了其他纸条的夹子呈米黄色</div>
      </div>
      <!-- <div>比起弹幕数量更关注弹幕的友善度</div> -->
      <div>{{announcement}}</div>
      <!-- <div>个人维护，更新不及时见谅</div> -->
      <form class='filter'>
        <label class='mainItem Fresh' :class="{'itemActived': filter === 'Fresh'}" for="Fresh">
          <input id='Fresh' name='filter' v-model="filter" type='radio' value='Fresh' />最近更新</label>
        <!-- sec line -->
        <label class='item No' :class="{'itemActived': filter === 'No'}" for="No">
          <input id='No' name='filter' v-model="filter" type='radio' value='No' />全部</label>
        <label class='item Variety' :class="{'itemActived': filter === 'Variety'}" for="Variety">
          <input id='Variety' name='filter' v-model="filter" type='radio' value='Variety' />综艺</label>
        <label class='item GroupVariety' :class="{'itemActived': filter === 'GroupVariety'}" for="GroupVariety"><input
            id='GroupVariety' name='filter' v-model="filter" type='radio' value='GroupVariety' />团综</label>
        <label class='item Stage' :class="{'itemActived': filter === 'Stage'}" for="Stage">
          <input id='Stage' name='filter' v-model="filter" type='radio' value='Stage' />表演</label>
        <!-- trd line -->
        <label class='item Live' :class="{'itemActived': filter === 'Live'}" for="Live">
          <input id='Live' name='filter' v-model="filter" type="radio" value='Live' />直播</label>
        <label class='item Album' :class="{'itemActived': filter === 'Album'}" for="Album">
          <input id='Album' name='filter' v-model="filter" type='radio' value='Album' />专辑</label>
        <label class='item Radio' :class="{'itemActived': filter === 'Radio'}" for="Radio">
          <input id='Radio' name='filter' v-model="filter" type='radio' value='Radio' />电台</label>
        <label class='item Ceremony' :class="{'itemActived': filter === 'Ceremony'}" for="Ceremony">
          <input id='Ceremony' name='filter' v-model="filter" type="radio" value='Ceremony' />典礼</label>
        <!-- for line -->
        <label class='mainItem Search' :class="{'itemActived': filter === 'Search'}" for="Search">
          <input id='Search' name='filter' v-model="filter" type="radio" value='Search' />进行搜索</label>
      </form>
    </header>
    <Feedback/>
    <ErrorRepoort/>
    <IzoniBook :filter='filter' />
    <footer>- 暂由RDD个人维护 -</footer>
  </div>
</template>

<script lang="ts">
  import {
    Component,
    Vue
  } from 'vue-property-decorator';
  import IzoniBook from './components/IzoniBook.vue';
  import Feedback from './components/Feedback.vue'
  import ErrorRepoort from './components/ErrorRepoort.vue'
  import store from 'store'
  import axios from 'axios'
  

  @Component({
    data() {
      return {
        filter: 'Fresh',
        announcement: store.get('announcement') || '',
        newAnnouncement: '',
      }
    },
    components: {
      IzoniBook, Feedback, ErrorRepoort
    },
    watch: {
      filter(to, from) {
        this.$record('过滤器切换(to,from)', to, from)
      }
    },
    methods: {
      fetchAnnouncement() {
        axios.get(Vue.rootPath + '/util/getVal?key=izoniAnnouncement')
          .then(re => {
            this.$data.announcement = re.data.data
            store.set('announcement', re.data.data)
          }).catch(err => {
            this.$data.announcement = 'ErrorCode:42'
            Vue.error(err)
          })
      }
    },
    mounted() {
      document.getElementsByTagName('html')[0].className = 'rose'
      this.fetchAnnouncement()
    }
  })
  export default class App extends Vue {}
</script>

<style lang="scss">
.icon {
  width: 2em;
  height: 2em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>