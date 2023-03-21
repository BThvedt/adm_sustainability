<template>
  <transition
    name="transition-base-transition"
    :enter-active-class="enterActiveClass"
    :leave-active-class="leaveActiveClass"
    :style="{ animationDuration: `${time}ms` }"
  >
    <template v-if="showing">
      <slot></slot>
    </template>
  </transition>
</template>

<script lang="ts">
import { TEnter, TExit, TDuration, TTimes } from "@/types"
import Vue from "vue"

export default Vue.extend({
  // watch store.allowed paths. Route to first page when available
  name: "TransitionBase",
  data() {
    return {
      enterActiveClass: "",
      leaveActiveClass: "",
      time: 1000,
      showing: false,
    }
  },
  props: ["initiallyShowing"],
  mounted() {
    if (this.initiallyShowing) {
      this.showing = true
    }
  },
  methods: {
    show(transition: TEnter, time: TDuration) {
      let durationKey = TDuration[time] // not sure how to get around this without using 'any'

      // TDuration and TTimes have the same keys
      this.enterActiveClass = `${transition} ${
        TTimes[durationKey as keyof typeof TTimes]
      }`

      this.showing = true
      this.time = time

      // reminder.. "this" works in arrow functions
      return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, time)
      })
    },
    hide(transition: TExit, time: TDuration) {
      this.leaveActiveClass = transition

      // looks like there are times when it'll stop showing before it knows what leaveActiveClass is supposed to be
      // tsk tsk vue.. actually might be my own bad programming haha ANYWAY that's why I'm using $nextTick here
      this.time = time

      this.$nextTick(() => {
        this.showing = false
      })

      return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, time)
      })
    },
  },
})
</script>

<style scoped lang="scss"></style>
