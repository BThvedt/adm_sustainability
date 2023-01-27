<template>
  <PageBase>
    <div id="timelline-activity" class="module-page-container">
      <E id="page-header" :h="json.e_prompt" t="h3" class="header" />
      <div id="meter-wrapper">
        <div id="meter">
          <div
            id="meter-inner"
            :style="{
              width: `${(acquired_points / TOTAL_POINTS).toFixed(2) * 100}%`,
            }"
          ></div>
        </div>
      </div>
      <div id="content-area">
        <div id="image-and-speech-bubble-wrapper">
          <div id="image-wrapper">
            <img
              v-if="currImage"
              class="selected-category-display-image"
              :src="require(`@/assets/images/${currImage}`).default"
            />
            <div id="image-overlay">
              <div id="image-info">
                <transition
                  :enter-active-class="`${TEnter.FADE_IN_UP}`"
                  :leave-active-class="`${TExit.FADE_OUT_UP}`"
                  mode="out-in"
                >
                  <E
                    v-if="currentTime"
                    :h="currentTime"
                    t="h3"
                    class="image-info-text header"
                    :key="currentTime"
                  />
                </transition>
                <h3 v-if="currentCharacter || currentTime">|</h3>
                <transition
                  :enter-active-class="`${TEnter.FADE_IN_UP}`"
                  :leave-active-class="`${TExit.FADE_OUT_UP}`"
                  mode="out-in"
                >
                  <E
                    v-if="currentCharacter"
                    :h="currentCharacter"
                    t="h3"
                    class="image-info-text header"
                    :key="currentCharacter"
                  />
                </transition>
              </div>
            </div>
          </div>

          <transition
            :enter-active-class="`${
              showFeedback ? TEnter.FADE_IN : TEnter.FADE_IN_UP
            }`"
            :leave-active-class="`${TExit.FADE_OUT}`"
            mode="out-in"
          >
            <div
              v-if="currQuestion && !showFeedback"
              class="speech-bubble"
              key="question-bubble"
            >
              <E
                :h="currQuestion.e_prompt"
                t="p"
                class="question-choice-text"
              />
            </div>
            <div
              v-else-if="showFeedback"
              class="speech-bubble feedback-bubble"
              key="feedback-bubble"
            >
              <E :h="feedback.e_title" t="p" class="question-choice-text" />
              <E :h="feedback.e_text" t="p" class="question-choice-text" />
              <div
                v-if="currQuestion.choices[selected].correct"
                class="button small-button"
                @click="goToNext"
              >
                <E
                  :h="timeslots[currentTimeSlot].e_continue"
                  t="p"
                  class="question-choice-text"
                />
              </div>
              <div
                v-else-if="!currQuestion.choices[selected].correct"
                class="button small-button"
                @click="tryAgain"
              >
                <E :h="json.e_tryAgain" t="p" class="question-choice-text" />
              </div>
            </div>
          </transition>
        </div>

        <div id="multiple-choice-wrapper">
          <transition
            :enter-active-class="`${TEnter.FADE_IN} delay-1-s`"
            :leave-active-class="`${TExit.FADE_OUT}`"
            mode="out-in"
          >
            <div
              v-if="currQuestion && this.slotType === 'questions'"
              :key="currQuestion.id"
            >
              <E
                :h="currQuestion.e_instructions"
                t="p"
                class="question-instructions sub-headline header"
              />
              <div class="choices-container">
                <div
                  v-for="(choice, i) in currQuestion.choices"
                  class="question-choice text-box"
                  @click="select(i)"
                  :key="i"
                  :class="{
                    selected: selected === i,
                    correct: answered && choice.correct,
                    incorrect: !choice.correct,
                    answered: answered,
                    medium: choice.e_text.length > 105,
                  }"
                >
                  <div class="feedback-icon-container">
                    <div
                      class="question-feedback-icon incorrect"
                      v-if="selected === i && !choice.correct"
                    >
                      <font-awesome-icon icon="times" />
                    </div>
                    <div
                      class="question-feedback-icon correct"
                      v-if="answered && choice.correct"
                    >
                      <font-awesome-icon icon="check" />
                    </div>
                  </div>

                  <E :h="choice.e_text" t="p" class="question-choice-text" />
                </div>
              </div>
            </div>
            <div
              id="text-part"
              v-else-if="this.slotType === 'text'"
              key="text-screen"
            >
              <E
                :h="timeslots[currentTimeSlot].text.e_title"
                t="h1"
                class="big-title"
              />
              <E :h="timeslots[currentTimeSlot].text.e_text" t="div" />
              <div class="button large-button" @click="goToNextPage">
                <E :h="timeslots[currentTimeSlot].e_continue" t="p" />
              </div>
            </div>
          </transition>
        </div>
      </div>
      <div id="time-wrapper">
        <div
          v-for="time in timeslots"
          :key="time.id"
          :class="{ active: time.id === timeslots[currentTimeSlot].id }"
        >
          <E :h="time.e_time" t="p" class="time" />
        </div>
      </div>
    </div>
  </PageBase>
</template>

<script lang="ts">
import Vue from "vue"
import PageBase from "@/components/PageBase.vue"
import E from "@/components/editable/E.vue"
import { TEnter, TExit, TTimes } from "@/types"

export default Vue.extend({
  name: "TimelineActivity",
  components: { PageBase, E },
  data() {
    return {
      timeslots: this.json.timeslots,
      acquired_points: 0,
      TOTAL_POINTS: 0,

      currentTimeSlot: 0,
      currentQuestionInTimeSlot: 0,
      currentTime: null as string | null,
      currentCharacter: null as string | null,

      slotType: "question",

      answered: false,
      selected: -1,
      correct: false,
      currentAttempt: 1,

      currQuestion: null as any,
      currImage: null as string | null,

      showQuestion: true,
      showFeedback: false,

      feedback: {},

      TEnter,
      TExit,
      TTimes,
    }
  },
  methods: {
    goToNext() {
      this.currentAttempt = 1
      this.resetQuestionVars()

      if (
        this.currentQuestionInTimeSlot <
        this.timeslots[this.currentTimeSlot].questions.length - 1
      ) {
        this.currentQuestionInTimeSlot++
      } else if (this.currentTimeSlot < this.timeslots.length - 1) {
        this.currentTimeSlot++
        this.currentQuestionInTimeSlot = 0
      } else {
        // we're done, yay
        this.$store.dispatch("meta/goForward")
        return
      }

      this.slotType = this.timeslots[this.currentTimeSlot].slotType

      if (this.slotType === "questions") {
        this.currQuestion =
          this.timeslots[this.currentTimeSlot].questions[
            this.currentQuestionInTimeSlot
          ]

        if (this.currQuestion.questionImage !== this.currImage) {
          this.currImage = this.currQuestion.questionImage
        }

        if (this.currQuestion.e_character !== this.currentCharacter) {
          this.currentCharacter = this.currQuestion.e_character
        }

        if (this.timeslots[this.currentTimeSlot] !== this.currentTime) {
          this.currentTime = this.timeslots[this.currentTimeSlot].e_time
        }
      } else if (this.slotType === "text") {
        this.currQuestion = null
        this.currentCharacter = null
        this.currentTime = null
        this.currImage = this.timeslots[this.currentTimeSlot].image
      }
    },
    tryAgain() {
      this.currentAttempt++
      this.resetQuestionVars()
    },
    select(choice: number) {
      if (!this.answered) {
        this.answered = true
        this.selected = choice

        this.correct = this.currQuestion.choices[choice].correct
        this.feedback = this.currQuestion.choices[choice].feedback
        // this.showQuestion = false
        this.showFeedback = true

        if (this.correct && this.currentAttempt === 1) {
          this.acquired_points += this.currQuestion.points
        }
      }
    },
    resetQuestionVars() {
      this.answered = false
      this.selected = -1

      this.correct = false
      this.feedback = {}
      this.showFeedback = false
    },
    goToNextPage() {
      this.$store.dispatch("meta/goForward")
    },
  },
  mounted() {
    let totalPoints = 0
    this.timeslots.forEach((timeslot: any) => {
      let { questions } = timeslot
      if (questions) {
        questions.forEach((question: any) => {
          if (question.points) {
            totalPoints += question.points
          }
        })
      }
    })

    this.TOTAL_POINTS = totalPoints

    this.slotType = this.timeslots[this.currentTimeSlot].slotType

    if (this.slotType === "questions") {
      this.currQuestion =
        this.timeslots[this.currentTimeSlot].questions[
          this.currentQuestionInTimeSlot
        ]

      this.currImage = this.currQuestion.questionImage
      this.currentTime = this.timeslots[this.currentTimeSlot].e_time
      this.currentCharacter = this.currQuestion.e_character
    } else if (this.slotType === "text") {
      this.currentTime = this.currImage =
        this.timeslots[this.currentTimeSlot].image
    }
  },

  props: ["json"],
})
</script>

<style scoped lang="scss">
#timelline-activity {
  padding-top: calc(#{$menuHeight} + 0.5em);
}
#content-area {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70%;
  #image-and-speech-bubble-wrapper {
    width: 48%;
    margin-right: 3%;
    position: relative;
    #image-wrapper {
      position: relative;
      overflow: hidden;
      display: flex;
      img {
        width: 100%;
        height: 100%;
      }
      #image-overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: linear-gradient(
          0deg,
          rgba(0, 0, 0, 0.6) 0%,
          rgba(255, 255, 255, 0) 90%
        );

        ::v-deep #image-info {
          position: absolute;
          bottom: 35%;
          width: 100%;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          h3 {
            margin: 0 0.5em;
            color: white;
          }
          // .header {
          //   color: white;
          // }
        }
      }
    }
    .speech-bubble {
      position: absolute;
      top: 78%;
      width: 106%;
      left: -3%;
      background: white;
      padding: 0.75em 1.5em;
      box-shadow: $box-shadow;
      border-radius: 30px;
      line-height: 1.1em;
      box-sizing: border-box;

      &.feedback-bubble {
        padding-bottom: 2.6em;
        .button {
          position: absolute;
          right: 1.1em;
          bottom: 0.5em;
          height: 35px;
          p {
            padding-top: 0.3em;
            padding-bottom: 0.3em;
          }
        }
      }

      &::after {
        content: "";
        border-left: 20px solid transparent;
        border-right: 20px solid transparent;
        border-bottom: 30px solid white;
        display: block;
        position: absolute;
        left: calc(50% - 12px);
        top: -30px;
      }
      &::before {
        content: "";
        border-left: 22px solid transparent;
        border-right: 22px solid transparent;
        border-bottom: 31px solid #e2e2e2;
        display: block;
        position: absolute;
        left: calc(50% - 16px);
        top: -31px;
      }
    }
  }
  #multiple-choice-wrapper {
    width: 49%;
    height: 100%;
    .question-instructions {
      margin-left: 1em;
    }
    .question-choice {
      padding: 0.5em;
      padding-left: 3em;
      padding-right: 1em;
      line-height: 1.1em;
      border: 1px solid $gray;
      margin: 1em;
      border-radius: 25px 0 25px 0;
      cursor: pointer;
      transition: $very-fast-transition;
      position: relative;
      display: flex;
      align-items: center;

      &.answered {
        cursor: default;
        &.correct {
          background: white;
          opacity: 0.5;
          &.selected {
            opacity: 1;
          }
        }

        &.incorrect {
          &.selected {
            background: white;
          }
        }
      }

      .feedback-icon-container {
        width: 2em;
        position: absolute;
        left: 0;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .question-feedback-icon {
          position: absolute;
          left: 0.4em;
          font-size: 2em;
          &.incorrect {
            color: $red;
          }
          &.correct {
            color: $green;
            left: 0.4em;
            font-size: 1.8em;
          }
        }
      }

      &:hover {
        background: white;
        color: $darkBlue;
        border: 1px solid $darkBlue;
      }

      // &.correct {

      // }

      // &.incorrect {

      // }
    }

    #text-part {
      height: 100%;

      .large-button {
        margin-top: 2em;
      }
    }
  }
}
#meter-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 8%;
  #meter {
    width: 60%;
    height: 24px;
    background: $lightGray;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    #meter-inner {
      position: absolute;
      height: 100%;
      top: 0;
      left: 0;
      background: green;
      transition: $normal-transition;
    }
  }
}

#page-header {
  font-weight: normal;
  font-style: italic;
  text-align: center;
  margin: 0;
  padding: 0;
  margin-bottom: 1%;
}
::v-deep #time-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 8%;
  margin-top: 2em;
  transition: $normal-transition;
  p {
    color: $gray;
    font-size: 0.9em;
    padding: 0.3em;
    margin: 0 0.5em;
  }
  .active {
    background: $blue;
    box-shadow: $box-shadow;
    border-radius: 3px;
    p {
      color: white;
    }
  }
}
</style>
