<template>
  <PageBase>
    <div id="conversation-activity-page-one" class="module-page-container">
      <E :h="json.e_prompt" t="h2" class="small-text click-reveal-prompt" />

      <div id="click-area-wrapper">
        <div id="click-areas">
          <div
            class="click-area"
            v-for="(area, index) in areas"
            :key="area.id"
            :class="`click-area-${index}`"
          >
            <div class="click-area-bar-and-title-contaienr">
              <div class="click-area-title-container">
                <font-awesome-icon
                  icon="check"
                  :class="`visited-icon ${TEnter.FADE_IN}`"
                  v-if="areasSelected[index] === true"
                />
                <E :h="area.e_title" t="p" class="small-text" />
              </div>

              <div
                :class="`click-circle area-${index}`"
                @click="click(index)"
              ></div>
            </div>

            <div
              class="click-area-gray-bar-container"
              v-if="index < areas.length - 1"
            >
              <div :class="`click-area-gray-bar`" />
            </div>
          </div>
        </div>
      </div>

      <transition
        name="select-reveal-transition"
        :enter-active-class="TEnter.FADE_IN_UP"
        :leave-active-class="TExit.FADE_OUT_DOWN"
      >
        <template v-for="(area, i) in areas">
          <div class="popup" v-if="selectedNum === i" :key="area.id">
            <E :h="area.popup.e_popup_title" t="h2" class="big-title" />
            <E :h="area.popup.e_popup_subtitle" t="div" class="big-subtitle" />
            <div class="text-container">
              <E :h="area.popup.e_text" t="div" />
            </div>
          </div>
        </template>
      </transition>

      <transition
        :enter-active-class="`${TEnter.FADE_IN} one-sec-delay`"
        :leave-active-class="TExit.FADE_OUT"
      >
        <div
          @click="goToNextPage"
          id="continue-container"
          v-if="!areasSelected.some((area) => area === false)"
        >
          <div class="continue-button small-button button">
            <strong>Continue</strong>
          </div>
        </div>
      </transition>
    </div>
  </PageBase>
</template>

<script lang="ts">
import Vue from "vue"
import PageBase from "@/components/PageBase.vue"
import E from "@/components/editable/E.vue"
import { TEnter, TExit } from "@/types"

export default Vue.extend({
  name: "ConvoActivityPageOne",
  components: { PageBase, E },
  data() {
    return {
      selectedNum: -1,
      areasSelected: [] as boolean[],
      areas: this.json.areas,
      TEnter,
      TExit,
    }
  },
  methods: {
    click(index: number) {
      this.selectedNum = index
      this.areasSelected.splice(index, 1, true)
    },
    goToNextPage() {
      this.$store.dispatch("meta/goForward")
    },
  },
  mounted() {
    this.areasSelected = new Array(this.json.areas.length).fill(false)
  },
  props: ["json"],
})
</script>

<style scoped lang="scss">
#continue-container {
  z-index: 0;
  position: absolute;
  right: 2em;
  bottom: 1.2em;
}
#conversation-activity-page-one {
  .click-reveal-prompt {
    font-style: italic;
    margin-top: 0;
    margin-bottom: 1%;
    color: $darkBlue;
    text-align: center;
  }
  #click-area-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20%;
    #click-areas {
      display: flex;

      // align-items: center;
      justify-content: space-around;
      // width: 100%;
      width: 90%;
      margin: auto;

      .click-area-bar-and-title-contaienr {
        display: flex;
        flex-direction: column;
        align-items: center;

        .click-area-title-container {
          position: relative;
          display: flex;
          align-items: center;
          .visited-icon {
            position: absolute;
            left: -1.5em;
            color: $emerald;
          }
        }

        .click-circle {
          width: 80px;
          height: 80px;
          border-radius: 100%;
          cursor: pointer;
          opacity: 0.5;
          transition: $fast-transition;
          &:hover {
            opacity: 1;
          }
          &.area-0 {
            background: rgb(89, 75, 159);
          }
          &.area-1 {
            background: rgb(191, 31, 74);
          }
          &.area-2 {
            background: rgb(172, 129, 45);
          }
          &.area-3 {
            background: rgb(0, 78, 108);
          }
          &.area-4 {
            background: rgb(175, 120, 129);
          }
          &.area-5 {
            background: rgb(234, 176, 100);
          }
        }
      }
      .click-area {
        display: flex;
        align-items: center;
        flex-grow: 1;
        &.click-area-5 {
          flex-grow: 0;
        }
        .click-area-gray-bar-container {
          flex-grow: 1;
          .click-area-gray-bar {
            background: #ccc;
            height: 20px;
            margin: 10%;
            box-sizing: content-box;
            width: calc(100% - 20%);
            position: relative;
            top: 15px;
          }
        }
      }
    }
  }
  .popup {
    position: absolute;
  }
}
</style>
