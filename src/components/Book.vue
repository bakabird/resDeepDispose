<template>
  <div class="book">
    <!-- <Page v-for="(P) in Pages" class='dateCard' :key="`${P[0].date}[${P.length}]`" :PageContent='P'/> -->
    <template v-for="Page in Pages">
      <!-- <div class='datePoster' :key='`date_${Page[0].date}`'>{{Page[0].date}}</div> -->
      <template v-for="(i,idx) in sortPage(Page)">
        <Poster v-if="i.itemType === 'note'" :noShell="i.date === '66-66-66'" :inClamp='i.inClamp !== ""'
          :cover="i.cover" :duration='i.duration' :sumDuration='i.sumDuration'
          :key="i.id + '_poster_' + idx" :sqlId="i.id" :mainUrl='i.mainUrl' :date="i.date" :name="i.name" :site="i.site"
          :up="i.up" :tag="i.tag" :ep="i.ep" :part="i.part" :index="i.index" :bakedTime="i.bakedTime"
          :isRaw="i.isRaw" :isCut="i.isCut" :isCollect="i.isCollect" :invalid="i.invalid" :members="i.members" />
        <!-- <div :key="i.id + '_goldCushion_' + idx" v-if="i.itemType === 'cushion' && clampOpened[i.inClamp]"
          @click="clampOpened[i.inClamp] = false" class='bar cushion'>合上夹子</div> -->
        <!-- <Clamp v-if="i.itemType === 'clamp'" @triggle="clampOpened[i.id] = !clampOpened[i.id]"
                  :hasOpen="clampOpened[i.id]" :noShell="i.date === '66-66-66'" :key="i.id + '_clamp_' + idx"
                  :sqlId="i.id" :mainUrl='i.mainUrl' :name="i.name" :tag="i.tag" :ep="i.ep" :part="i.part"
                  :index="i.index" :bakedTime="i.bakedTime" :members="i.members" /> -->
      </template>
    </template>

  </div>
</template>

<script lang="ts">
  import {
    Component,
    Prop,
    Vue
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
    sortPage(PageContent) {
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