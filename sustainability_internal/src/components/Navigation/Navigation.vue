<template>
  <div id="navContainer">
    <LeftNav
      :disabled="prevDisabled"
      :completelyHidden="prevHidden || isOnHiddenPage"
    />
    <RightNav
      :disabled="nextDisabled"
      :completelyHidden="nextHidden || isOnHiddenPage"
    />
  </div>
</template>

<script lang="ts">
import { NavStatus, Section } from "@/store/meta/types"
import Vue from "vue"
import LeftNav from "./LeftNav.vue"
import RightNav from "./RightNav.vue"

export default Vue.extend({
  name: "App",
  data() {
    return {}
  },
  components: { LeftNav, RightNav },
  computed: {
    isOnHiddenPage(): boolean {
      return this.$store.getters["meta/isOnHiddenPage"]
    },
    navStatus(): NavStatus {
      return this.$store.getters["meta/getNavStatus"]
    },
    prevDisabled(): boolean {
      if (this.navStatus.prevDisabled) {
        return true
      }

      return false
    },
    nextDisabled(): boolean {
      if (this.navStatus.nextDisabled) {
        return true
      }

      // if on last section, and last section is locked
      let arrayOfLockedSections: boolean[] =
        this.$store.getters["meta/getArrayOfLockedSections"]

      let { currSection, currPage } =
        this.$store.getters["meta/getSectionAndPageIndex"]

      let sections: Section[] = this.$store.getters["meta/getAllSections"]

      if (
        currSection === sections.length - 1 &&
        arrayOfLockedSections[currSection]
      ) {
        return true
      }

      return false
    },
    prevHidden(): boolean {
      if (this.navStatus.prevHidden) {
        return true
      }

      let { currSection, currPage } =
        this.$store.getters["meta/getSectionAndPageIndex"]

      if (currSection === 0 && currPage === 0) {
        return true
      }

      return false
    },
    nextHidden(): boolean {
      if (this.navStatus.nextHidden) {
        return true
      }

      // if on last section and page
      let { currSection, currPage } =
        this.$store.getters["meta/getSectionAndPageIndex"]

      let sections: Section[] = this.$store.getters["meta/getAllSections"]

      if (
        currSection === sections.length - 1 &&
        currPage === sections[currSection].pages.length - 1
      ) {
        return true
      }

      return false
    },
  },
})
</script>

<style scoped lang="scss">
#navContainer {
  position: absolute;
  bottom: 0px;
  width: 100%;
}
</style>
