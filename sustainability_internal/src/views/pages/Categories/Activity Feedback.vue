<template>
  <PageBase>
    <div id="activity-feedback" class="module-page-container text-image-page">
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
              <div
                class="bar-bar"
                :class="`${category.correct ? 'correct' : 'incorrect'}`"
                :style="{
                  width: `${(category.score / 16).toFixed(2) * 100}%`,
                }"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="text-side">
        <E :h="json.e_title" t="h1" class="big-title" />
        <E
          :h="feedBackSubtitle"
          t="h2"
          class="big-subtitle"
          :key="feedBackSubtitle"
        />
        <ul
          class="feedback-list"
          v-if="feedbackTextList && feedbackTextList.length"
        >
          <li v-for="(item, i) in feedbackTextList" :key="i">
            <E t="span" :h="feedbackTextList[i]" />
          </li>
        </ul>
      </div>
      <div @click="goToNextPage" id="continue-container">
        <div class="continue-button small-button button">
          <strong><E :h="json.e_nextButton" t="span" /></strong>
        </div>
      </div>
    </div>
  </PageBase>
</template>

<script lang="ts">
import Vue from "vue"
import PageBase from "@/components/PageBase.vue"
import E from "@/components/editable/E.vue"

export default Vue.extend({
  name: "Menu",
  components: { PageBase, E },
  data() {
    return {
      categories: this.json.categories,
      chosenIds: [] as number[],
      feedbackTextList: [] as string[],
      feedBackSubtitle: "",
    }
  },
  mounted() {
    this.chosenIds = this.$store.getters["meta/getLesson3ChosenIds"]

    if (!this.chosenIds.length) {
      return []
    }

    if (!this.chosenIds.includes(1)) {
      this.feedbackTextList.push(this.json.final_feedback.purchased_goods)
    }

    if (!this.chosenIds.includes(3)) {
      this.feedbackTextList.push(this.json.final_feedback.fera)
    }

    if (!this.chosenIds.includes(4)) {
      this.feedbackTextList.push(
        this.json.final_feedback.upstream_transportation
      )
    }

    let correctNumber = 0

    if (this.chosenIds.includes(1)) {
      correctNumber++
    }

    if (this.chosenIds.includes(3)) {
      correctNumber++
    }

    if (this.chosenIds.includes(4)) {
      correctNumber++
    }

    let subtitle = ""

    switch (correctNumber) {
      case 3:
        subtitle = this.json.e_feedback_all_three
        break
      case 2:
        subtitle = this.json.e_feedback_two_right
        break
      case 1:
        subtitle = this.json.e_feedback_one_right
        break
      default:
        subtitle = this.json.e_feedback_zero_right
        break
    }

    this.feedBackSubtitle = subtitle
  },
  methods: {
    goToNextPage() {
      this.$store.dispatch("meta/unlockLessonPart", {
        lesson: "exploringScope3",
        part: 2, // zero indexed remember
      })
      this.$store.dispatch("meta/goForward")
    },
  },
  computed: {
    // chosenIds(): number[] {
    //   console.log("THE CHOSEN IDS ARE")
    //   console.log(this.$store.getters["meta/getLesson3ChosenIds"])
    //   return this.$store.getters["meta/getLesson3ChosenIds"]
    // },
    // feedbackTextList(): string[] {
    //   let feedbackTextList = [] as string[]
    //   // this might run before the chosenids are set
    //   if (!this.chosenIds.length) {
    //     return []
    //   }
    //   if (!this.chosenIds.includes(1)) {
    //     feedbackTextList.push(this.json.final_feedback.purchased_goods)
    //   }
    //   if (!this.chosenIds.includes(3)) {
    //     feedbackTextList.push(this.json.final_feedback.fera)
    //   }
    //   if (!this.chosenIds.includes(4)) {
    //     feedbackTextList.push(this.json.final_feedback.upstream_transportation)
    //   }
    //   return feedbackTextList
    // },
    // feedBackSubtitle(): any {
    //   let correctNumber = 0
    //   console.log("THE CHOSEN IDES IN FEEDBACK SUBTITLE ARE")
    //   console.log(this.chosenIds)
    //   // this might run before the chosenids are set
    //   if (!this.chosenIds.length) {
    //     return 0
    //   }
    //   if (!this.chosenIds.includes(1)) {
    //     correctNumber++
    //   }
    //   if (!this.chosenIds.includes(3)) {
    //     correctNumber++
    //   }
    //   if (!this.chosenIds.includes(4)) {
    //     correctNumber++
    //   }
    //   switch (correctNumber) {
    //     case 3:
    //       return this.json.e_feedback_all_three
    //     case 2:
    //       return this.json.e_feedback_two_right
    //     case 1:
    //       return this.json.e_feedback_one_right
    //     default:
    //       return this.json.e_feedback_zero_right
    //   }
    // },
  },
  props: ["json"],
})
</script>

<style scoped lang="scss">
#activity-feedback {
  display: flex;
}
.text-side {
  width: 66%;
  ul li {
    margin-bottom: 1em;
  }
}
.bar-graph-side {
  width: 33%;
  height: 533px;
  display: flex;
  align-items: center;
  // justify-content: center;
  flex-direction: column;
  // #DBE2E6
  padding: 1.5em 2em 0em 0em;
  ::v-deep .bar-graph {
    height: 100%;
    background: white;
    // box-shadow: $box-shadow;
    width: 100%;
    height: 100%;
    border-right: 1px solid #cdcdcd;
    .header {
      text-align: center;
      color: $darkBlue;
      margin: 0;
      padding: 0;
      margin-top: 0.2em;
      margin-bottom: 1em;
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
</style>
