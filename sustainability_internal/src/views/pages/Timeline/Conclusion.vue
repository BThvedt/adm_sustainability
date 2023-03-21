<template>
  <PageBase>
    <div id="conclusion-page-one" class="module-page-container text-image-page">
      <div class="left-side">
        <E :h="json.e_title" t="h1" class="big-title" />
        <E :h="json.e_subtitle" t="h2" class="big-subtitle" />
        <div class="text-container">
          <E :h="json.e_text" t="div" />
        </div>
      </div>
      <div class="right-side">
        <img
          class="menu-item-image"
          :src="require('@/assets/images/photos/photo-soil-sun.jpg').default"
        />
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
  mounted() {
    let { currSection } = this.$store.getters["meta/getSectionAndPageIndex"]
    // this.$store.dispatch("meta/unlockSection", currSection + 1)
    this.$store.dispatch("meta/markSectionComplete", currSection)
  },
  methods: {},
  props: ["json"],
})
</script>

<style scoped lang="scss">
.text-image-page {
  display: flex;
  .left-side {
    width: 50%;
    // .text-container {
    //   margin-bottom: 3%;
    // }
    h1 {
      margin-top: 0;
      margin-bottom: 0.3em;
    }
    .large-button {
      margin-top: 5%;
    }
  }
  .right-side {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 90%;
    }
  }
}
</style>
