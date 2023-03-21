<template>
  <PageBase>
    <div id="intro-vid" class="module-page-container">
      <div id="video-wrapper">
        <video
          autoplay
          controls
          ref="videoPlayer"
          @loadedmetadata="setDuration"
          @timeupdate="videoTimeUpdate"
        >
          <source :src="videoSrc" type="video/mp4" />
          <source :src="videoSrc" type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      </div>
      <transition
        :enter-active-class="`${TEnter.FADE_IN} `"
        :leave-active-class="TExit.FADE_OUT"
      >
        <div
          class="button large-button"
          v-show="videoDone"
          @click="completeAndGoHome"
        >
          <E :h="json.e_continueButton" t="p" />
        </div>
      </transition>
    </div>
  </PageBase>
</template>

<script lang="ts">
import Vue from "vue"
import PageBase from "@/components/PageBase.vue"
import E from "@/components/editable/E.vue"
import { TEnter, TExit, TTimes } from "@/types"
// import { VideoPlayer } from "vue-video-player"
// import "video.js/dist/video-js.css"

export default Vue.extend({
  name: "Menu",
  components: { PageBase, E },
  data() {
    return {
      videoSrc: "videos/placeholder_animation.mp4",
      videoDuration: null,
      videoDone: false,
      TEnter,
      TExit,
    }
  },
  methods: {
    setDuration() {
      this.videoDuration = (this.$refs.videoPlayer as any).duration
    },
    completeAndGoHome() {
      let { currSection } = this.$store.getters["meta/getSectionAndPageIndex"]
      this.$store.dispatch("meta/unlockSection", currSection + 1)
      this.$store.dispatch("meta/markSectionComplete", currSection)
      this.$store.dispatch("meta/goHome") // goes to the home of the current role
    },
    videoTimeUpdate() {
      if (this.videoDuration) {
        if (
          (this.$refs.videoPlayer as any).currentTime / this.videoDuration! >
          0.95
        ) {
          this.videoDone = true
        }
      }
    },
  },
  props: ["json"],
})
</script>

<style scoped lang="scss">
#intro-vid {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  // width: 60%;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  .button {
    margin-top: 3%;
  }
  #video-wrapper {
    width: 70%;
    video {
      display: block;
      margin-top: 2em;
      width: 100%;
    }
  }
}
</style>
