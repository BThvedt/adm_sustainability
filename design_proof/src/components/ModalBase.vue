<template>
  <div @click="handleClick">
    <TransitionBase ref="bkgTransition" :initiallyShowing="false">
      <div id="modal-background" :class="size" />
    </TransitionBase>
    <TransitionBase :initiallyShowing="false" ref="modalTranisition">
      <div id="modal-container">
        <div id="modal-base" :class="size">
          <slot></slot>
        </div>
      </div>
    </TransitionBase>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
import TransitionBase from "./TransitionBase.vue"
import { TEnter, TExit, TDuration } from "@/types"
type size = "xs" | "small" | "med" | "large" | "xl"

export default Vue.extend({
  name: "ModalBase",
  data() {
    return {}
  },
  props: {
    size: String as PropType<size>,
    showing: Boolean,
  },
  methods: {
    handleClick() {
      this.$store.dispatch("meta/bodyClicked")
    },
    async show() {
      await Promise.all([
        (this.$refs["bkgTransition"] as any)?.show(
          TEnter.FADE_IN,
          TDuration.MEDIUM
        ),
        (this.$refs["modalTranisition"] as any)?.show(
          TEnter.FADE_IN_DOWN,
          TDuration.MEDIUM
        ),
      ])
      return new Promise<void>((resolve) => resolve())
    },
    async hide() {
      await Promise.all([
        (this.$refs["modalTranisition"] as any)?.hide(
          TExit.FADE_OUT_UP,
          TDuration.MEDIUM
        ),
        (this.$refs["bkgTransition"] as any)?.hide(
          TExit.FADE_OUT,
          TDuration.MEDIUM
        ),
      ])

      return new Promise<void>((resolve) => resolve())
    },
  },
  watch: {
    // a prop version.. in case you want a nonasync version seems legit
    showing(newShowingVal, oldVal): void {
      if (newShowingVal) {
        ;(this.$refs["bkgTransition"] as any)?.show(
          TEnter.FADE_IN,
          TDuration.MEDIUM
        )
        ;(this.$refs["modalTranisition"] as any)?.show(
          TEnter.FADE_IN_DOWN,
          TDuration.MEDIUM
        )
      } else {
        ;(this.$refs["bkgTransition"] as any)?.hide(
          TEnter.FADE_IN,
          TDuration.MEDIUM
        )
        ;(this.$refs["modalTranisition"] as any)?.hide(
          TExit.FADE_OUT_UP,
          TDuration.MEDIUM
        )
      }
    },
  },
  components: { TransitionBase },
})
</script>

<style scoped lang="scss">
#modal-background {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
}
#modal-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;

  #modal-base {
    width: 70%;
    background: white;
    outline: 1px solid black;

    position: relative;
    z-index: 999;
    box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    &.glossary {
      width: 97%;
      height: 95%;
      bottom: 0%;
    }
    &.xl {
      width: 90%;
      bottom: 3%;
    }
    &.large {
      width: 80%;
      bottom: 5%;
    }
    &.med {
      width: 60%;
      bottom: 5%;
    }
    &.small {
      width: 50%;
      bottom: 5%;
    }
    &.xs {
      width: 30%;
      bottom: 7%;
    }
  }
}
</style>
