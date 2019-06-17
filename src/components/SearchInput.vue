<template>
    <div class='searchInputWrap'>
        <div class='searchBtn'>
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-search"></use>
            </svg>
        </div>
        <input class='searchInput' type='search' v-model='searchVal' @input="$emit('change',searchVal)">
    </div>
</template>

<script lang="ts">
    import {
        Component,
        Prop,
        Vue,
        Watch
    } from 'vue-property-decorator';

    @Component({
        model: {
            prop: 'value',
            event: 'change'
        }
    })
    export default class SearchInput extends Vue {
        private searchVal: string = ''

        @Prop() private value!: string;
    }
</script>