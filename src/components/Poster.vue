<template>
  <div class="bar poster" :class="{ new:!!isNew, raw:!!isRaw, inClamp: inClamp, noShellPoster: noShell}">
    <a class="title link" @click="record(mainUrl)" :href="mainUrl" target="_blank">
      {{name}}
      <span class='titleMeta cut' v-if="!!isCut">[cut]</span>
      <span class='titleMeta part' v-if="!!part">Part {{part}}</span>
      <span class='titleMeta ep' v-else-if="!!ep">EP {{ep}}</span>
    </a>
    <div v-if="!noShell" class="meta">
      <div class="tag">{{tag}}</div>
      <div class="from"><span class='site'>【{{site}}】</span>{{up}}</div>
      <div class="members">{{memberStr}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import moment from 'moment'

const now = moment();


@Component({
  computed: {
    rdd() {
      return this.$store.state.rdd
    },
    memberStr() {
      let arr = this.$props.members.split('&')
      arr = arr.sort( () => {
        return Math.random() > 0.5 ? -1 : 1
      })
      let re = ''

      arr.forEach( (i: string) => {
        re += Vue.members[i]
      })
      return re
    },
    isNew() {
      return !this.$props.isRaw && now.diff(this.$props.bakedTime , 'hour') < 36
    }
  },
  methods: {
    record(url) {
      this.$record('跳转', this.$props.name, url, this.$props.sqlId)
    }
  }
})
export default class Poster extends Vue {
  @Prop() private sqlId!: string;

  @Prop() private mainUrl!: string;
  @Prop() private date!: string;
  @Prop() private name!: string;

  @Prop() private site!: string;
  @Prop() private up!: string;
  @Prop() private bakedTime!: string;

  @Prop() private ep!: number;
  @Prop() private part!: number;
  @Prop() private index!: number;

  @Prop() private tag!: string;
  @Prop() private members!: string;

  @Prop() private isRaw!: boolean;
  @Prop() private isCut!: boolean;

// setting
  @Prop() private noShell!: boolean;
  @Prop() private inClamp!: boolean;
}
</script>