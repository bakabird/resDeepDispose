<template>
  <div class="mine">
    <div v-for="(Page,idx) in PagesFiltered" class='dateCard' :key="Page[0].date">
      <Page v-if='idx <= 31 || viewAll' :PageContent='Page' :Sites='Sites' :Tags='tagsClassified' />
    </div>
    <Button class='viewAllBtn' v-if='viewAll === false && PagesFiltered.length > 31' @click="viewAll = true">查看剩余纸条</Button>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue
} from 'vue-property-decorator';
import Page from './Page.vue'

import axios from 'axios'
import store from 'store'
import isEqual from 'lodash.isequal'
import moment, { version } from 'moment'

function sortIndex(a, b) {
  return b.index - a.index
}

function sortRaw(a, b) {
  return a.isRaw - b.isRaw
}

function isOneOf(itm, arr) {
  for (const i of arr) {
    if (itm === i) {
      return true
    }
  }
  return false
}


// 排序
function strSum(str: string) {
  const strarr = str.split('')
  let i = 0
  strarr.forEach((a) => {
    i = i + a.charCodeAt(0)
  })
  return i;
}

function sortByDateAndOther(a: any, b: any) {
  const Adate = parseInt(a.date.split('-').join(''), 10) * 1000
  const Bdate = parseInt(b.date.split('-').join(''), 10) * 1000
  const Astr = strSum(a.name) / 1000
  const Bstr = strSum(b.name) / 1000
  const AScore = Adate + Astr + a.ep + a.part
  const BScore = Bdate + Bstr + b.ep + b.part
  return BScore - AScore;
}

// 分析
function attrStatistics(sample, attrName) {
  // 将某个由多个对象组成数组，对该数组中对象的某个属性的值进行数量统计
  const statistics = {}
  for (const itm of sample) {
    const itmAttrValue = itm[attrName]
    if (statistics.hasOwnProperty(itmAttrValue)) {
      statistics[itmAttrValue]++
    } else {
      statistics[itmAttrValue] = 0
    }
  }
  return statistics
}

function statisticsSort(stat) {
  // 按照数量统计进行排序，返回一个有顺序的值数组
  const sort = Object.keys(stat)
  sort.sort((a: string, b: string) => {
    return stat[b] - stat[a]
  })
  return sort
}



@Component({
  data() {
    return {
      allPosters: store.get('allPosters') || [],
      freshPosters: store.get('freshPosters') || [],
      criteria: store.get('criteria') || {},
      viewAll: false
    }
  },
  methods: {
    getCurrentPosters() {
      if (this.$props.filter === 'Latest') {
        return this.$data.freshPosters
      } else {
        return this.$data.allPosters
      }
    }
  },
  computed: {
    Posters() {
      return this.getCurrentPosters()
    },
    Tags() {
      const newTags = statisticsSort(attrStatistics(this.Posters, 'tag'))
      return isEqual(this.$data.Tags, newTags) ? this.$data.Tags : newTags
    },
    Sites() {
      const newSites = statisticsSort(attrStatistics(this.Posters, 'site'))
      return isEqual(this.$data.Sites, newSites) ? this.$data.Sites : newSites
    },
    tagsClassified() {
      const criteria = this.criteria
      const tags = this.Tags
      const keys = Object.keys(criteria)

      let include = []
      const re: any = {}
      for (const key of keys) {
        re[key] = tags.filter(i => isOneOf(i, criteria[key]))
        include = [...include, ...criteria[key]]
      }

      re.Other = tags.filter(i => !isOneOf(i, include))
      Vue.log(re)
      return re
    },
    PagesHub() {
      Vue.log('密集计算打卡点')
      const newPagesHub = {}
      const pages = this.Pages

      const allFitlerKeywords = Object.keys(this.$data.criteria).filter(a => a !== 'Other')
      allFitlerKeywords.push('No')
      const pagesForAllPostres = this.paging(this.$data.allPosters)
      for (const someFilter of allFitlerKeywords) {
        const pagesOnThisFilter = []
        for (let page of pagesForAllPostres) {
          const date = page[0].date
          if (date !== '66-66-66' && someFilter !== 'No') {
            page = page.filter(i => (isOneOf(i.tag, this.$data.criteria[someFilter] || [])))
          }
          page = page.sort(sortIndex)
          page = page.sort(sortRaw)
          if (page.length !== 0) {
            pagesOnThisFilter.push(page)
          }
        }
        newPagesHub[someFilter] = pagesOnThisFilter
      }

      const pagesOnFresh = []
      for (let page of this.paging(this.$data.freshPosters)) {
        page = page.sort(sortIndex)
        page = page.sort(sortRaw)
        if (page.length !== 0) {
          pagesOnFresh.push(page)
        }
      }
      newPagesHub['Fresh'] = pagesOnFresh

      return newPagesHub
    },
    PagesFiltered() {
      this.viewAll = false
      return this.PagesHub[this.filter]
    },
  },
  components: {
    Page
  },
})
export default class Book extends Vue {
  @Prop() private filter!: string;

  // factory for the useful date
  //    including: Golds Sites Tag & Page
  public paging(posters) {
    const newPages: any = []
    const now = moment();
    let i = -1;
    let lastDate = ''
    posters.map((poster: any) => {
      if (lastDate === poster.date) {
        newPages[i].push(poster)
      } else {
        i++
        lastDate = poster.date
        newPages[i] = [poster]
      }
    })
    return newPages;
  }

  public setFreshPosters(posters) {
    this.$data.freshPosters = this.processPosters(posters)
    store.set('freshPosters', this.$data.freshPosters)
  }
  public setAllPosters(posters) {
    this.$data.allPosters = this.processPosters(posters)
    store.set('allPosters', this.$data.allPosters)
  }
  public processPosters(posters) {
    const posterSorted = posters.sort(sortByDateAndOther)
    return posterSorted
  }
  // fetch date from api
  public flashData() {
    axios.get(Vue.rootPath + '/izone/all')
      .then((re) => {
        this.setAllPosters(re.data.data.posters)
        if(store.get('version') !== re.data.data.version){
          this.freshData(false)
        }
      })
      .catch((err) => {
        Vue.error(err)
      })
  }
  public freshData(continueFetchAllPoster = true) {
    axios.get(Vue.rootPath + '/izone/fresh')
      .then((re) => {
        this.setFreshPosters(re.data.data.posters)
        store.set('version', re.data.data.version)
        if(continueFetchAllPoster){
          setTimeout(() => {
            this.flashData()
          }, 4200)
        }
      })
      .catch((err) => {
        Vue.error(err)
      })
  }
  public makesureData(){
    axios.post(Vue.rootPath + '/izone/needToFetch',{
      version: store.get('version') || -1
    }).then(re => {
      if(re.data.data || !this.$data.allPosters || !this.$data.freshPosters || this.$data.allPosters.length === 0 || this.$data.freshPosters.length === 0){
        this.freshData()
      }
    })
  }
  public fetchCriteria() {
    axios.get(Vue.rootPath + '/util/getVal?key=izoniCriteria')
      .then(re => {
        this.$data.criteria = JSON.parse(re.data.data)
        store.set('criteria', JSON.parse(re.data.data))
      }).catch(err => {
        Vue.error(err)
      })
  }
  // startFrom here
  public mounted() {
    this.makesureData()
    this.fetchCriteria()
  }
}
</script>