<template>
    <div class='clipboard'>
        <div class="clipboard_row" v-for="(words,usearea) in clipBoard" :key="'userarea_'+usearea">
            <div class='clipboard_usearea'>{{usearea}}</div>
            <div class="clipboard_word" v-for="(word,idx) in words" :key="'userarea_'+usearea+'_index_'+idx+'_word_'+word" @click="$emit('appendSearchValwithWord',word)">
                {{word}}
            </div>
        </div>
    </div>
</template>
<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import { IZONEClipBoard } from '../DistInterface';
import axios from 'axios'
import PopOut from './PopOut.vue'

@Component({components: {PopOut}})
export default class ClipBoard extends Vue {
    public clipBoardString: string = '{}'

    get clipBoard(): IZONEClipBoard {
        return JSON.parse(this.clipBoardString)
    }

    public mounted() {
        this.fetchClipBoard()
    }
    public async fetchClipBoard() {
        try {
            const res = await Vue.getNetVal(`IZONEClipBoard`)

            if (res.data && res.data.data !== '') {
                this.clipBoardString = res.data.data
            } else {
                this.clipBoardString = '{}'
            }
        } catch (err) {
            Vue.error(err)
        }
    }
}
</script>
<style lang="scss" scoped>
.clipboard{
    margin-top: -15px;
    margin-bottom: 15px;
}
.clipboard_row{
    display: flex;
    margin-bottom: 1px;
    flex-wrap: wrap;
    .clipboard_usearea{
        width: 70px;
        color: #ee9a9c;
    }
    .clipboard_word{
        flex: 1;
        border-right: 1px solid #fcfffd;
        color: #eb8a8e;
        background: #fdf0ea;
    }
    .clipboard_word:hover{
        flex: 1;
        margin-right: 1px;
        color: #ffd9d9;
        background: #e95157;
    }
}
</style>
