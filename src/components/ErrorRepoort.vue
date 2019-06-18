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
        components:{ PopOut }
    })

    export default class ErrorRepoort extends Vue {
        private value: string = ''
        private step: number = 0
        
        get curState(){
            switch(this.step){
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
            store.each(function(value, key) {
                LocalStore[key] = value
            })
            axios.post(Vue.rootPath + '/util/setVal',{
                key: `IZONIREPORT${Date.now()}_${navigator.appName}`,
                string: JSON.stringify(LocalStore)
            }).then(re => {
                if(re.data.errno === 0){
                    this.step = this.step + 1 
                    store.clearAll()
                    setTimeout(()=>{
                        this.step = this.step + 1 
                        setTimeout(()=>{
                            location.reload()
                        },500)
                    },500)
                }
            })
        }
    }
</script>
<style lang="scss" scoped>
.ErrorReportBtn{
    background: linear-gradient(130deg, rgb(255, 248, 248) 15%, rgba(255,232,241,1) 50% , rgb(255, 156, 192) 51%, rgb(255, 0, 116) 100%);
    background-size: 300% 100%;
    color: #e9757a;
    position: absolute;
    font-size: .8em;
    top: 10px;
    // border-bottom: 1px solid rgb(221, 163, 165);
    border-radius: 6px;
    right: 15px;
    padding: .2em .6em .3em .6em;
}
</style>
