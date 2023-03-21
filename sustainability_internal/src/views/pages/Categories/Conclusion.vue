<template>
  <PageBase>
    <div id="intro-page-one" class="module-page-container text-image-page">
      <div class="top-part">
        <E :h="json.e_title" t="h1" class="big-title" />
        <E :h="json.e_subtitle" t="h2" class="big-subtitle" />
      </div>
      <div class="text-image-container">
        <div class="left-side">
          <div class="text-container">
            <E :h="json.e_text" t="div" />
            <E :h="json.e_list" t="div" />
          </div>
          <div class="button large-button exit-button" @click="goHome">
            <E :h="json.e_homeButton" t="p" />
          </div>
        </div>
        <div class="right-side">
          <img
            class="menu-item-image"
            :src="
              require('@/assets/images/photos/photo-farmer-crops.jpg').default
            "
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

export default Vue.extend({
  name: "Menu",
  components: { PageBase, E },
  data() {
    return {}
  },
  methods: {
    goHome() {
      // this.$store.dispatch("meta/goToPage", { sectionIndex: 0, pageIndex: 0 })
      let { currSection } = this.$store.getters["meta/getSectionAndPageIndex"]
      this.$store.dispatch("meta/unlockSection", currSection + 1)
      this.$store.dispatch("meta/markSectionComplete", currSection)
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
    .left-side {
      width: 50%;
      padding: 1em;
      padding-top: 0em;
      // .text-container {
      //   margin-top: 5%;
      // }
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
