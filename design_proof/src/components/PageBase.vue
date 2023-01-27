<template>
  <div id="page-container" @click="handleClick">
    <div v-if="specialPageStatus === SpecialPageStatus.NONE">
      <slot></slot>
    </div>
    <div v-if="specialPageStatus === SpecialPageStatus.LOCKED">
      <Locked />
    </div>
  </div>
</template>

<script lang="ts">
import { SpecialPageStatus } from "@/store/meta/types"
import Vue, { PropType } from "vue"
import Locked from "./Locked.vue"
type size = "small" | "med" | "large"

export default Vue.extend({
  data() {
    return {
      SpecialPageStatus,
    }
  },
  components: { Locked },
  props: {
    size: String as PropType<size>,
    modalShow: Boolean,
  },

  methods: {
    handleClick() {
      this.$store.dispatch("meta/closeMenu")
      this.$store.dispatch("meta/bodyClicked")
    },
  },
  computed: {
    specialPageStatus(): SpecialPageStatus {
      return this.$store.getters["meta/getSpecialPageStatus"]
    },
    // json(): any {
    //   console.log("JSON IS JSON IS JSON IS")
    //   console.log(this.$store.getters["json/getJson"])
    //   return this.$store.getters["json/getJson"]
    // },
  },
})
</script>

<style scoped lang="scss">
#page-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  #paragraph {
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
</style>
