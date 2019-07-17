<template>
    <div class='searchInputWrap'>
        <div class='searchBtn'>
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-search"></use>
            </svg>
        </div>
        <input class='searchInput' type='search' v-bind:value='searchVal' @input="onInputChange">
    </div>
</template>

<script lang="ts">
import {
    Component,
    Prop,
    Vue,
    Watch
} from 'vue-property-decorator';

@Component({})
export default class SearchInput extends Vue {
    public searchVal: string = ''

    private onInputChange(e) {
        this.updateSearchVal(e.target.value)
    }
    private updateSearchVal(newSearchVal: string) {
        this.searchVal = newSearchVal
        this.$store.commit('updateSearchKey', newSearchVal)
    }
}
</script>