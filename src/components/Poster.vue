<template>
  <div class="poster" :title='name' :class="{ new:!!isNew, raw:!!isRaw, invalid: invalid ,inClamp: inClamp, noShellPoster: noShell}">
    <a class="link" @click="record(mainUrl)" :href="mainUrl" target="_blank">
      <div class="coverBox">
        <img class='cover' v-if="cover !== ''"          :src="cover"                      :alt="name+'的封面'">
        <template v-else-if='canUseWebp'>
          <img class='cover' v-if='sampleSeed < .33'      src="../assets/coverSample1.webp" alt="示例封面1">
          <img class='cover' v-else-if='sampleSeed < .66' src="../assets/coverSample2.webp" alt="示例封面2">
          <img class='cover' v-else                       src="../assets/coverSample3.webp" alt="示例封面3">
        </template>
        <template v-else>
          <img class='cover' v-if='sampleSeed < .33'      src="../assets/coverSample1.jpg" alt="示例封面1">
          <img class='cover' v-else-if='sampleSeed < .66' src="../assets/coverSample2.jpg" alt="示例封面2">
          <img class='cover' v-else                       src="../assets/coverSample3.jpg" alt="示例封面3">
        </template>
        
        <div class="tag">{{tag}}</div>
        <div class="date">{{date}}</div>
        <div class="mask">
          <div class='sumTime'>{{durationStr}}</div>
        </div>
      </div>
      <div class="title">
        {{name}}
        <span class='titleMeta cut' v-if="!!isCut">[cut]</span>
        <span class='titleMeta part' v-if="!!part">Part {{part}}</span>
        <span class='titleMeta ep' v-else-if="!!ep">EP {{ep}}</span>
      </div>
      <div v-if="!noShell" class="meta">
        <div class="members">
          <template v-for="member in arrMembers">
            <div class="memberEmoji" :class="'memberEmoji_' + member" :key="`${sqlId}_${member}`"></div>
          </template>
        </div>
        <div class="from">
          <span class='siteIcon'
            :class="{ [`siteIcon_${site}`]: true, [`siteIcon_${site}Raw`]: !!isRaw, [`siteIcon_${site}Invalid`]: invalid }"
            v-if="supportIconSites.includes(site)"></span>
          <span class='site' v-else>【{{site}}】</span>
          {{up}}
        </div>
      </div>
    </a>
  </div>
</template>

<script lang="ts">
  import {
    Component,
    Prop,
    Vue
  } from 'vue-property-decorator';
  import moment from "moment"

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
    private sampleSeed: number = Math.random()
    private canUseWebp: boolean = Vue.canUseWebp
    private durationStr: string = ""

    @Prop() private sqlId!: string;

    @Prop() private mainUrl!: string;
    @Prop() private date!: string;
    @Prop() private name!: string;
    @Prop() private cover!: string;
    
    @Prop() private duration!: number;
    @Prop() private sumDuration!: number;

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
    @Prop() private isCollect!: boolean;
    @Prop() private invalid!: boolean;

    // setting
    @Prop() private noShell!: boolean;
    @Prop() private inClamp!: boolean;

    mounted(){
      const sec_num = this.isCollect ? this.sumDuration : this.duration
      let hours   = Math.floor(sec_num / 3600);
      let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      let seconds = sec_num - (hours * 3600) - (minutes * 60);

      let HH = (hours < 10   ? "0" : '') + hours
      let MM = (minutes < 10 ? "0" : '') + minutes
      let SS = (seconds < 10 ? "0" : '') + seconds

      this.durationStr = HH === "00" ?  `${MM}:${SS}` : `${HH}:${MM}:${SS}`
    }

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