<template>
  <div class="mine">
    <Page v-for="(P) in Pages" class='dateCard' :key="`${P[0].date}[${P.length}]`" :PageContent='P'/>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue
} from 'vue-property-decorator';
import Page from './Page.vue'

@Component({
  components: {
    Page
  },
})
export default class Book extends Vue {
  @Prop() private Pages!: Array<Object>;
}
</script>