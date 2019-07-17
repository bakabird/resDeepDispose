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
.feedbackBtn{
    background: linear-gradient(130deg, rgb(255, 248, 248) 15%, rgba(255,232,241,1) 50% , rgb(255, 156, 192) 51%, rgb(255, 0, 116) 100%);
    background-size: 300% 100%;
    color: #e9757a;
    position: absolute;
    font-size: .8em;
    top: 10px;
    // border-bottom: 1px solid rgb(221, 163, 165);
    border-radius: 6px;
    left: 15px;
    padding: .2em .6em .3em .6em;
}
.feedbackInput{
    width: 85vw;
    height: 2em;
    padding: 0px 5px;
    border-radius: 7px;
    border-top: 1px solid #bd8a8a;
    border-right: 1px solid #f3e0e0;
    border-left: 1px solid #c3a0a0;
    font-size: 15px;
    border-bottom: none;
    margin-bottom: 5px;
}
.feedbackMsg{
    width: 85vw;
}
.uploadFeedback{
    width: 40%;
    background: #ffeaea;
    border: none;
    position: absolute;
    left: 30%;
    bottom: -48px;
    padding: 3px;
    font-size: 15px;
    border-bottom: 1px solid #dc9797;
    color: #e28b8f;
    border-radius: 5px;
    &:disabled{
        background: #ece7e7;
        border-bottom: 1px solid #a99d9d;
        color: #c5acae;
    }
}
.mailTip{
    font-size: 12px;
    a{
        color: #da5a5f;
    }
}
</style>
