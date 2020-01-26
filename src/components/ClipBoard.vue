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