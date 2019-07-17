<template>
    <div>
        <div class='openSearch' @click='show = true'>
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-search"></use>
            </svg>
        </div>
        <div class='search-board' v-if='show'>
            <div class='cancelBtn' @click="show = false">
                <svg class="icon cancel-icon" aria-hidden="true">
                    <use xlink:href="#icon-cancel"></use>
                </svg>
            </div>
            <div class='searchInputWrap'>
                <div class='searchBtn'>
                    <svg class="icon" aria-hidden="true" @click='flashPage'>
                        <use xlink:href="#icon-search"></use>
                    </svg>
                </div>
                <input class='searchInput' type='search' v-model='searchVal' @input='flashPage'>
            </div>
            <div class='searchResult' @scroll='touchDown'>
                <Book :Pages='searchResultPosters' />
                <div class='touchDownTip' v-if='this.pages == this.curPage'>
                    {{ this.pages === 0 ? '没有搜索结果' : '这里是底部' }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Prop,
    Vue,
    Emit
} from 'vue-property-decorator';
import axios from 'axios'
import Book from './Book.vue'
import IzoniFactory from './IzoniFactory.js'

@Component({
    data() {
        return {
            show: true,
            searchVal: '',
            hits: [],
            pages: 0,
            curPage: 0,
            searchResultPosters: []
        }
    },
    components: {
        Book
    },
})
export default class SearchBoard extends Vue {
    private touchDown(e) {
        const target = e.target
        const clientHeight = target.clientHeight;
        const scrollTop = target.scrollTop;
        const scrollHeight = target.scrollHeight;
        if (scrollTop + clientHeight >= scrollHeight * 0.8) {
            if (this.$data.pages > this.$data.curPage) {
                this.$data.curPage += 1;
                this.toSearch()
            } else {
                // console.log('差不多到底了')
            }
        }
    }
    private toSearch() {
        axios.post('http://localhost:9200/izoni/_search', {
            query: {
                match: {
                    name: this.$data.searchVal,
                },
            },
            size: (this.$data.curPage + 1) * 10,
            sort: {
                date: {
                    order: 'desc'
                }
            }
        }).then(re => {
            this.$data.pages = Math.ceil(re.data.hits.total.value / 10)
            this.$data.hits = re.data.hits.hits
            // 组织出Posters
            const Posters = []
            this.$data.hits.map(hit => {
                const dateStr = `${hit._source.date}`
                hit._source.dateStr =
                    `${dateStr[0]}${dateStr[1]}-${dateStr[2]}${dateStr[3]}-${dateStr[4]}${dateStr[5]}`

                // 填补Poster
                const poster = Object.assign({}, hit._source)
                poster.date = poster.dateStr
                delete poster.dateStr
                poster.id = parseInt(hit._id, 10)

                Posters.push(poster)
            })
            // 使用Factory将Poster转换成页数数据
            const Factory = new IzoniFactory(Posters)
            this.$data.searchResultPosters = Factory.pages
        }).catch(err => {
            Vue.error(err)
        })
    }
    private flashPage() {
        this.$data.curPage = 0
        this.toSearch()
    }
    private lastPage() {
        this.$data.curPage -= 1
        this.toSearch()
    }
    private nextPage() {
        this.$data.curPage += 1
        this.toSearch()
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
    .openSearch {
        position: fixed;
        top: 5px;
        border-radius: 8px;
        padding: 1px;
        width: 26px;
        border: 1px solid;
        z-index: 50;
        background: #fff;
        right: 5px;
    }

    .search-board {
        position: fixed;
        left: 0px;
        right: 0px;
        background: rgb(250, 250, 250);
        top: 60px;
        /* border: 1px solid #df5862; */
        border-top: 3px solid #d69a9e;
        /* border-left: 1px solid #e0e0e0; */
        box-shadow: 0px -5px 20px 2px #d4bfa54a;
        /* border-right: 1px solid #e0e0e0; */
        z-index: 100;
        /* border-bottom: 1px solid #ada9a9; */
        color: #272121;
        bottom: 0px;

        .cancelBtn {
            position: fixed;
            top: 10px;
            right: calc(50vw - 15px);
            padding: 3px;
            color: #ffe7c0de;
            background: #d69a9e;
            border-radius: 999px;
            -webkit-box-shadow: 0 1px 1px #04000038;
            box-shadow: 0 1px 1px #04000038;

            .cancel-icon {
                width: 30px;
                height: 30px;
            }
        }
    }

    .searchResult {
        overflow: auto;
        position: absolute;
        width: 100%;
        bottom: 0px;
        top: 45px;
        background: #fff;
        border-top: 1px solid #d69a9e;

        .touchDownTip {
            background: #f3f7f4;
            color: #c74e56;
            height: 30px;
            margin: 10px 20px 10px;
            margin-top: 10px;
            line-height: 30px;
        }
    }

    .searchInputWrap {
        margin: 10px 5% 0px;
        display: flex;
        // border-radius: 3px;
        border: 1px solid #989898;

        .searchInput {
            flex: 1;
            height: 2em;
            border: none;
            padding-left: 3px;
            padding-right: 1em;
            border-right: 1px solid;
        }
    }



    .searchBtn {
        width: 2em;
        height: 2em;

        &>svg {
            width: 12px;
        }
    }
</style>