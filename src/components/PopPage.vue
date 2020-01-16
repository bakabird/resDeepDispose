<template>
    <div class="popPage" v-show="PopClampId != -1">
        <!-- 这里是填充层，用来注入夹子里面的 -->
        <div class="warp">
            <div class="box">
                <Poster v-for="(i,idx) in ClampPosters[PopClampId]" :itemType='i.itemType'
                    :noShell="i.date === '66-66-66'" :inClamp='i.inClamp !== ""' :cover="i.cover" :duration='i.duration'
                    :sumDuration='i.sumDuration' :key="i.id + '_poster_' + idx" :sqlId="i.id" :mainUrl='i.mainUrl'
                    :date="i.date" :name="i.name" :site="i.site" :up="i.up" :tag="i.tag" :ep="i.ep" :part="i.part"
                    :index="i.index" :bakedTime="i.bakedTime" :isRaw="i.isRaw" :isCut="i.isCut" :isCollect="i.isCollect"
                    :invalid="i.invalid" :members="i.members" />
            </div>
        </div>
        <div class="buttonGroup">
            <button @click="close">收起夹子</button>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        Component,
        Vue,
        Watch
    } from 'vue-property-decorator';
    import store from 'store'
    import Poster from "./Poster.vue"


    @Component({
        components: {
            Poster
        },
    })
    export default class App extends Vue {
        get PopClampId() {
            return this.$store.state.PopClampId
        }
        get ClampPosters() {
            return this.$store.state.ClampPosters
        }

        close() {
            this.$store.commit('clearPopClampId')
        }
        back() {}
        next() {}
        mounted() {}
    }
</script>

<style lang="scss">
    .popPage {
        .warp {
            right: 0;
            position: absolute;
            bottom: 30px;
            top: 0;
            left: 0;
            overflow: auto;
            padding-top: 50px;

            .box {
                flex-direction: row;
                display: flex;
                justify-content: flex-start;
                flex-wrap: wrap;
            }
        }

        width: 100vw;
        height: 90vh;
        position: fixed;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        bottom: 0;
        background: #fff8ee;
        box-shadow: aliceblue;
        box-shadow: 0px -1px 100px 1px #000;
    }

    .buttonGroup {
        height: 30px;
        position: absolute;
        bottom: 0;
        font-size: 16px;
        width: 100vw;

        button {
            height: 100%;
            width: 100%;
            background: #fff0db;
            color: #e4555a;
            border: none;
        }

        // button:nth-of-type(2) {
        //     border-left: 1px dashed #e4555a;
        //     border-right: 1px dashed #e4555a;
        // }
    }
</style>