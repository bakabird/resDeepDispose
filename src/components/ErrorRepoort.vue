<template>
    <PopOut :noExit='true'>
        <template slot='face'>
            <div class='ErrorReportBtn' @click="report">如果出错了尝试点这里修复</div>
        </template>
        <template slot='body'>
            <div>{{curState}}</div>
        </template>
    </PopOut>
</template>
<script lang="ts">
import {
    Component,
    Vue
} from 'vue-property-decorator';
import axios from 'axios'
import PopOut from './PopOut.vue'
import store from 'store'

@Component({
    components: { PopOut }
})

export default class ErrorRepoort extends Vue {
    private value: string = ''
    private step: number = 0

    get curState() {
        switch (this.step) {
            case 0:
                return '上传报告中...'
                break;
            case 1:
                return '上传报告完毕，清理缓存中...'
                break
            case 2:
                return '上传报告完毕，清理缓存完毕，即将刷新...'
                break
        }
    }

    private report() {
        const LocalStore = {}
        store.each((value, key) => {
            LocalStore[key] = value
        })
        axios.post(Vue.rootPath + '/util/setVal', {
            key: `IZONIREPORT${Date.now()}_${navigator.appName}`,
            string: JSON.stringify(LocalStore)
        }).then(re => {
            if (re.data.errno === 0) {
                this.step = this.step + 1
                store.clearAll()
                setTimeout(() => {
                    this.step = this.step + 1
                    setTimeout(() => {
                        location.reload()
                    }, 500)
                }, 500)
            }
        })
    }
}
</script>
