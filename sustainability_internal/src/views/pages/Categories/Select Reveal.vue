<template>
  <PageBase>
    <div
      id="scope-3-select-reveal"
      class="module-page-container text-image-page"
    >
      <!-- <div class="top-part">
        <E :h="json.e_title" t="h1" class="big-title" />
        <E
          :h="json.e_subtitle"
          t="h2"
          class="header small-text activity-instructions"
        />
      </div> -->

      <div class="page-content">
        <div class="left-side">
          <E :h="json.e_title" t="h1" class="big-title" />
          <E :h="json.e_text" t="div" />
          <transition
            :enter-active-class="`${TEnter.FADE_IN_UP}`"
            :leave-active-class="`${TExit.FADE_OUT} ${TTimes.FAST}`"
            mode="out-in"
          >
            <template v-for="(category, index) in categories">
              <div
                class="reveal-text"
                :key="index"
                v-if="index == selectedIndex"
              >
                <E
                  :h="category.popup.e_title"
                  t="p"
                  class="category-header big-subtitle"
                />
                <E :h="category.popup.e_text" t="p" class="category-header" />
              </div>
            </template>
          </transition>
        </div>
        <div class="right-side">
          <E
            :h="json.e_subtitle"
            t="h2"
            class="header small-text activity-instructions italic-prompt"
          />
          <div class="button-container">
            <div
              class="category-button"
              @click="select(i)"
              :class="{ visited: selected[i] }"
              v-for="(category, i) in categories"
              :key="i"
            >
              <font-awesome-icon class="visited-check" icon="check" />
              <E :h="category.e_button_label" t="p" class="category-label" />
            </div>
          </div>
        </div>
      </div>

      <transition :enter-active-class="`${TEnter.FADE_IN_UP} one-sec-delay`">
        <div @click="goToNextPage" id="continue-container" v-if="showContinue">
          <div class="continue-button small-button button">
            <strong><E :h="json.e_nextButton" t="span" /></strong>
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
import { TEnter, TExit, TTimes } from "@/types"

export default Vue.extend({
  name: "Menu",
  components: { PageBase, E },
  data() {
    return {
      categories: this.json.categories,
      selectedIndex: -1,
      selected: [] as boolean[],
      showContinue: false,
      TEnter,
      TExit,
      TTimes,
    }
  },
  mounted() {
    this.categories.forEach(() => {
      this.selected.push(false)
    })
  },
  methods: {
    select(i: number) {
      this.selectedIndex = i
      this.selected.splice(i, 1, true)

      if (this.selected.every((entry) => entry)) {
        this.showContinue = true
      }
    },
    goToNextPage() {
      this.$store.dispatch("meta/goForward")
    },
  },
  props: ["json"],
})
</script>

<style scoped lang="scss">
#scope-3-select-reveal {
  padding: 2em 1em;
  padding-top: calc(#{$menuHeight} + #{$pagePadding});
  .top-part {
    .big-title {
      margin-top: 0;
      margin-bottom: 0;
      font-size: 32px !important;
    }
    .activity-instructions {
      font-style: italic;
    }
  }
  .page-content {
    display: flex;
    .left-side {
      width: 37%;
      padding-right: 2em;
      position: relative;
      .big-title {
        font-size: 32px;
      }
      .big-subtitle {
        font-weight: bold;
      }
      .reveal-text {
        position: absolute;
        padding-right: 2em;
      }
    }
    .right-side {
      width: 63%;
      box-sizing: border-box;
      position: relative;
      .activity-instructions {
        padding-left: 0.3em;
      }
      .button-container {
        display: flex;
        flex-wrap: wrap;
        cursor: pointer;
        .category-button {
          position: relative;
          width: 30%;
          font-size: 0.87em;
          border-radius: 20px 0 20px 20px;
          background: white;
          padding-left: 2em;
          padding-right: 1em;
          box-sizing: border-box;
          margin: 0.4em 1em 0.4em 0;
          transition: $very-fast-transition;
          border: 1px solid #6d6e71;
          color: $gray;
          &:hover {
            background: rgba(0, 0, 0, 0.05);
          }
          .visited-check {
            position: absolute;
            top: 0.65em;
            left: 0.6em;
            opacity: 0;
            transition: $fast-transition;
            color: $green;
          }
          &.visited {
            border-color: $green;
            .visited-check {
              opacity: 1;
            }
          }
        }
      }
    }
  }
}
</style>
