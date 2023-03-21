<template>
  <PageBase>
    <div id="intro-vid" class="module-page-container">
      <!-- <div id="instructions-wrapper">
        <transition
          :enter-active-class="`${TEnter.FADE_IN_RIGHT} `"
          :leave-active-class="TExit.FADE_OUT"
        >
          <E
            :h="json.e_instructions"
            t="h2"
            class="small-text italic-prompt"
            v-show="videoDone"
          />
        </transition>
      </div> -->
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
          <!-- <track
            :src="captionsSrc"
            label="English"
            kind="captions"
            srclang="en-us"
            default
          /> -->
          Your browser does not support the video tag.
        </video>
      </div>
      <!-- <transition
        :enter-active-class="`${TEnter.FADE_IN} one-sec-delay`"
        :leave-active-class="TExit.FADE_OUT"
      > -->
      <div
        class="button large-button video-button"
        :class="{ videoDone: videoDone }"
        @click="goToNextPage"
      >
        <E :h="json.e_continueButton" t="p" />
      </div>
      <!-- </transition> -->
    </div>
  </PageBase>
</template>

<script lang="ts">
import Vue from "vue"
import PageBase from "@/components/PageBase.vue"
import E from "@/components/editable/E.vue"
import { TEnter, TExit, TTimes } from "@/types"

export default Vue.extend({
  name: "Menu",
  components: { PageBase, E },
  data() {
    return {
      videoSrc: "videos/540p_intro_video.mp4",
      showVideo: false,
      // captionsSrc: "videos/placeholder_animation.vtt",
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

    goToNextPage() {
      // unlock the next section
      this.$store.dispatch("meta/unlockLessonPart", {
        lesson: "whatsInScope",
        part: 1, // zero indexed remember
      })

      this.$store.dispatch("meta/goForward")
    },
    videoTimeUpdate() {
      if (this.videoDuration) {
        if (
          (this.$refs.videoPlayer as any).currentTime / this.videoDuration! >
          0.98
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
#instructions-wrapper {
  min-height: 53px;
}
#intro-vid {
  display: flex;
  align-items: center;
  flex-direction: column;

  .video-button {
    margin-top: 3%;
    filter: grayscale(1);
    opacity: 0.2;
    pointer-events: none;
    cursor: not-allowed;
    transition: 1s all;
    &.videoDone {
      filter: none;
      opacity: 1;
      pointer-events: auto;
      cursor: pointer;
      box-shadow: $box-shadow;
    }
  }
  #video-wrapper {
    width: 70%;
    margin-top: 1em;
    video {
      display: block;
      margin-top: 1em;
      width: 100%;
    }
  }
}
.one-sec-delay {
  animation-delay: 1s;
}
</style>
