<template>
  <div>
    <transition
      name="modal-background-transition"
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <div id="modal-background" :class="size" v-if="modalShow" />
    </transition>
    <transition
      name="actual-modal-transition"
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div id="modal-container" v-if="modalShow">
        <div id="modal-base" :class="size">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"
type size = "small" | "med" | "large"

export default Vue.extend({
  name: "ModalBaseOld",
  data() {
    return {}
  },
  props: {
    size: String as PropType<size>,
    modalShow: Boolean,
  },
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
    height: 70%;
    background: white;
    outline: 1px solid black;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;
    z-index: 999;
    box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.2);
    &.large {
      width: 80%;
      height: 80%;
      bottom: 5%;
    }
    &.med {
      width: 60%;
      height: 60%;
      bottom: 5%;
    }
    &.small {
      width: 50%;
      height: 50%;
      bottom: 5%;
    }
  }
}
</style>
