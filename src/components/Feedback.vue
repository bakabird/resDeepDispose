<template>
    <PopOut :hideSignal='signal' :noExit="step !== 0">
        <template slot='face'>
            <div class='feedbackBtn'>反馈</div>
        </template>
        <template slot='body'>
            <template v-if="step === 0">
                <input class='feedbackInput' type="text" v-model="value" placeholder="在此输入反馈内容">
                <div class='mailTip'>也可以给我（<a href="mailto:rddcoding@sina.com">rddcoding@sina.com</a>）发邮件</div>
            </template>
            <div class='feedbackMsg' v-else-if="step === 1">上传中...</div>
            <div class='feedbackMsg' v-else-if="step === 2">完成反馈</div>
            <div class='feedbackMsg' v-else-if="step === 3">反馈提交失败</div>
            <button class='uploadFeedback' @click="uploadFeedback" :disabled="step !== 0">
                提交反馈
            </button>
        </template>
    </PopOut>
</template>
<script lang="ts">
import {
    Component,
    Vue
} from 'vue-property-decorator';
import PopOut from './PopOut.vue'
import axios from 'axios'

@Component({
    components: { PopOut }
})

export default class Feedback extends Vue {
    private value: string = ''
    private step: number = 0
    private signal: number = 0

    private uploadFeedback() {
        if (this.value !== '') {
            this.step = 1
            axios.post(Vue.rootPath + '/util/setVal/', {
                key: `IZONIFEEDBACK_${Date.now()}`,
                string: this.value
            }).then((re) => {
                this.step = re.data.errno === 0 ? 2 : 3
                setTimeout(() => {
                    this.signal = this.signal + 1
                }, 1200)
            }).catch(err => {
                Vue.error(err)
                this.step = 3
                setTimeout(() => {
                    this.signal = this.signal + 1
                }, 1200)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
