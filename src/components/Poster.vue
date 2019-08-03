<template>
  <div class="bar poster"
    :class="{ new:!!isNew, raw:!!isRaw, invalid: invalid ,inClamp: inClamp, noShellPoster: noShell}">
    <a class="title link" @click="record(mainUrl)" :href="mainUrl" target="_blank">
      <div class="coverBox">
        <img class='cover' src="../assets/bilibili_cover_sample.png" alt="cover sample of bilibili">
        <div class="mask">
          <div class="tag">{{tag}}</div>
        </div>
      </div>
      {{name}}
      <span class='titleMeta cut' v-if="!!isCut">[cut]</span>
      <span class='titleMeta part' v-if="!!part">Part {{part}}</span>
      <span class='titleMeta ep' v-else-if="!!ep">EP {{ep}}</span>
    </a>
    <div v-if="!noShell" class="meta">
      <div class="from">
        <span class='siteIcon'
          :class="{ [`siteIcon_${site}`]: true, [`siteIcon_${site}Raw`]: !!isRaw, [`siteIcon_${site}Invalid`]: invalid }"
          v-if="supportIconSites.includes(site)"></span>
        <span class='site' v-else>【{{site}}】</span>
        {{up}}
      </div>
      <div class="members">
        <template v-for="member in arrMembers">
          <div class="memberEmoji" :class="'memberEmoji_' + member" :key="`${sqlId}_${member}`"></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {
    Component,
    Prop,
    Vue
  } from 'vue-property-decorator';
  import moment from 'moment'

  const now = moment();


  @Component({
    computed: {
      rdd() {
        return this.$store.state.rdd
      },
      arrMembers() {
        const arr = this.$props.members.slice
        return this.$props.members.split('&')
      },
      isNew() {
        return !this.$props.isRaw && now.diff(this.$props.bakedTime, 'hour') < 36
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
    @Prop() private invalid!: boolean;

    // setting
    @Prop() private noShell!: boolean;
    @Prop() private inClamp!: boolean;

    private readonly supportIconSites: string[] = ['B站', '微博', 'Vlive', 'Youtube']
  }
</script>
<style lang="scss" scoped>
  .siteIcon {
    background-size: contain;
    display: inline-block;
    background-repeat: no-repeat;
    position: relative;
    width: 12px;
    height: 12px;
  }

  .siteIcon_B站 {
    background-image: url('../assets/bilibiliNml.png');
    top: 2px;
    left: 1px;
  }

  .siteIcon_B站Raw {
    background-image: url('../assets/bilibiliRaw.png');
  }

  .siteIcon_B站Invalid {
    background-image: url('../assets/bilibiliInvalid.png');
  }

  .siteIcon_微博 {
    background-image: url('../assets/weiboNml.png');
    top: 2px;
    left: 1px;
  }

  .siteIcon_微博Raw {
    background-image: url('../assets/weiboRaw.png');
  }

  .siteIcon_微博Invalid {
    background-image: url('../assets/weiboInvalid.png');
  }

  .siteIcon_Vlive {
    background-image: url('../assets/vliveNml.png');
    top: 2px;
    left: 1px;
  }

  .siteIcon_VliveRaw {
    background-image: url('../assets/vliveRaw.png');
  }

  .siteIcon_VliveInvalid {
    background-image: url('../assets/vliveInvalid.png');
  }

  .siteIcon_Youtube {
    background-image: url('../assets/youtubeNml.png');
    top: 4px;
    left: 1px;
  }

  .siteIcon_YoutubeRaw {
    background-image: url('../assets/youtubeRaw.png');
  }

  .siteIcon_YoutubeInvalid {
    background-image: url('../assets/youtubeInvalid.png');
  }
</style>