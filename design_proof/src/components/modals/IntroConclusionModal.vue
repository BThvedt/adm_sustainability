<template>
  <ModalBase :size="'small'" ref="modalBase">
    <div id="intro-modal-inner">
      <E :h="title" v-if="title" t="h2" :class="'intro-modal-title'" />

      <E :h="text" v-if="text" t="div" />

      <div id="continue-container">
        <button id="continue-button" @click="closeModal">Continue</button>
      </div>
    </div>
  </ModalBase>
</template>

<script lang="ts">
import Vue from "vue"
import ModalBase from "@/components/ModalBase.vue"
import E from "@/components/editable/E.vue"

export default Vue.extend({
  name: "IntroConclusionModal",
  data() {
    return {}
  },

  methods: {
    async show() {
      await (this.$refs["modalBase"] as any)?.show()
    },
    async closeModal() {
      await (this.$refs["modalBase"] as any)?.hide()
      this.$emit("onClose")
    },
  },
  props: [
    "titleAndText",
    "modalSize",
    "specialClass",
    "title",
    "subTitle",
    "text",
  ],

  components: { ModalBase, E },
})
</script>

<style scoped lang="scss">
#intro-modal-inner {
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 2em 2em 1em 3em;
  ::v-deep .intro-modal-title {
    margin-top: 0;
  }
  #continue-container {
    margin: 1.5em 0em 1em 0em;
    display: flex;
    flex-direction: row;
    width: 100%;
  }
  #continue-button {
    cursor: pointer;
    padding: 0.5em 1em;
  }
}
</style>
