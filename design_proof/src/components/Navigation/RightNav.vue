<template>
  <transition
    name="nav-prev-transition"
    :enter-active-class="enterTransition"
    :leave-active-class="exitTransition"
  >
    <div
      id="nav-next"
      :class="{ disabled }"
      @click="goFoward"
      v-if="!completelyHidden"
    >
      <E :h="navText.e_forward" t="p" />
    </div>
  </transition>
</template>

<script lang="ts">
import { SpecialPageStatus } from "@/store/meta/types"
import { TEnter, TExit, TTimes } from "@/types"
import E from "@/components/editable/E.vue"
import Vue from "vue"

export default Vue.extend({
  name: "RightNav",
  data() {
    return {
      enterTransition: `${TEnter.FADE_IN} ${TTimes.MEDIUM}`,
      exitTransition: `${TExit.FADE_OUT} ${TTimes.MEDIUM}`,
    }
  },
  props: ["disabled", "completelyHidden"],
  methods: {
    goFoward() {
      if (!this.disabled) {
        // in the future, might have to take into account loading pages too
        switch (this.specialPageStatus) {
          case SpecialPageStatus.NONE:
            // if not on a locked page
            this.$store.dispatch("meta/goForward")
            break
          case SpecialPageStatus.LOCKED:
            // section is locked
            this.$store.dispatch("meta/goToNextSection")
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
#nav-next {
  background: #df8c6d;
  position: absolute;
  right: 30px;
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
  &:hover {
    background: #ec4f16;
  }
  p {
    user-select: none;
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
