<template>
  <PageBase>
    <div id="intro-page-two" class="module-page-container text-image-page">
      <div class="left-side">
        <E :h="json.e_title" t="h1" class="big-title" />
        <E :h="json.e_subtitle" t="h2" class="big-subtitle" />
        <div class="text-container">
          <E :h="json.e_listtitle" t="h3" class="header" />
          <E :h="json.e_list" t="div" />
          <E :h="json.e_text" t="div" />
        </div>
        <!-- <div class="button large-button next-button" @click="completeAndGoHome">
          <E :h="json.e_continueButton" t="p" />
        </div> -->
        <div @click="completeAndGoHome" id="continue-container">
          <div class="button continue-button small-button">
            <strong>Next</strong>
          </div>
        </div>
      </div>
    </div>
  </PageBase>
</template>

<script lang="ts">
import Vue from "vue"
import PageBase from "@/components/PageBase.vue"

import E from "@/components/editable/E.vue"

export default Vue.extend({
  name: "Menu",
  components: { PageBase, E },
  data() {
    return {}
  },
  methods: {
    completeAndGoHome() {
      let { currSection } = this.$store.getters["meta/getSectionAndPageIndex"]
      this.$store.dispatch("meta/unlockSection", currSection + 1)
      this.$store.dispatch("meta/markSectionComplete", currSection)
      this.$store.dispatch("meta/goHome") // goes to the home of the current role
    },
    goToNextPage() {
      // unlock the next section
      this.$store.dispatch("meta/unlockLessonPart", {
        lesson: "whatsInScope",
        part: 1, // zero indexed remember
      })

      this.$store.dispatch("meta/goForward")
    },
  },
  props: ["json"],
})
</script>

<style scoped lang="scss">
.text-image-page {
  display: flex;
  .big-title {
    margin: 0.4em 0;
  }
  .left-side {
    // width: 100%;
    width: 85%;
    .text-container {
      margin-top: 3%;
      margin-bottom: 2.5%;
    }
  }
  // .right-side {
  //   width: 50%;
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  //   img {
  //     width: 90%;
  //   }
  // }
  #continue-container {
    z-index: 0;
    position: absolute;
    right: 5em;
    bottom: 4em;
  }
}
</style>
