<template>
    <div class='izonibook'>
        <template v-if='filter==="Search"'>
            <SearchInput @uploadResultPages='dealSearchResult'/>
            <Book :Pages='SearchResultPages' />
        </template>
        <template v-else>
            <Book :Pages='PagesFiltered' />
        </template>
    </div>
</template>

<script lang="ts">
    import {
        Component,
        Prop,
        Vue
    } from 'vue-property-decorator';

    import axios from 'axios'
    import store from 'store'
    
    import Book from './Book.vue'
    import SearchInput from './SearchInput.vue'

    import IzoniFactory from "./IzoniFactory.js"

    @Component({
        data() {
            return {
                Factory: store.get('allPosters') ? new IzoniFactory(store.get('allPosters')) : new IzoniFactory(
                    []),
                FreshFactory: store.get('freshPosters') ? new IzoniFactory(store.get('freshPosters')) :
                    new IzoniFactory([]),
                criteria: store.get('criteria') || {},
                viewAll: false,
                SearchResultPages: []
            }
        },
        computed: {
            PagesHub() {
                const newPagesHub = {}
                const allFitlerKeywords = Object.keys(this.$data.criteria).filter(a => a !== 'Other')
                allFitlerKeywords.map(keyFilter => {
                    newPagesHub[keyFilter] = this.Factory.onlyTags(this.$data.criteria[keyFilter])
                })
                newPagesHub['No'] = this.Factory.pages
                newPagesHub['Fresh'] = this.FreshFactory.pages

                return newPagesHub
            },
            PagesFiltered() {
                this.viewAll = false
                return this.PagesHub[this.filter]
            },
        },
        components: {
            Book, SearchInput
        },
    })
    export default class IzoniBook extends Vue {
        @Prop() private filter!: string;

        // fetch date from api
        public flashData() {
            axios.get(Vue.rootPath + '/izone/page',{
                params:{
                    from: 0,
                    size: 25,
                    query: {
                        tags: " "
                    }
                }
            }).then((re) => {
                this.$data.Factory = new IzoniFactory(re.data.data.posters)
                store.set('allPosters', re.data.data.posters)
            }).catch((err) => {
                Vue.error(err)
            })
        }
        public makesureData() {
            axios.post(Vue.rootPath + '/izone/needToFetch', {
                version: store.get('version') || -1
            }).then(re => {
                if (re.data.data || !this.$data.allPosters || !this.$data.freshPosters || this.$data.allPosters.length === 0 
                    || this.$data.freshPosters.length === 0) {
                    this.flashData()
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
        public dealSearchResult(pages){
            this.$data.SearchResultPages = pages
        }
        // startFrom here
        public mounted() {
            this.makesureData()
            this.fetchCriteria()
        }
    }
</script>