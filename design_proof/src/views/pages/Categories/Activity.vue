<template>
  <PageBase>
    <div id="choose-categories" class="module-page-container">
      <E id="page-header" :h="json.e_prompt" t="h3" class="header" />
      <div id="choose-category-body">
        <div class="bar-graph-side">
          <!-- <img
            class="menu-item-image"
            :src="require('@/assets/images/sustainable-graphic.png').default"
          /> -->
          <div class="bar-graph">
            <E t="h3" :h="json.e_bar_graph_title" class="header" />
            <div
              v-for="category in categories"
              :key="category.id"
              class="category-info"
            >
              <E t="p" :h="category.title" class="bar-title" />
              <div class="bar-container">
                <transition
                  :enter-active-class="TEnter.SLIDE_IN_LEFT"
                  :leave-active-class="TEnter.FADE_OUT"
                >
                  <div
                    v-if="
                      (activeCategory > 1 && category.id === selectedIdOne) ||
                      (activeCategory === 1 &&
                        category.id === selectedIdOne &&
                        displayFeedback) ||
                      (activeCategory > 2 && category.id === selectedIdTwo) ||
                      (activeCategory === 2 &&
                        category.id === selectedIdTwo &&
                        displayFeedback) ||
                      (activeCategory > 3 && category.id === selectedIdThree) ||
                      (activeCategory === 3 &&
                        category.id === selectedIdThree &&
                        displayFeedback) ||
                      success === true ||
                      selectedCategoryNameList.includes(category.title)
                    "
                    class="bar-bar"
                    :class="`${category.correct ? 'correct' : 'incorrect'}`"
                    :style="{
                      width: `${(category.score / 16).toFixed(2) * 100}%`,
                    }"
                  />
                  <!-- <div
                    v-if="
                      (activeCategory > 1 && category.id === selectedIdOne) ||
                      (activeCategory === 1 &&
                        category.id === selectedIdOne &&
                        displayFeedback) ||
                      (activeCategory > 2 && category.id === selectedIdTwo) ||
                      (activeCategory === 2 &&
                        category.id === selectedIdTwo &&
                        displayFeedback) ||
                      (activeCategory > 3 && category.id === selectedIdThree) ||
                      (activeCategory === 3 &&
                        category.id === selectedIdThree &&
                        displayFeedback) ||
                      success !== null
                    "
                    class="bar-bar"
                    :class="`${category.correct ? 'correct' : 'incorrect'}`"
                    :style="{
                      width: `${(category.score / 16).toFixed(2) * 100}%`,
                    }"
                  /> -->
                </transition>
              </div>
            </div>
          </div>
        </div>
        <div class="selector-side">
          <div id="categories-container">
            <div class="category-wrapper">
              <div class="header-wrapper">
                <E
                  id="page-header"
                  :h="json.category_text.e_cat_1"
                  t="p"
                  :class="`header ${TAttnSeek.BOUNCE}`"
                  v-if="activeCategory === 1 && !displayFeedback"
                />
              </div>
              <div class="category-selector">
                <scroll-picker
                  v-if="activeCategory === 1 && !displayFeedback"
                  :options="selectorCategories"
                  v-model="selectedIdOne"
                  placeholder="Make Selection"
                />
                <div
                  v-else-if="
                    correctResults[0] !== undefined &&
                    correctResults[0] !== null
                  "
                  class="selected-category-display"
                >
                  <img
                    class="selected-category-display-image"
                    :src="
                      require(`@/assets/images/${categoryOne.image}`).default
                    "
                  />
                  <h4 />
                  <E
                    class="selected-category-name header"
                    :h="categoryOne.title"
                    t="h4"
                  />
                </div>
                <transition :enter-active-class="TEnter.FADE_IN_UP">
                  <div
                    class="ok-button"
                    v-if="
                      activeCategory === 1 &&
                      !displayFeedback &&
                      showChooseButton()
                    "
                    @click="choose"
                  >
                    <E t="p" :h="json.e_ok_button" class="header" />
                  </div>
                </transition>
              </div>
              <div class="feedback-icon-wrapper">
                <font-awesome-icon
                  icon="check"
                  :class="`feedback-icon correct ${TAttnSeek.TADA}`"
                  v-if="correctResults[0] === true"
                />
                <font-awesome-icon
                  icon="times"
                  :class="`feedback-icon incorrect  ${TEnter.FADE_IN}`"
                  v-if="correctResults[0] === false"
                />
              </div>
            </div>
            <div class="category-wrapper">
              <div class="header-wrapper">
                <E
                  id="page-header"
                  :h="json.category_text.e_cat_2"
                  t="p"
                  :class="`header ${TAttnSeek.BOUNCE}`"
                  v-if="activeCategory === 2 && !displayFeedback"
                />
              </div>
              <div class="category-selector">
                <scroll-picker
                  v-if="activeCategory === 2 && !displayFeedback"
                  :options="selectorCategories"
                  v-model="selectedIdTwo"
                  placeholder="Make Selection"
                />
                <div
                  v-else-if="
                    correctResults[1] !== undefined &&
                    correctResults[1] !== null
                  "
                  class="selected-category-display"
                >
                  <img
                    class="selected-category-display-image"
                    :src="
                      require(`@/assets/images/${categoryTwo.image}`).default
                    "
                  />
                  <h4 />
                  <E
                    class="selected-category-name header"
                    :h="categoryTwo.title"
                    t="h4"
                  />
                </div>
                <transition :enter-active-class="TEnter.FADE_IN_UP">
                  <div
                    class="ok-button"
                    v-if="
                      activeCategory === 2 &&
                      !displayFeedback &&
                      showChooseButton()
                    "
                    @click="choose"
                  >
                    <E t="p" :h="json.e_ok_button" class="header" />
                  </div>
                </transition>
              </div>
              <div class="feedback-icon-wrapper">
                <font-awesome-icon
                  icon="check"
                  :class="`feedback-icon correct ${TAttnSeek.TADA}`"
                  v-if="correctResults[1] === true"
                />
                <font-awesome-icon
                  icon="times"
                  :class="`feedback-icon incorrect  ${TEnter.FADE_IN}`"
                  v-if="correctResults[1] === false"
                />
              </div>
            </div>
            <div class="category-wrapper">
              <div class="header-wrapper">
                <E
                  id="page-header"
                  :h="json.category_text.e_cat_3"
                  t="p"
                  :class="`header ${TAttnSeek.BOUNCE}`"
                  v-if="activeCategory === 3 && !displayFeedback"
                />
              </div>
              <div class="category-selector">
                <scroll-picker
                  v-if="activeCategory === 3 && !displayFeedback"
                  :options="selectorCategories"
                  v-model="selectedIdThree"
                  placeholder="Make Selection"
                />
                <div
                  v-else-if="
                    correctResults[2] !== undefined &&
                    correctResults[2] !== null
                  "
                  class="selected-category-display"
                >
                  <img
                    class="selected-category-display-image"
                    :src="
                      require(`@/assets/images/${categoryThree.image}`).default
                    "
                  />
                  <h4 />
                  <E
                    class="selected-category-name header"
                    :h="categoryThree.title"
                    t="h4"
                  />
                </div>
                <transition :enter-active-class="TEnter.FADE_IN_UP">
                  <div
                    class="ok-button"
                    v-if="
                      activeCategory === 3 &&
                      !displayFeedback &&
                      showChooseButton()
                    "
                    @click="choose"
                  >
                    <E t="p" :h="json.e_ok_button" class="header" />
                  </div>
                </transition>
              </div>
              <div class="feedback-icon-wrapper">
                <font-awesome-icon
                  icon="check"
                  :class="`feedback-icon correct ${TAttnSeek.TADA}`"
                  v-if="correctResults[2] === true"
                />
                <font-awesome-icon
                  icon="times"
                  :class="`feedback-icon incorrect  ${TEnter.FADE_IN}`"
                  v-if="correctResults[2] === false"
                />
              </div>
            </div>
          </div>
          <div id="feedback-container">
            <transition
              :enter-active-class="TEnter.FADE_IN"
              :leave-active-class="`${TExit.FADE_OUT}`"
              mode="out-in"
            >
              <div
                class="category-feedback"
                v-if="displayFeedback !== true && success === null"
                key="a"
              >
                <E
                  t="h3"
                  :h="json.e_feedbackText"
                  class="header"
                  v-if="showChooseButton()"
                />
                <E
                  t="p"
                  v-if="activeCategory === 1 && categoryOne.e_feedback"
                  :h="categoryOne.e_feedback"
                  class="feedback-text"
                  :key="categoryOne.id"
                />
                <E
                  t="p"
                  v-if="activeCategory === 2 && categoryTwo.e_feedback"
                  :h="categoryTwo.e_feedback"
                  class="feedback-text"
                  :key="categoryTwo.id"
                />
                <E
                  t="p"
                  v-if="activeCategory === 3 && categoryThree.e_feedback"
                  :h="categoryThree.e_feedback"
                  class="feedback-text"
                  :key="categoryThree.id"
                />
              </div>
              <div
                class="category-feedback"
                v-else-if="displayFeedback === true && success === null"
                key="b"
              >
                <E
                  t="h3"
                  :h="categoryOne.e_selected_title"
                  class="header"
                  v-if="activeCategory === 1 && categoryOne.e_selected_title"
                />
                <E
                  t="h3"
                  :h="categoryTwo.e_selected_title"
                  class="header"
                  v-if="activeCategory === 2 && categoryTwo.e_selected_title"
                />
                <E
                  t="h3"
                  :h="categoryThree.e_selected_title"
                  class="header"
                  v-if="activeCategory === 3 && categoryThree.e_selected_title"
                />
                <E
                  t="p"
                  v-if="activeCategory === 1 && categoryOne.e_selected_feedback"
                  :h="categoryOne.e_selected_feedback"
                  class="feedback-text"
                  :key="categoryOne.id"
                />
                <E
                  t="p"
                  v-if="activeCategory === 2 && categoryTwo.e_selected_feedback"
                  :h="categoryTwo.e_selected_feedback"
                  class="feedback-text"
                  :key="categoryTwo.id"
                />
                <E
                  t="p"
                  v-if="
                    activeCategory === 3 && categoryThree.e_selected_feedback
                  "
                  :h="categoryThree.e_selected_feedback"
                  class="feedback-text"
                  :key="categoryThree.id"
                />
                <transition
                  :enter-active-class="TEnter.FADE_IN_UP"
                  :leave-active-class="`${TExit.FADE_OUT} ${TTimes.VERY_FAST}`"
                >
                  <div @click="proceedToNextChoice" id="continue-container">
                    <div class="button continue-button small-button">
                      <strong>Continue</strong>
                    </div>
                  </div>
                </transition>
              </div>
              <div
                class="category-feedback"
                v-else-if="success !== null"
                key="c"
              >
                <E
                  t="h3"
                  :h="json.finalFeedback.correct.e_title"
                  class="header"
                  v-if="success"
                />
                <E
                  t="p"
                  v-if="success"
                  :h="json.finalFeedback.correct.e_text"
                  class="feedback-text"
                  :key="categoryOne.id"
                />
                <E
                  t="h3"
                  :h="json.finalFeedback.missedThree.e_title"
                  class="header"
                  v-if="
                    !success &&
                    correctResults.filter((result) => result).length === 0
                  "
                />
                <E
                  t="p"
                  v-if="
                    !success &&
                    correctResults.filter((result) => result).length === 0
                  "
                  :h="json.finalFeedback.missedThree.e_text"
                  class="feedback-text"
                  :key="categoryOne.id"
                />
                <E
                  t="h3"
                  :h="json.finalFeedback.missedTwo.e_title"
                  class="header"
                  v-if="
                    !success &&
                    correctResults.filter((result) => result).length === 1
                  "
                />
                <E
                  t="p"
                  v-if="
                    !success &&
                    correctResults.filter((result) => result).length === 1
                  "
                  :h="json.finalFeedback.missedTwo.e_text"
                  class="feedback-text"
                  :key="categoryOne.id"
                />
                <E
                  t="h3"
                  :h="json.finalFeedback.missedOne.e_title"
                  class="header"
                  v-if="
                    !success &&
                    correctResults.filter((result) => result).length === 2
                  "
                />
                <E
                  t="p"
                  v-if="
                    !success &&
                    correctResults.filter((result) => result).length === 2
                  "
                  :h="json.finalFeedback.missedOne.e_text"
                  class="feedback-text"
                  :key="categoryOne.id"
                />
                <transition
                  :enter-active-class="TEnter.FADE_IN_UP"
                  :leave-active-class="`${TExit.FADE_OUT} ${TTimes.VERY_FAST}`"
                >
                  <div @click="finishOrReset" id="continue-container">
                    <div class="button continue-button small-button">
                      <strong>
                        <E
                          t="span"
                          :h="json.finalFeedback.correct.e_button"
                          v-if="success"
                        />
                        <E
                          t="span"
                          :h="json.finalFeedback.missedThree.e_button"
                          v-if="
                            !success &&
                            correctResults.filter((result) => result).length ===
                              0
                          "
                        />
                        <E
                          t="span"
                          :h="json.finalFeedback.missedTwo.e_button"
                          v-if="
                            !success &&
                            correctResults.filter((result) => result).length ===
                              1
                          "
                        />
                        <E
                          t="span"
                          :h="json.finalFeedback.missedOne.e_button"
                          v-if="
                            !success &&
                            correctResults.filter((result) => result).length ===
                              2
                          "
                        />
                      </strong>
                    </div>
                  </div>
                </transition>
              </div>
            </transition>
            <div id="the-meters-container">
              <div id="sustainability-meter-wrapper" class="meter-wrapper">
                <div
                  class="meter-bar meter-background"
                  id="sustainability-meter-background"
                >
                  <E :h="json.meterText.e_sustainable" t="h3" />
                </div>
                <div
                  class="meter-bar meter-foreground"
                  id="sustainability-meter-foreground"
                  :style="{
                    width: `${
                      (sustainability / SUSTAINABILITY_METER_MAX).toFixed(2) *
                      100 *
                      zeroOrOne()
                    }%`,
                  }"
                >
                  <E :h="json.meterText.e_sustainable" t="h3" />
                </div>
              </div>
              <div id="adm-meter-wrapper" class="meter-wrapper">
                <div
                  class="meter-bar meter-background"
                  id="adm-meter-background"
                >
                  <E :h="json.meterText.e_leverage" t="h3" />
                </div>
                <div
                  class="meter-bar meter-foreground"
                  id="adm-meter-foreground"
                  :style="{
                    width: `${
                      (adm / ADM_METER_MAX).toFixed(2) * 100 * zeroOrOne()
                    }%`,
                  }"
                >
                  <E :h="json.meterText.e_leverage" t="h3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageBase>
</template>

<script lang="ts">
import Vue from "vue"
import PageBase from "@/components/PageBase.vue"
import E from "@/components/editable/E.vue"
import { ScrollPicker, ScrollPickerGroup } from "vue-scroll-picker"
import { TEnter, TExit, TTimes, TAttnSeek } from "@/types"

const SUSTAINABILITY_METER_MAX = 16
const ADM_METER_MAX = 4

// compares sorted simple arrays. They have to be sorted!
function array_compare(
  arr1: Array<number | string>,
  arr2: Array<number | string>
) {
  if (arr1.length !== arr2.length) {
    return false
  }

  let theSame = true

  for (let x = 0; x < arr1.length; x++) {
    if (arr1[x] !== arr2[x]) {
      theSame = false
    }
  }

  return theSame
}

function removeCategory(categoryId: number, arrayOfCategories: Array<any>) {
  var index = arrayOfCategories.findIndex((category) => {
    return category.value === categoryId
  })

  if (index != -1) {
    arrayOfCategories.splice(index, 1)
  }
}

export default Vue.extend({
  name: "Menu",
  components: { PageBase, E, ScrollPicker },
  data() {
    return {
      sustainability: 0, // 0-10
      adm: 0, //0-30
      categories: this.json.categories,
      selectorCategories: [] as Array<any>,

      selectedIdOne: 0,
      selectedIdTwo: 0,
      selectedIdThree: 0,

      categoryOne: {},
      categoryTwo: {},
      categoryThree: {},

      activeCategory: 1,

      TEnter,
      TExit,
      TTimes,
      TAttnSeek,

      SUSTAINABILITY_METER_MAX,
      ADM_METER_MAX,

      displayFeedback: false,
      correctResults: [] as (boolean | null)[],
      success: null as boolean | null,

      selectedCategoryNameList: [] as string[],
    }
  },
  mounted() {
    this.selectorCategories = this.json.categories.map((category: any) => {
      return { name: category.title, value: category.id }
    })
  },
  methods: {
    zeroOrOne() {
      let returnVal = 0
      switch (this.activeCategory) {
        case 1:
          if (
            this.correctResults[0] !== undefined &&
            this.correctResults[0] !== null
          ) {
            returnVal = 1
          }
          break
        case 2:
          if (
            this.correctResults[1] !== undefined &&
            this.correctResults[1] !== null
          ) {
            returnVal = 1
          }
          break
        case 3:
          if (
            this.correctResults[2] !== undefined &&
            this.correctResults[2] !== null
          ) {
            returnVal = 1
          }
          break
      }

      return returnVal
    },
    finishOrReset() {
      if (!this.success) {
        this.correctResults = this.correctResults.map((result) => {
          return result ? result : null
        })

        this.categoryOne = this.correctResults[0] ? this.categoryOne : {}
        this.categoryTwo = this.correctResults[1] ? this.categoryTwo : {}
        this.categoryThree = this.correctResults[2] ? this.categoryThree : {}

        this.selectedIdOne = this.correctResults[0] ? this.selectedIdOne : 0
        this.selectedIdTwo = this.correctResults[1] ? this.selectedIdTwo : 0
        this.selectedIdThree = this.correctResults[2] ? this.selectedIdThree : 0

        // set activeCategory to whatever the first non correct result
        this.activeCategory =
          this.correctResults.findIndex((result) => !result) + 1

        this.sustainability = 0
        this.adm = 0

        this.selectorCategories = this.json.categories.map((category: any) => {
          return { name: category.title, value: category.id }
        })

        if (this.selectedIdOne) {
          removeCategory(this.selectedIdOne, this.selectorCategories)
        }

        if (this.selectedIdTwo) {
          removeCategory(this.selectedIdTwo, this.selectorCategories)
        }

        if (this.selectedIdThree) {
          removeCategory(this.selectedIdThree, this.selectorCategories)
        }

        this.success = null
      } else {
        this.$store.dispatch("meta/goForward")
      }
    },
    choose() {
      this.displayFeedback = true
      let chosenCategoryName = ""
      switch (this.activeCategory) {
        case 1:
          this.correctResults[0] = (this.categoryOne as any).correct
          chosenCategoryName = (this.categoryOne as any).title
          break
        case 2:
          this.correctResults[1] = (this.categoryTwo as any).correct
          chosenCategoryName = (this.categoryTwo as any).title
          break
        case 3:
          this.correctResults[2] = (this.categoryThree as any).correct
          chosenCategoryName = (this.categoryThree as any).title
          break
      }

      if (!this.selectedCategoryNameList.includes(chosenCategoryName)) {
        this.selectedCategoryNameList.push(chosenCategoryName)
      }
    },
    proceedToNextChoice() {
      // this got more complicated since we're keeping the correct choices
      let weAreDone = false
      switch (this.activeCategory) {
        case 1:
          // check the correct results for the next one
          if (!this.correctResults[1]) {
            this.activeCategory++
          } else if (!this.correctResults[2]) {
            this.activeCategory = 3
          } else {
            this.activeCategory = 4
            weAreDone = true
          }
          break
        case 2:
          if (!this.correctResults[2]) {
            this.activeCategory = 3
          } else {
            this.activeCategory = 4
            weAreDone = true
          }
          break
        case 3:
          this.activeCategory = 4 // weird logic I know
          weAreDone = true
          break
      }

      // this.activeCategory++

      this.displayFeedback = false
      if (weAreDone) {
        let newArray = [
          this.selectedIdOne,
          this.selectedIdTwo,
          this.selectedIdThree,
        ]
        if (
          //array_compare(newArray.sort(), this.json.correct_categories.sort())
          this.correctResults.length === 3 &&
          this.correctResults.every((result) => result)
        ) {
          this.success = true
        } else {
          this.success = false
        }
      } else {
        // remove the chosen category from the selectorCateories
        // kind of confusing because it's already incremented at this point
        switch (this.activeCategory) {
          case 2:
            removeCategory(this.selectedIdOne, this.selectorCategories)
            break
          case 3:
            removeCategory(this.selectedIdOne, this.selectorCategories)
            removeCategory(this.selectedIdTwo, this.selectorCategories)
            break
        }
      }
    },
    showChooseButton() {
      switch (this.activeCategory) {
        case 1:
          if (this.selectedIdOne > 0) {
            return true
          }
          break
        case 2:
          if (this.selectedIdTwo > 0) {
            return true
          }
          break
        case 3:
          if (this.selectedIdThree > 0) {
            return true
          }
          break
      }

      return false
    },
  },
  watch: {
    selectedIdOne(nv, ov) {
      this.categoryOne = (this.categories.find(
        (category: any) => category.id === nv
      ) || {}) as any

      if ((this.categoryOne as any).sustainability) {
        this.sustainability = (this.categoryOne as any).sustainability
      } else {
        this.sustainability = 0
      }

      if ((this.categoryOne as any).leverage) {
        this.adm = (this.categoryOne as any).leverage
      }

      this.$forceUpdate()
    },
    selectedIdTwo(nv, ov) {
      this.categoryTwo =
        this.categories.find((category: any) => category.id === nv) || {}

      if ((this.categoryTwo as any).sustainability) {
        this.sustainability = (this.categoryTwo as any).sustainability
      } else {
        this.sustainability = 0
      }

      if ((this.categoryTwo as any).leverage) {
        this.adm = (this.categoryTwo as any).leverage
      }

      this.$forceUpdate()
    },
    selectedIdThree(nv, ov) {
      this.categoryThree =
        this.categories.find((category: any) => category.id === nv) || {}

      if ((this.categoryThree as any).sustainability) {
        this.sustainability = (this.categoryThree as any).sustainability
      } else {
        this.sustainability = 0
      }

      if ((this.categoryThree as any).leverage) {
        this.adm = (this.categoryThree as any).leverage
      }

      this.$forceUpdate()
    },
  },
  props: ["json"],
})
</script>

<style scoped lang="scss">
#choose-categories {
  display: flex;
  flex-direction: column;
  #page-header {
    font-weight: normal;
    font-style: italic;
    text-align: center;
    margin: 0;
    padding: 0;
    margin-bottom: 1%;
  }
  #choose-category-body {
    display: flex;
    height: 100%;

    .selector-side {
      display: flex;
      flex-direction: column;
      width: 60%;
      height: 100%;

      #categories-container {
        height: 11.8em;
        margin-bottom: 10%;
        .header-wrapper {
          height: 1.5em;
        }
        .category-selector {
          height: 9.8em;
        }
        .selected-category-display {
          img {
            width: 80%;
            margin-left: 10%;
            margin-top: 5%;
            max-height: 100px;
          }
          .selected-category-name {
            margin: 0;
            padding: 0;
            text-align: center;
            position: relative;
            bottom: 1em;
            line-height: 1em;
          }
        }
        ::v-deep .ok-button {
          height: 1.8em;
          color: $darkBlue;
          cursor: pointer;
          border-top: 1px solid $gray;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          p {
            margin: 0;
            padding: 0;
            position: relative;
            bottom: 1px;
          }
          &:hover {
            p {
              color: $buttonHover;
            }
          }
        }
      }
      #feedback-container {
        height: 60%;
        box-shadow: $box-shadow;
        background: white;
        position: relative;
        padding: 1em;
        box-sizing: border-box;
        margin-top: 0.5em;
        overflow: hidden;

        .category-feedback {
          position: absolute;
          width: calc(100% - 1em);
          height: calc(100% - 1em);
        }
        .header {
          margin-top: 0.1em;
        }
        .feedback-text {
          color: $gray;
        }

        #the-meters-container {
          position: absolute;
          bottom: 0.8em;
          width: 55%;
          #sustainability-meter-wrapper,
          #adm-meter-wrapper {
            width: 100%;
            height: 25px;
            border-radius: 12.5px;
            margin: 0.6em 0.5em 0.5em 0.5em;
            box-sizing: content-box;
            position: relative;
            overflow: hidden;
            border: 1px $gray;

            .meter-bar {
              display: flex;
              align-items: center;
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              font-weight: normal;
              font-family: $cali;
              h3 {
                position: absolute;
                // min-width: 200px;
                left: 2em;
                font-family: $cali;
                font-size: 1em;
              }
            }
            .meter-background {
              background: #cdcdcd;
            }
            .meter-foreground {
              color: white;
              overflow: hidden;
              background: $green;
              border-radius: 33px;
              h3 {
                min-width: 200px;
              }
            }
            #adm-meter-foreground {
              background: $blue;
              transition: 0.3s all;
            }
            #sustainability-meter-foreground {
              background: $blue;
              transition: 0.3s all;
            }
          }
        }
      }
      ::v-deep #categories-container {
        margin-bottom: 3.5%;
        display: flex;
        justify-content: space-between;
        .category-wrapper {
          width: 30%;
          .category-selector {
            // width: 30%;
            background: white;
            box-shadow: $box-shadow;
            overflow: hidden;
            .vue-scroll-picker {
              height: 8em;

              .vue-scroll-picker-item {
                height: 2em;
                padding-top: 0.25em;
                box-sizing: border-box;
                line-height: 0.9em;
                font-size: 0.9em;
              }
              .top {
                height: calc(50% - 2em);
              }
              .middle {
                height: 2.25em;
                background: rgba(0, 0, 0, 0.1);
                top: calc(50% - 2em);
                left: 0;
                right: 0;
                bottom: calc(50% - 0.25em);
              }
              .bottom {
                height: calc(50% - 0.25em);
              }
            }
          }
        }
        .feedback-icon-wrapper {
          color: white;

          display: flex;

          align-items: center;
          justify-content: center;

          .feedback-icon {
            width: 25px;
            height: 25px;
            font-size: 1em;
            position: absolute;
            border-radius: 100%;
            box-shadow: $box-shadow;
            &.correct {
              background: $green;
              border: 5px solid $green;
            }
            &.incorrect {
              background: $red;
              border: 5px solid $red;
            }
          }
        }
      }
    }
    .bar-graph-side {
      width: 40%;
      display: flex;
      align-items: center;
      // justify-content: center;
      flex-direction: column;
      // #DBE2E6
      padding: 1.5em 2em 0em 0em;
      ::v-deep .bar-graph {
        height: 100%;
        background: white;
        box-shadow: $box-shadow;
        width: 400px;
        height: 490px;
        .header {
          text-align: center;
          color: $darkBlue;
          margin: 0;
          padding: 0;
          margin-top: 0.75em;
          margin-bottom: 0.25em;
        }
        .category-info {
          display: flex;
          align-items: center;
          margin: 1.5% 0%;
          .bar-title {
            color: $gray;
            width: 60%;
            padding-right: 0.7em;
            margin: 0;
            font-size: 0.95em;
            text-align: right;
          }
          .bar-container {
            overflow: hidden;
            width: 30%;
            height: 22px;
            display: flex;
            align-items: center;
            .bar-bar {
              height: 15px;
              box-shadow: $box-shadow;
              &.correct {
                background: $green;
              }
              &.incorrect {
                background: $red;
              }
            }
          }
        }
      }
    }
  }
}
</style>
