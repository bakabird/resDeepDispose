<template>
    <div>
        <div @click="show">
            <slot name='face'>
            </slot>
        </div>
        <div v-if="popoutttt" class='PopOutBlock' @click.self="hide">
            <div class='PopOutBody'>
                <slot name='body'></slot>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    data() {
        return {
            popoutttt: false
        }
    },
    methods: {
        show() {
            this.$data.popoutttt = true
            Vue.nextTick(() => {
                this.$emit('pop')
            })
        },
        hide() {
            if (!this.$props.noExit) {
                this.$data.popoutttt = false
            }
        }
    },
    watch: {
        hideSignal() {
            this.$data.popoutttt = false
        }
    },
    props: {
        noExit: {
            type: Boolean,
            default: false
        },
        hideSignal: {
            type: Number,
            default: 0
        }
    },
})
</script>
<style lang="scss">
.PopOutBlock{
    position: fixed;
    z-index: 100000;
    bottom: 0;
    left:0;
    right: 0;
    top: 0;
    background: #0002;
    .PopOutBody{
        z-index: 200000;
        display: inline-block;
        margin: 0 auto;
        margin-top: 10vh;
        background: #ffe8e8;
        box-shadow: 0 0 18px 10px #ffe8e8;
        border-radius: 7px;
        position: relative;
        padding: 10px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;   
    }
}
</style>
