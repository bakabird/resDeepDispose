<template>
  <div id="app">
    <header>
      <div class='introduction'>
        <img class="logo" width="150" src="./assets/iz-one-logo.png">
        <div class="new">刚出炉的熟肉呈浅珊瑚色</div>
        <div class="raw">较难食用的生肉呈墨绿色</div>
        <div class="clampTip">包含了其他纸条的夹子呈米黄色</div>
      </div>
      <!-- <div>比起弹幕数量更关注弹幕的友善度</div> -->
      <div>{{announcement}}</div>
      <!-- <div>个人维护，更新不及时见谅</div> -->
      <form class='filter'>
        <label class='mainItem Latest' :class="{'itemActived': filter === 'Latest'}" for="Latest">
          <input id='Latest' name='filter' v-model="filter" type='radio' value='Latest' />最近更新</label>
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
      </form>
    </header>
    <Book :filter='filter' />
    <footer>- 暂由RDD个人维护 -</footer>
  </div>
</template>

<script lang="ts">
  import {
    Component,
    Vue
  } from 'vue-property-decorator';
  import Book from './components/Book.vue';
  import store from 'store'
  import axios from 'axios'

  @Component({
    data() {
      return {
        filter: 'Latest',
        announcement: store.get('announcement') || '',
        newAnnouncement: '',
      }
    },
    components: {
      Book
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