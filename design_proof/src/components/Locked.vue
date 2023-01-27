<template>
  <div id="locked-page">
    <font-awesome-icon id="lock-icon" icon="lock" />
    <h1>{{ thisSection.name }}</h1>
    <h1>This Section Is Locked</h1>
  </div>
</template>

<script lang="ts">
import { Section } from "@/store/meta/types"
import Vue from "vue"
export default Vue.extend({
  name: "Lockecd",
  data() {
    return {}
  },
  computed: {
    thisSection(): Section {
      return this.$store.getters["meta/getCurrentSection"]
    },
  },
})
</script>

<style scoped lang="scss">
#locked-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  #lock-icon {
    font-size: 4em;
  }
}
</style>
