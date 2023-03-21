<template>
  <div id="blank-page">
    <p>Allowed paths are</p>
    <p v-for="path in allowedPaths" :key="path">
      {{ path }}
    </p>
  </div>
</template>

<script lang="ts">
import { Section } from "@/store/meta/types"
import Vue from "vue"
import router from "@/router"

export default Vue.extend({
  // watch store.allowed paths. Route to first page when available
  name: "BlankPageFOrRootPath",
  data() {
    return {}
  },
  watch: {
    allowedPaths(newPaths, oldPaths) {
      console.log("watching Llowed Paths")
      console.log(oldPaths)
      console.log(newPaths)
      if (newPaths.length) {
        router.push(newPaths[0])
      }
    },
  },
  computed: {
    allowedPaths(): string[] {
      console.log("COMPUTING ALLOWED PATHS")
      return this.$store.getters["meta/getAllowedRoutePaths"]
    },
  },
})
</script>

<style scoped lang="scss">
#blank-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
}
</style>
