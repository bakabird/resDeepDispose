<template>
    <div class='izonibook'>
        <template v-if="filter==='Search'">
            <SearchInput ref="SearchInput"/>
            <ClipBoard @appendSearchValwithWord="appendSearchValwithWord"/>
        </template>
        <Book :Pages='Pages' />
    </div>
</template>

<script lang="ts">
import {
    Component,
    Prop,
    Watch,
    Vue
} from 'vue-property-decorator';

import store from 'store'

import paging from './paging'
import IzoniFactory from './IzoniFactory.js'

import Book from './Book.vue'
import SearchInput from './SearchInput.vue'
import ClipBoard from './ClipBoard.vue';

import debounce from 'lodash.debounce';

interface StorePages {
    version: number
    size: number
    total: number
    pages: any[][]
}

@Component({
    components: {
        Book, SearchInput, ClipBoard
    }
})
export default class IzoniBook extends Vue {

    get pageKey() {
        return `Page.${this.$props.filter}`
    }
    get query() {
        const filter = this.$props.filter

        if (filter === 'Fresh') {
            return {
                fresh: true
            }
        } else if (filter === 'Search') {
            return {
                search: this.SearchKey
            }
        } else {
            return {
                tags: this.criteria[filter] ? this.criteria[filter].join(' ') : ' '
            }
        }
    }
    get SearchKey() {
        return this.$store.state.SearchKey
    }
    private criteria: any = store.get('criteria') || {}
    private Pages: any[][] = []
    private SearchResult: any[][] = []
    private size: number = 0
    private total: number = 0
    private waitForTurnPage: boolean = false

    @Prop({
        required: true
    }) private filter!: string;
    private debounceUpdatePage = debounce(this.updatePage, 250, { maxWait: 1000 })

    @Watch('pageKey', {
        immediate: true
    })
    private watchPageKey(newPageKey: string) {
        if (this.$props.filter !== 'Search') {
            this.fetchPage()
        } else {
            this.Pages = []
        }
    }

    @Watch('SearchKey')
    private watchSearchKey(newSearchKey) {
        if (this.$props.filter === 'Search') {
            this.debounceUpdatePage()
        }
    }

    // startFrom here
    private mounted() {
        // store.clearAll()
        this.fetchCriteria()
        window.onscroll = this.turnPageCheck.bind(this)
    }

    private fetchCriteria() {
        Vue.getNetVal(`izoniCriteria`)
            .then(re => {
                const criteria = JSON.parse(re.data.data)
                this.$data.criteria = criteria
                store.set('criteria', criteria)
            }).catch(err => {
                Vue.error(err)
            })
    }
    private fetchPage() {
        const localPage: StorePages = this.localPage()

        const version = localPage.version
        this.size = localPage.size
        this.total = localPage.total
        this.Pages = localPage.pages

        Vue.getMsg("needToFetch",{
            version
        }).then(re => {
            const shouldUpdate = re.data.data
            if (shouldUpdate) {
                this.updatePage()
            }
        })
    }
    private turnPageCheck() {
        const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

        if (scrollTop + clientHeight >= scrollHeight * 0.8 && this.size < this.total) {
            this.turnPage()
        }
    }
    private turnPage() {
        if (!this.waitForTurnPage) {
            this.waitForTurnPage = true
            const query = this.query
            Vue.getMsg("page",{
                from: this.size,
                size: 25,
                query,
                version: this.localPage().version
            }).then(re => {
                const {
                    pages,
                    version,
                    size,
                    total
                } = re.data.data

                if (version === this.localPage().version) {
                    Vue.log(`merge local pages on updatePage`)
                    const oldPages = this.Pages.map(page => page.map(poster => poster))
                    this.Pages = this.PagesMerger(oldPages, pages)
                    this.size = this.size + size
                } else {
                    Vue.log(`replace local pages on updatePage`)
                    this.Pages = []
                    this.Pages = pages
                    this.size = this.size
                }
                this.total = total

                this.updateLocalPage({
                    pages: this.Pages,
                    version,
                    size: this.size,
                    total
                })
                this.waitForTurnPage = false
            }).catch(err => {
                Vue.error(err)
            })
        }
    }
    private updatePage() {
        const query = this.query
        Vue.getMsg("page1",{
            size: 25,
            query
        }).then((re) => {
            const {
                pages,
                version,
                size,
                total
            } = re.data.data
            Vue.log(`update local pages on updatePage`)


            this.Pages = pages
            this.total = total
            this.size = size > total ? total : size

            this.updateLocalPage({
                pages,
                version,
                size: 25,
                total
            })
        }).catch((err) => {
            Vue.error(err)
        })
    }
    private updateLocalPage(pac: StorePages) {
        store.set(this.pageKey, pac)
    }
    private PagesMerger(opages, npages) {
        if (npages.length !== 0) {
            const opLastPage = opages.pop()
            npages.reverse()
            const npFirstPage = npages.pop()
            npages.reverse()
            if (opLastPage[0].date === npFirstPage[0].date) {
                const mergePage = paging(opLastPage.concat(npFirstPage))[0]
                return [...opages, mergePage, ...npages]
            } else {
                return [...opages, opLastPage, npFirstPage, ...npages]
            }
        } else {
            return opages
        }
    }

    private localPage(): StorePages {
        const storePage: StorePages = store.get(this.pageKey)
        if (!!storePage && typeof storePage === 'object' &&
            storePage.hasOwnProperty(`pages`) && storePage.hasOwnProperty(`version`) &&
            storePage.hasOwnProperty(`size`) && storePage.hasOwnProperty(`total`)) {
            return storePage
        } else {
            // storePage is not valid -> reset it
            const emptyPage = {
                pages: [],
                version: -1,
                size: 0,
                total: 0
            }
            store.set(this.pageKey, emptyPage)
            return emptyPage
        }
    }

    private appendSearchValwithWord(word: string) {
        this.$refs.SearchInput['updateSearchVal'](this.$refs.SearchInput['searchVal'] + word)
    }
}
</script>
