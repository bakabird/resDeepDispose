<template>
  <div id="app">
    <header>
      <div class='introduction'>
        <div class='chasewonDay' v-if="today === '0801'"></div>
        <div class='wonyoungDay' v-else-if="today == '0831'"></div>
        <img class="logo" width="100" v-else src="./assets/iz-one-logo.png">
      </div>
      <!-- <UrgeUpdate>{{announcement}}</UrgeUpdate> -->
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
  // import UrgeUpdate from "./components/UrgeUpdate.vue"
  import store from 'store'
  import axios from 'axios'
  import moment from 'moment'
  

  @Component({
    data() {
      return {
        filter: 'Fresh',
        announcement: store.get('announcement') || '',
        newAnnouncement: '',
        today: moment().format('MMDD')
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
        Vue.getNetVal('izoniAnnouncement')
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
.birthdayPic{
  background-image: url('./assets/chasewonDay.png');
  width: 80px;
  height: 80px;
  background-size: contain;
  border: 5px solid;
  margin: 0 auto;
  margin-top: 40px;
  margin-bottom: 10px;
  border-radius: 999px;
}
</style>