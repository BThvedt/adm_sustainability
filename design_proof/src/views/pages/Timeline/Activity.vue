<template>
  <PageBase>
    <div id="timeline-activity" class="module-page-container">
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
      <div id="content-area" v-if="currentTimeSlot >= 0">
        <div id="image-and-speech-bubble-wrapper">
          <div id="image-wrapper">
            <img
              v-if="currImage"
              class="selected-category-display-image"
              :src="require(`@/assets/images/${currImage}`).default"
            />
            <div id="image-overlay">
              <div id="image-info" ref="speechBubbleRef">
                <transition
                  :enter-active-class="`${TEnter.FADE_IN_UP}`"
                  :leave-active-class="`${TExit.FADE_OUT_UP}`"
                  mode="out-in"
                >
                  <E
                    v-if="currentTime"
                    :h="currentTime"
                    t="h3"
                    class="image-info-text header time"
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
                    class="image-info-text header character-name"
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
              :style="{
                top: `${speechBalloonTop}px`,
              }"
            >
              <E
                :h="currQuestion.e_prompt"
                t="p"
                class="question-choice-text"
              />
            </div>
            <div
              v-else-if="showFeedback"
              class="speech-bubble feedback-box"
              :class="`${correct ? 'correct' : 'incorrect'}`"
              key="feedback-box"
              :style="{
                top: `${speechBalloonTop}px`,
              }"
            >
              <E
                :h="feedback.e_title"
                t="h3"
                class="header question-choice-text"
              />
              <E :h="feedback.e_text" t="p" class="question-choice-text" />
              <div v-if="correct" class="button small-button" @click="goToNext">
                <E
                  :h="timeslots[currentTimeSlot].e_continue"
                  t="p"
                  class="question-choice-text"
                />
              </div>
              <div
                v-else-if="!correct"
                class="button small-button"
                @click="tryAgain"
              >
                <E :h="json.e_tryAgain" t="p" class="question-choice-text" />
              </div>
            </div>
          </transition>
        </div>

        <div id="question-side-wrapper">
          <transition
            :enter-active-class="`${TEnter.FADE_IN} delay-1-s`"
            :leave-active-class="`${TExit.FADE_OUT}`"
            mode="out-in"
          >
            <div
              v-if="
                currQuestion &&
                this.slotType === 'questions' &&
                currQuestion.questionType === 'multiple-choice'
              "
              :key="`multi-choice-${currQuestion.id}`"
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
              v-else-if="
                currQuestion &&
                this.slotType === 'questions' &&
                currQuestion.questionType === 'multiple-select'
              "
              :key="`mutiple-select-${currQuestion.id}`"
            >
              <E
                :h="currQuestion.e_instructions"
                t="p"
                class="question-instructions sub-headline header"
              />
              <div class="choices-container">
                <div
                  v-for="(choice, i) in currQuestion.choices"
                  class="question-choice multichoice-choice text-box"
                  @click="multiChoiceSelect(i)"
                  :key="i"
                  :class="{
                    selected: multiChoiceSelected.includes(i),
                    correct: answered && choice.correct,
                    wasNotSelected:
                      answered &&
                      choice.correct &&
                      !multiChoiceSelected.includes(i),
                    incorrect:
                      answered &&
                      multiChoiceSelected.includes(i) &&
                      !choice.correct,
                    answered: answered,
                    medium: choice.e_text.length > 105,
                  }"
                >
                  <div class="feedback-icon-container">
                    <div
                      class="question-feedback-icon incorrect"
                      v-if="
                        answered &&
                        multiChoiceSelected.includes(i) &&
                        !choice.correct
                      "
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
                <div class="multichoice-button-wrapper" v-if="!answered">
                  <div class="button" @click="answerMultiChoice">
                    <E t="span" :h="currQuestion.e_submitText" />
                  </div>
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

      <div id="time-wrapper" v-if="currentTimeSlot >= 0">
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

const BALLOON_OFFSET = 135

export default Vue.extend({
  name: "TimelineActivity",
  components: { PageBase, E },
  data() {
    return {
      timeslots: this.json.timeslots,
      acquired_points: 0,
      TOTAL_POINTS: 0,

      currentTimeSlot: -1,
      currentQuestionInTimeSlot: 0,
      currentTime: null as string | null,
      currentCharacter: null as string | null,

      slotType: "question",

      answered: false,
      selected: -1,
      correct: false,
      currentAttempt: 1,

      multiChoiceSelected: [] as number[],

      currQuestion: null as any,
      currImage: null as string | null,

      showQuestion: true,
      showFeedback: false,

      feedback: {},

      speechBalloonTop: undefined as undefined | number,

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
        this.$store.dispatch("meta/unlockLessonPart", {
          lesson: "dayInTheLife",
          part: 2, // zero indexed remember
        })

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
    multiChoiceSelect(choice: number) {
      console.log("IVE BEEN CLICKED")
      if (!this.answered && !this.multiChoiceSelected.includes(choice)) {
        // this.answered = true
        this.multiChoiceSelected.push(choice)
      } else if (!this.answered) {
        this.multiChoiceSelected = this.multiChoiceSelected.filter(
          (entry) => entry !== choice
        )
      }
    },
    answerMultiChoice() {
      this.answered = true
      let correct = true

      let numberOfCorrect = 0
      this.currQuestion.choices.forEach((choice: any) => {
        if (choice.correct) {
          numberOfCorrect++
        }
      })

      this.multiChoiceSelected.forEach((choice: number) => {
        if (!this.currQuestion.choices[choice].correct) {
          correct = false
        }
      })

      if (correct) {
        if (this.multiChoiceSelected.length !== numberOfCorrect) {
          correct = false
        }
      }

      this.correct = correct

      let feedback: string

      if (correct) {
        feedback = this.currQuestion.feedback.correct
      } else {
        feedback = this.currQuestion.feedback.incorrect
      }

      this.showFeedback = true
      this.feedback = feedback

      if (this.correct && this.currentAttempt === 1) {
        this.acquired_points += this.currQuestion.points
      }
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

      this.multiChoiceSelected = []
    },
    goToNextPage() {
      this.$store.dispatch("meta/goForward")
    },
  },
  computed: {
    screenResizeTicker(): number {
      return this.$store.getters["meta/getWindowResizeTicker"]
    },
  },
  watch: {
    screenResizeTicker(newVal) {
      // every time the screen is resized I want the speech bubble to be in the right place!
      const top = (this.$refs.speechBubbleRef as any)?.offsetTop
      this.speechBalloonTop = top + BALLOON_OFFSET
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

    this.currentTimeSlot = 0

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

    // Ok this is hacky ... lol
    // I have no words except.. sometimes you gotta do whatcha gotta do
    this.$nextTick(() => {
      this.$nextTick(() => {
        const top = (this.$refs.speechBubbleRef as any)?.offsetTop
        this.speechBalloonTop = top + BALLOON_OFFSET
      })
    })
  },
  updated() {
    // lets make sure the speech bubble is where it's 'sposed to go on updates
    const top = (this.$refs.speechBubbleRef as any)?.offsetTop
    this.speechBalloonTop = top + BALLOON_OFFSET
  },

  props: ["json"],
})
</script>

<style scoped lang="scss">
#timeline-activity {
  padding-top: calc(#{$menuHeight} + 1em);
}
#content-area {
  display: flex;
  // align-items: center;
  justify-content: center;
  // height: 70%;
  margin-bottom: 3em;
  #image-and-speech-bubble-wrapper {
    width: 48%;
    margin-right: 3%;
    position: relative;
    // height: 100%;
    // padding-top: 3em;
    // background: green;
    max-width: 610px;

    #image-wrapper {
      position: relative;
      overflow: hidden;
      display: flex;
      margin-top: 11%;
      // background: blue;

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
          .image-info-text {
            min-width: 100px;
            &.character-name {
              text-align: left;
            }

            &.time {
              text-align: right;
            }
          }
          // .header {
          //   color: white;
          // }
        }
      }
    }
    .speech-bubble:not(.feedback-box) {
      position: absolute;
      // top: 78%;
      width: 106%;
      left: -3%;
      background: white;
      padding: 0.75em 1.5em;
      box-shadow: $box-shadow;
      border-radius: 30px;
      line-height: 1.1em;
      box-sizing: border-box;

      &::after {
        content: "";
        border-left: 20px solid transparent;
        border-right: 20px solid transparent;
        border-bottom: 30px solid white;
        display: block;
        position: absolute;
        left: calc(50% - 19px);
        top: -30px;
      }
      &::before {
        content: "";
        border-left: 22px solid transparent;
        border-right: 22px solid transparent;
        border-bottom: 31px solid #e2e2e2;
        display: block;
        position: absolute;
        left: calc(50% - 23px);
        top: -31px;
      }
    }
    .feedback-box {
      position: absolute;
      width: 106%;
      left: -3%;
      padding: 1.5em;
      box-shadow: $box-shadow;
      line-height: 1.1em;
      box-sizing: border-box;
      padding-bottom: 3.5em;
      background: white;
      transform: translate(0, -30px);

      h3 {
        margin: 0;
      }

      &.correct {
        h3 {
          color: $emerald;
        }
        .button {
          background: $emerald;
          font-weight: bold;
          &:hover {
            background: $green;
          }
        }
      }

      &.incorrect {
        h3 {
          color: $red;
        }
        .button {
          background: $red;
          font-weight: bold;
          &:hover {
            background: $orange;
          }
        }
      }

      .button {
        position: absolute;

        bottom: 1em;
        // height: 35px;
        p {
          padding-top: 0.3em;
          padding-bottom: 0.3em;
        }
      }
    }
  }
  #question-side-wrapper {
    width: 49%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .question-instructions {
      margin-left: 1em;
    }
    .question-choice {
      //padding: 0.5em;
      padding-left: 3em;
      padding-right: 0.75em;
      line-height: 1.1em;
      border: 1px solid $gray;
      margin: 1em;
      border-radius: 25px 0 25px 0;
      cursor: pointer;
      transition: $very-fast-transition;
      position: relative;
      display: flex;
      align-items: center;

      &:hover {
        border: 1px solid $gray;
      }

      &.selected {
        background: rgba(0, 0, 0, 0.1);
        box-shadow: 0px 0px 3px $green;
        &:hover {
          background: rgba(0, 0, 0, 0.05);
        }
      }

      &.answered {
        cursor: default;
        opacity: 0.5;
        &.correct {
          opacity: 0.5;
          // box-shadow: 0px 0px 3px $red;
          background: rgba(0, 0, 0, 0.1);
          &.selected {
            opacity: 1;
            box-shadow: 0px 0px 2px 1px $green;
            border-color: $green;
            background: white;
            color: black;
          }
        }

        &.incorrect {
          &.selected {
            opacity: 0.5;
            box-shadow: 0px 0px 2px 1px $red;
            background: white;
            background: rgba(0, 0, 0, 0.1);
            border-color: $red;
            color: black;
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

      // &:hover {
      //   background: white;
      //   color: $darkBlue;
      //   border: 1px solid $darkBlue;
      // }

      // &.multichoice-choice {
      //   &.selected {
      //     opacity: 0.5;
      //     color: $darkBlue;
      //     border-color: $darkBlue;
      //     box-shadow: 0px 0px 3px $green;
      //     background: rgba(0, 0, 0, 0.1);
      //     //background: white;
      //     &:hover {
      //       cursor: pointer;
      //     }
      //   }

      //   &.correct {
      //     &.wasNotSelected {
      //       opacity: 0.5;
      //     }
      //   }
      //   &.incorrect {
      //     background: white;
      //   }
      //   &.answered {
      //     opacity: 0.5;
      //   }
      // }

      // &.correct {

      // }

      // &.incorrect {

      // }
    }

    .multichoice-button-wrapper {
      padding-right: 1em;
      .button {
        float: right;
      }
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
  height: 7%;
  #meter {
    width: 60%;
    height: 24px;
    background: $lightGray;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    bottom: 10%;
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
