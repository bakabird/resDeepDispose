<template>
    <div class="box">
        <p class="btn" @click="onClickUrgeBtn">
            点这里催更
            {{ this.localUrgePower > 0 ? `($localUrgePower})` : "" }}
        </p>
        <hr>
        <p>每催更十次就会有一只鸽子</p>
        <div class="dove">
            {{doveStr}}}}
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

    const URGE_POWER = "URGE_POWER"

    @Component({})
    export default class UrgeUpdate extends Vue {
        private curUrgePower: number = 0
        private userUrgePower: number = 0

        get localUrgePower(){
            return this.curUrgePower + this.userUrgePower
        }

        get doveStr(){
            let re = ""
            let tmp = this.localUrgePower
            while(tmp > 0){
                re += "🕊"
                tmp--
            }
            return re
        }

        private async mounted() {
            const re = await Vue.getNetVal(URGE_POWER)
            this.curUrgePower = parseInt(re.data.data, 10)
        }

        private onClickUrgeBtn(){
            this.userUrgePower++
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>