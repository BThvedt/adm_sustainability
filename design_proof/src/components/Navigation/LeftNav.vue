<template>
  <transition
    name="nav-prev-transition"
    :enter-active-class="enterTransition"
    :leave-active-class="exitTransition"
  >
    <div
      id="nav-prev"
      :class="{ disabled }"
      @click="goBack"
      v-if="!completelyHidden"
    >
      <E :h="navText.e_back" t="p" />
    </div>
  </transition>
</template>

<script lang="ts">
import { SpecialPageStatus } from "@/store/meta/types"
import { TEnter, TExit, TTimes } from "@/types"
import E from "@/components/editable/E.vue"
import Vue from "vue"

export default Vue.extend({
  name: "LeftNav",
  data() {
    return {
      enterTransition: `${TEnter.FADE_IN} ${TTimes.MEDIUM}`,
      exitTransition: `${TExit.FADE_OUT} ${TTimes.MEDIUM}`,
    }
  },
  props: ["disabled", "completelyHidden"],
  methods: {
    goBack() {
      // this.$store.dispatch("meta/goBackward")

      if (!this.disabled && !this.completelyHidden) {
        // in the future, might have to take into account loading pages too
        switch (this.specialPageStatus) {
          case SpecialPageStatus.NONE:
            // if not on a locked page
            this.$store.dispatch("meta/goBackward")
            break
          case SpecialPageStatus.LOCKED:
            // section is locked
            this.$store.dispatch("meta/goToPrevSection")
            break
        }
      }
    },
  },
  computed: {
    specialPageStatus(): SpecialPageStatus {
      return this.$store.getters["meta/getSpecialPageStatus"]
    },
    navText(): string | undefined {
      const extraJson = this.$store.getters["meta/getExtraJson"]("extra")

      return extraJson ? extraJson.navText : undefined
    },
  },
  components: { E },
})
</script>

<style scoped lang="scss">
#nav-prev {
  background: #df8c6d;
  position: absolute;
  left: 30px;
  bottom: 30px;
  width: 70px;
  height: 45px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  box-shadow: $box-shadow;
  transition: $fast-transition;
  p {
    user-select: none;
  }
  &:hover {
    background: #ec4f16;
  }
  &.disabled {
    background: #b8a29c;
    opacity: 0.9;
    cursor: not-allowed;
    box-shadow: none;
    color: #ddd;
  }
}
</style>
