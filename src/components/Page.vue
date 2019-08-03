<template>
    <div class="golds" :class="{ 
        tomorrow: dateDescription === '明天',
        theDayAfterTomorrow: dateDescription === '后天' || dateDescription === '未来',
    }">
        <div class="date" v-if="PostersSorted.length !== 0 && PostersSorted[0].date != '66-66-66'">
            {{dateDescription}} {{PostersSorted[0].date}}
        </div>
        <div class='postersBox'>
        <template v-for="(i,idx) in PostersSorted">
            <Poster v-if="i.itemType === 'note'" :noShell="i.date === '66-66-66'" :inClamp='i.inClamp !== ""'
                :key="i.id + '_poster_' + idx" :sqlId="i.id" :mainUrl='i.mainUrl' :date="i.date" :name="i.name"
                :site="i.site" :up="i.up" :tag="i.tag" :ep="i.ep" :part="i.part" :index="i.index"
                :bakedTime="i.bakedTime" :isRaw="i.isRaw" :isCut="i.isCut" :invalid="i.invalid" :members="i.members" />
            <div :key="i.id + '_goldCushion_' + idx" v-if="i.itemType === 'cushion' && clampOpened[i.inClamp]"
                @click="clampOpened[i.inClamp] = false" class='bar cushion'>合上夹子</div>
            <Clamp v-if="i.itemType === 'clamp'" @triggle="clampOpened[i.id] = !clampOpened[i.id]"
                :hasOpen="clampOpened[i.id]" :noShell="i.date === '66-66-66'" :key="i.id + '_clamp_' + idx"
                :sqlId="i.id" :mainUrl='i.mainUrl' :name="i.name" :tag="i.tag" :ep="i.ep" :part="i.part"
                :index="i.index" :bakedTime="i.bakedTime" :members="i.members" />
        </template>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'

    import Poster from './Poster.vue'
    import Clamp from './Clamp.vue'

    import moment from 'moment'

    export default {
        name: 'page',
        data() {
            return {
                clampOpened: {

                },
            }
        },
        computed: {
            clampMarkBook() {
                const posters = this.PageContent
                const newClampMarkBook = {}
                posters.map(poster => {
                    const inClamp = poster.inClamp
                    if (inClamp !== -1) {
                        newClampMarkBook[inClamp] = newClampMarkBook[inClamp] || []
                        newClampMarkBook[inClamp].push(poster)
                    }
                })
                return newClampMarkBook
            },
            dateDescription() {
                const posters = this.PageContent
                const date = posters[0].date
                let dateDescription = ''
                if (date !== '66-66-66') {
                    const validDate = '20' + date
                    dateDescription = moment(validDate).fromNow()
                    if (moment(validDate).isSame(moment().subtract(2, 'day'), 'day')) {
                        dateDescription = '前天'
                    } else if (moment(validDate).isSame(moment().subtract(1, 'day'), 'day')) {
                        dateDescription = '昨天'
                    } else if (moment(validDate).isSame(moment(), 'day')) {
                        dateDescription = '今天'
                    } else if (moment(validDate).isSame(moment().add(1, 'day'), 'day')) {
                        dateDescription = '明天'
                    } else if (moment(validDate).isSame(moment().add(2, 'day'), 'day')) {
                        dateDescription = '后天'
                    } else if (moment(validDate).isAfter(moment(), 'day')) {
                        dateDescription = '未来'
                    } else {
                        dateDescription = ''
                    }
                } else {
                    dateDescription = '置顶'
                }
                return dateDescription
            },
            PostersSorted() {
                let pageSorted = []
                const pagePosters = this.PageContent
                const pagePostersWithoutPostersInClamp = pagePosters.filter((poster) => {
                    return poster.inClamp === '';
                })
                const clampMarkBook = this.clampMarkBook
                const clampOpened = this.clampOpened

                for (const poster of pagePostersWithoutPostersInClamp) {
                    pageSorted.push(poster)
                    if (poster.itemType === 'clamp') {
                        const id = poster.id
                        const postersInTheClamp = clampMarkBook[id]
                        if (clampOpened[id]) {
                            pageSorted = [...pageSorted, ...postersInTheClamp, {
                                itemType: 'cushion',
                                inClamp: id
                            }]
                        }
                    }
                }

                return pageSorted
            }
        },
        components: {
            Poster,
            Clamp
        },
        mounted() {
            const clampOpened = {}
            this.$props.PageContent.map(poster => {
                const inClamp = poster.inClamp
                clampOpened[inClamp] = clampOpened[inClamp] || false
            })
            this.$data.clampOpened = clampOpened
        },
        props: {
            PageContent: {
                type: Array,
                default: () => {
                    return []
                }
            }
        }
    }
</script>