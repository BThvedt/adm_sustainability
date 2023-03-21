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
          </div>
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

export default Vue.extend({
  name: "Menu",
  components: { PageBase, E },
  data() {
    return {}
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
      // .text-container {
      //   margin-top: 5%;
      // }
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
