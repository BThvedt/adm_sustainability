<template>
  <PageBase>
    <div
      id="final-lesson-conclusion"
      class="module-page-container text-image-page"
    >
      <div class="top-part">
        <E :h="json.e_title" t="h1" class="big-title" />
        <!-- <E :h="json.e_subtitle" t="h2" class="big-subtitle" /> -->
      </div>
      <div class="text-image-container">
        <div class="left-side">
          <div class="text-container">
            <E :h="json.e_text" t="div" />
          </div>
          <transition
            :enter-active-class="`${TEnter.FADE_IN}`"
            :leave-active-class="`${TExit.FADE_OUT}`"
          >
            <div
              class="button large-button exit-button"
              v-if="!exitClicked"
              @click="goHome"
            >
              <E :h="json.e_homeButton" t="p" />
            </div>
          </transition>
        </div>
        <div class="right-side">
          <img
            class="menu-item-image"
            :src="require('@/assets/images/photos/photo-adm-farm.jpg').default"
          />
        </div>
      </div>
    </div>
  </PageBase>
</template>

<script lang="ts">
import Vue from "vue"
import PageBase from "@/components/PageBase.vue"
import E from "@/components/editable/E.vue"
import { TEnter, TExit, TTimes } from "@/types"
import { genericAwait } from "@/lib/randomFunctions"

export default Vue.extend({
  name: "Menu",
  components: { PageBase, E },
  data() {
    return {
      exitClicked: false,
      TEnter,
      TExit,
      TTimes,
    }
  },
  methods: {
    async goHome() {
      this.exitClicked = true
      // this.$store.dispatch("meta/goToPage", { sectionIndex: 0, pageIndex: 0 })
      let { currSection } = this.$store.getters["meta/getSectionAndPageIndex"]
      // this.$store.dispatch("meta/unlockSection", currSection + 1)
      this.$store.dispatch("meta/markSectionComplete", currSection)
      // this.$store.dispatch("meta/goHome")

      // set the last visited page to the menu
      this.$store.dispatch("meta/setLastLocation", {
        sectionId: "Hx5Dxudy",
        pageId: "8U9NajQt",
      })

      this.$store.dispatch("meta/setModuleStatus", "passed")
      this.$store.dispatch("meta/setModuleRawScore", 100)

      this.$store.dispatch("meta/saveAndExitScorm")

      // some LMS's don't close window automatically
      window.close()

      // if we don't close the window right away .. lets just return to the menu
      await genericAwait(1000)
      this.$store.dispatch("meta/goHome")
    },
  },
  props: ["json"],
})
</script>

<style scoped lang="scss">
.text-image-page {
  .text-image-container {
    display: flex;
    ::v-deep .left-side {
      width: 50%;
      padding: 1em;
      padding-left: 0em;
      // .text-container {
      //   margin-top: 5%;
      // }
      p:first-of-type {
        margin-top: 0;
      }

      .exit-button {
        margin-top: 5%;
      }
    }
    .right-side {
      width: 50%;
      // align-items: center;
      // justify-content: center;
      padding: 1em;
      img {
        width: 90%;
        flex-grow: none;
      }
    }
  }
}
</style>
