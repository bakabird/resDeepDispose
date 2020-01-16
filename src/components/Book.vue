<template>
  <div class="book">
    <!-- <Page v-for="(P) in Pages" class='dateCard' :key="`${P[0].date}[${P.length}]`" :PageContent='P'/> -->
    <div v-for="Page in Pages" :key='`page_${Page[0].date}`'>
      <div class="dateCard" :key='`date_${Page[0].date}`'>{{Page[0].date === "66-66-66" ? "置顶" : Page[0].date}}</div>
      <div class="pageCard">
        <template v-for="(i,idx) in sortPage(Page)">
          <Poster v-if="i.itemType === 'note' || i.itemType === 'clamp'" :itemType='i.itemType'
            :noShell="i.date === '66-66-66'" :inClamp='i.inClamp !== ""' :cover="i.cover" :duration='i.duration'
            :sumDuration='i.sumDuration' :key="i.id + '_poster_' + idx" :sqlId="i.id" :mainUrl='i.mainUrl'
            :date="i.date" :name="i.name" :site="i.site" :up="i.up" :tag="i.tag" :ep="i.ep" :part="i.part"
            :index="i.index" :bakedTime="i.bakedTime" :isRaw="i.isRaw" :isCut="i.isCut" :isCollect="i.isCollect"
            :invalid="i.invalid" :members="i.members" />
          <!-- <div :key="i.id + '_goldCushion_' + idx" v-if="i.itemType === 'cushion' && clampOpened[i.inClamp]"
            @click="clampOpened[i.inClamp] = false" class='bar cushion'>合上夹子</div> -->
        </template>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
  import {
    Component,
    Prop,
    Vue,
    Watch
  } from 'vue-property-decorator';
  import Poster from "./Poster.vue"
  // import Page from './Page.vue'

  @Component({
    components: {
      // Page
      Poster
    },
  })
  export default class Book extends Vue {
    @Prop() private Pages!: object[];

    @Watch('Pages')
    watchPages(newPages) {
      const newClampPosters = {}
      for (const pagePosters of newPages) {
        const pagePosters_withPostersInClamp = pagePosters.filter((poster) => {
          return poster.inClamp !== '';
        })

        const newClampPostersClip = {}
        pagePosters_withPostersInClamp.map(poster => {
          newClampPostersClip[poster.inClamp] = newClampPostersClip[poster.inClamp] || []
          newClampPostersClip[poster.inClamp].push(poster)
        })
        Object.assign(newClampPosters, newClampPostersClip)
      }
      this.$store.commit('setClampPosters',newClampPosters)
    }

    sortPage(PageContent) {

      // for (const poster of PageContent) {
      //   // console.log(poster)
      //   if(poster.itemType !== "note"){
      //     console.log(poster)
      //   }
      // }

      let pageSorted = []
      const pagePosters = PageContent
      const pagePosters_withoutPostersInClamp = pagePosters.filter((poster) => {
        return poster.inClamp === '';
      })

      // const clampMarkBook = this.clampMarkBook
      // const clampOpened = this.clampOpened

      for (const poster of pagePosters_withoutPostersInClamp) {
        pageSorted.push(poster)
        // if (poster.itemType === 'clamp') {
        //     const id = poster.id
        //     const postersInTheClamp = clampMarkBook[id]
        //     if (clampOpened[id]) {
        //         pageSorted = [...pageSorted, ...postersInTheClamp, {
        //             itemType: 'cushion',
        //             inClamp: id
        //         }]
        //     }
        // }
      }

      return pageSorted
    }
  }
</script>