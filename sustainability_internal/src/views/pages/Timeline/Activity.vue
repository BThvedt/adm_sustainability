<template>
  <PageBase>
    <div id="timeline-activity" class="module-page-container">
      <E id="page-header" :h="json.e_prompt" t="p" class="italic-prompt" />

      <div id="time-wrapper" v-if="currentTimeSlot >= 0">
        <div
          v-for="(time, index) in timeslots"
          :key="time.id"
          :class="{ active: time.id === timeslots[currentTimeSlot].id }"
        >
          <div v-if="index !== timeslots.length - 1">
            <div class="timeslot-container">
              <div
                class="question-circle"
                :class="{
                  filled:
                    (index == currentTimeSlot &&
                      currentQuestionInTimeSlot >= 0) ||
                    currentTimeSlot > index,
                }"
              />
              <div
                class="connecting-bar"
                :class="{
                  filled:
                    (index == currentTimeSlot &&
                      currentQuestionInTimeSlot >= 1) ||
                    currentTimeSlot > index,
                }"
              >
                <div class="connecting-bar-inner" />
                <E :h="time.e_time" t="p" class="time" />
              </div>
              <div
                class="question-circle"
                :class="{
                  filled:
                    (index == currentTimeSlot &&
                      currentQuestionInTimeSlot >= 1) ||
                    currentTimeSlot > index,
                }"
              />
              <div
                :class="{
                  filled: currentTimeSlot > index,
                }"
                class="in-between-bar"
              >
                <div class="connecting-bar-inner" />
              </div>
            </div>
          </div>
          <div v-else>
            <div class="timeslot-container">
              <div
                :class="{
                  filled: currentTimeSlot >= index,
                }"
                class="end-of-day connecting-bar"
              >
                <div class="connecting-bar-inner"></div>
                <E :h="time.e_time" t="p" class="time end-of-day" />
              </div>
              <div
                class="question-circle"
                :class="{
                  filled: currentTimeSlot >= index,
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div id="question-and-photo-wrapper" v-if="currentTimeSlot >= 0">
        <div id="image-and-speech-bubble-wrapper">
          <div id="image-wrapper">
            <transition
              :enter-active-class="`${TEnter.FADE_IN}`"
              :leave-active-class="`${TExit.FADE_OUT}`"
            >
              <img
                style="position: absolute"
                v-if="currImage"
                class="selected-category-display-image"
                :src="require(`@/assets/images/${currImage}`).default"
                :key="currImage"
              />
            </transition>
            <!-- <div id="image-overlay">
              <div id="image-info" ref="speechBubbleRef">
                <transition
                  :enter-active-class="`${TEnter.FADE_IN}`"
                  :leave-active-class="`${TExit.FADE_OUT}`"
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
                  :enter-active-class="`${TEnter.FADE_IN}`"
                  :leave-active-class="`${TExit.FADE_OUT}`"
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
            </div> -->
          </div>

          <transition
            :enter-active-class="`${
              showFeedback ? TEnter.FADE_IN : TEnter.FADE_IN_DOWN
            }`"
            :leave-active-class="`${TExit.FADE_OUT}`"
            mode="out-in"
          >
            <div
              v-if="currQuestion && !showFeedback"
              class="speech-bubble"
              :key="currQuestion.id"
            >
              <E
                :h="currQuestion.e_prompt"
                t="p"
                class="question-choice-text"
              />
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
              class="question-inner"
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
                class="question-instructions italic-prompt"
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
                    finalAttempt: currentAttempt === 2,
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
                      v-if="
                        (currentAttempt === 1 &&
                          answered &&
                          multiChoiceSelected.includes(i) &&
                          choice.correct) ||
                        (currentAttempt === 2 && answered && choice.correct) ||
                        (currentAttempt === 2 && answered && choice.correct) ||
                        (keptCorrectMultichoseAnswers.includes(i) &&
                          multiChoiceSelected.includes(i))
                      "
                    >
                      <font-awesome-icon icon="check" />
                    </div>
                  </div>

                  <E :h="choice.e_text" t="p" class="question-choice-text" />
                </div>

                <transition
                  :enter-active-class="TEnter.FADE_IN_UP"
                  :leave-active-class="TExit.FADE_OUT"
                >
                  <div
                    class="multichoice-button-wrapper"
                    v-if="!answered && showSubmit"
                  >
                    <div class="button" @click="answerMultiChoice">
                      <E t="span" :h="currQuestion.e_submitText" />
                    </div>
                  </div>
                </transition>
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
      <div
        v-if="showFeedback"
        class="feedback-box"
        :class="`${correct ? 'correct' : 'incorrect'}`"
        key="feedback-box"
        :style="{
          top: `${speechBalloonTop}px`,
        }"
      >
        <E
          :h="feedback.e_title"
          t="h3"
          class="question-feedback-header header question-choice-text"
        />
        <E :h="feedback.e_text" t="p" class="question-choice-text" />
        <div
          v-if="correct"
          class="button small-button feedback-button"
          @click="goToNext"
        >
          <E
            :h="timeslots[currentTimeSlot].e_continue"
            t="p"
            class="question-choice-text"
          />
        </div>
        <div
          v-else-if="!correct"
          class="button small-button feedback-button"
          @click="tryAgain"
        >
          <E :h="json.e_tryAgain" t="p" class="question-choice-text" />
        </div>
      </div>

      <SideModal
        ref="QuestionFeedbackModal"
        :titleAndText="feedback"
        @onClose="modalClose"
      />
    </div>
  </PageBase>
</template>

<script lang="ts">
import Vue from "vue"
import SideModal from "@/components/modals/SideModal.vue"
import PageBase from "@/components/PageBase.vue"
import E from "@/components/editable/E.vue"
import { TEnter, TExit, TTimes } from "@/types"

const BALLOON_OFFSET = 135

export default Vue.extend({
  name: "TimelineActivity",
  components: { PageBase, E, SideModal },
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
      showSubmit: false,

      multiChoiceSelected: [] as number[],
      keptCorrectMultichoseAnswers: [] as number[],

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
  mounted() {
    // ;(this.$refs["QuestionFeedbackModal"] as any).show()

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
  },
  methods: {
    modalClose() {
      if (!this.correct && this.currentAttempt === 1) {
        this.tryAgain()
      } else {
        this.goToNext()
      }
    },
    goToNext() {
      this.currentAttempt = 1
      this.resetQuestionVars({ keepTrue: false })

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
      this.resetQuestionVars({ keepTrue: true })
    },
    multiChoiceSelect(choice: number) {
      // console.log("IVE BEEN CLICKED")
      let numberOfCorrect = 0
      this.currQuestion.choices.forEach((choice: any) => {
        if (choice.correct) {
          numberOfCorrect++
        }
      })

      if (!this.answered && !this.multiChoiceSelected.includes(choice)) {
        // this.answered = true

        // if the length of multiChoiceSelected is greater than the number of choices unshif the first choice

        if (this.multiChoiceSelected.length < numberOfCorrect) {
          this.multiChoiceSelected.push(choice)
        } else {
          this.multiChoiceSelected.pop()
          this.multiChoiceSelected.push(choice)
        }
      } else if (!this.answered) {
        this.multiChoiceSelected = this.multiChoiceSelected.filter(
          (entry) => entry !== choice
        )
      }

      // showSubmit
      if (this.multiChoiceSelected.length == numberOfCorrect) {
        this.showSubmit = true
      } else {
        this.showSubmit = false
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
      } else if (this.currentAttempt === 1) {
        feedback = this.currQuestion.feedback.incorrect
      } else {
        feedback = this.currQuestion.feedback.incorrect_second
      }

      // this.showFeedback = true
      this.feedback = feedback

      this.$nextTick(() => {
        // give title and text a chance to update on teh frontend before ording the modal to show
        ;(this.$refs["QuestionFeedbackModal"] as any).show()
      })

      // if (this.correct && this.currentAttempt === 1) {
      //   this.acquired_points += this.currQuestion.points
      // }
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
    resetQuestionVars(props: { keepTrue: boolean }) {
      this.answered = false
      this.selected = -1

      this.showSubmit = false

      let { keepTrue } = props

      if (!this.correct) {
        // get rid of the incorrect answers
        // console.log("resetting question vars")
        let newMultiChoiceSelected = [...this.multiChoiceSelected]
        // console.log("NEW MULTI CHOICE SELECTED IS")
        // console.log(newMultiChoiceSelected)
        this.multiChoiceSelected.forEach((choice: number) => {
          if (!this.currQuestion.choices[choice].correct) {
            // splice the index from newMultiChoiceSelected
            let indexToSplice = newMultiChoiceSelected.findIndex(
              (selectedChoice: number) => selectedChoice === choice
            )
            newMultiChoiceSelected.splice(indexToSplice, 1)
          }
        })

        // console.log("NEW MULTICHOICE SELECTED IS")
        // console.log(newMultiChoiceSelected)

        this.multiChoiceSelected = [...newMultiChoiceSelected]
        this.keptCorrectMultichoseAnswers = [...newMultiChoiceSelected]
      } else {
        this.multiChoiceSelected = []
        this.keptCorrectMultichoseAnswers = []
      }

      this.correct = false
      this.feedback = {}
      this.showFeedback = false

      if (!keepTrue) {
        this.multiChoiceSelected = []
        this.keptCorrectMultichoseAnswers = []
      }

      // this.multiChoiceSelected = []
    },
    goToNextPage() {
      this.$store.dispatch("meta/goForward")
    },
  },
  computed: {
    // screenResizeTicker(): number {
    //   return this.$store.getters["meta/getWindowResizeTicker"]
    // },
  },
  watch: {
    // screenResizeTicker(newVal) {
    //   // every time the screen is resized I want the speech bubble to be in the right place!
    //   const top = (this.$refs.speechBubbleRef as any)?.offsetTop
    //   this.speechBalloonTop = top + BALLOON_OFFSET
    // },
  },

  // updated() {
  //   // lets make sure the speech bubble is where it's 'sposed to go on updates
  //   const top = (this.$refs.speechBubbleRef as any)?.offsetTop
  //   this.speechBalloonTop = top + BALLOON_OFFSET
  // },

  props: ["json"],
})
</script>

<style scoped lang="scss">
#timeline-activity {
  position: relative;
  height: 720px;
}
::v-deep #timeline-activity {
  #modal-inner {
    color: $gray;
  }
}
.feedback-box {
  // background: white;
  // outline: 5px solid black;
  // font-size: 0.95em;
  line-height: 1.1em;
  height: 8em;
  position: absolute;
  width: 96%;
  bottom: 1em;
  .question-feedback-header {
    margin-top: 0.3em;
    margin-bottom: 0.3em;
  }
  .feedback-button {
    position: absolute;
    right: 1em;
    bottom: 0.5em;
    height: 35px;
  }
}
.timeslot-container {
  display: flex;
  justify-content: center;
  align-items: center;
  .question-circle {
    width: 40px;
    height: 40px;
    background: $lightGray;
    border-radius: 100%;
    position: relative;
    z-index: 10;
    transition: 1s all;
    &.filled {
      // transition-delay: 1s;
      background: $orange;
    }
  }

  .connecting-bar-inner {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    transition: 1s all;
  }

  .connecting-bar {
    width: 95px;
    height: 25px;
    background: $lightGray;
    margin-left: -5px;
    margin-right: -5px;
    position: relative;
    z-index: 1;

    p {
      margin: 0 !important;
      padding: 0 !important;
      text-align: center;
      font-weight: bold;
      position: relative;
      top: 1px;
      transition: 1s all;
    }
    .end-of-day {
      right: 5px;
    }
    &.filled {
      // background: $orange;
      .connecting-bar-inner {
        background: $orange;
        width: 100%;
      }
      p {
        color: white !important;
      }
    }
  }
  .in-between-bar {
    width: 25px;
    height: 25px;
    margin-left: -5px;
    margin-right: -5px;
    background: $lightGray;
    position: relative;
    &.filled {
      .connecting-bar-inner {
        background: $orange;
        width: 100%;
      }
    }
  }
}

#timeline-activity {
  padding-top: calc(#{$menuHeight} + 1em);
}
#question-and-photo-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1em;
  margin-top: 2.5em;
  // margin-bottom: 3em;
  // background: green;

  #image-and-speech-bubble-wrapper {
    width: 45%;
    margin-right: 3%;
    position: relative;
    // margin-top: 8%;
    // height: 100%;
    // padding-top: 3em;
    // background: green;
    max-width: 610px;
    // background: blue;

    #image-wrapper {
      position: absolute;
      overflow: hidden;
      // display: flex;
      width: 90%;

      margin: auto;
      left: 7%;
      top: 14%;
      height: 330px;

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
          bottom: 17%;
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
        }
      }
    }
    .speech-bubble {
      position: absolute;
      width: 112%;
      left: -5%;
      background: white;
      padding: 0.3em 1.1em;
      box-shadow: $box-shadow;
      border-radius: 30px;
      box-sizing: border-box;
      top: -1.8em;
      border: 1px solid #e2e2e2;
      font-size: 0.96em;
      line-height: 1.08em;
      color: $gray;

      &::after {
        content: "";
        border-left: 20px solid transparent;
        border-right: 20px solid transparent;
        border-top: 30px solid white;
        display: block;
        position: absolute;
        left: calc(50% - 18px);
        bottom: -30px;
      }
      &::before {
        content: "";
        border-left: 22px solid transparent;
        border-right: 22px solid transparent;
        border-top: 31px solid #e2e2e2;
        display: block;
        position: absolute;
        left: calc(50% - 23px);
        bottom: -31px;
      }
    }
  }
  #question-side-wrapper {
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .choices-container {
      position: relative;
    }
    .question-inner {
      margin-top: 4%;
    }

    .question-instructions {
      margin-left: 1em;
    }
    .question-choice {
      padding: 0.25em;
      padding-left: 3em;
      padding-right: 0.75em;
      line-height: 1.1em;
      border: 1px solid $gray;
      margin: 0.75em;
      border-radius: 25px 0 25px 0;
      cursor: pointer;
      transition: $very-fast-transition;
      position: relative;
      display: flex;
      align-items: center;
      // font-size: 0.95em;
      // line-height: 1.1em;
      z-index: 100;
      color: $gray;

      &:hover {
        border: 1px solid black;
        color: black;
        background: rgba(0, 0, 0, 0.05);
      }

      &.selected {
        background: rgba(0, 0, 0, 0.1);
        box-shadow: 0px 0px 3px $emerald;
        &:hover {
          background: rgba(0, 0, 0, 0.05);
        }
      }

      &.answered {
        cursor: default;

        &.correct {
          // opacity: 0.5;
          // box-shadow: 0px 0px 3px $red;
          // background: rgba(0, 0, 0, 0.1);
          &.selected {
            opacity: 1;
            box-shadow: 0px 0px 2px 1px $emerald;
            border-color: $emerald;
            background: white;
            color: black;
          }
        }

        &.incorrect {
          &.selected {
            opacity: 0.5;
            box-shadow: 0px 0px 2px 1px $red;
            background: white;
            border-color: $red;
            color: black;
          }
        }

        &.finalAttempt {
          &.incorrect {
            &.selected {
              opacity: 0.5;
            }
          }
          &.correct {
            background: $white;
            opacity: 0.5;
            &.selected {
              opacity: 1;
            }
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
            color: $emerald;
            left: 0.4em;
            font-size: 1.8em;
          }
        }
      }
    }

    .multichoice-button-wrapper {
      padding-right: 1em;
      position: absolute;
      right: 0em;
      bottom: -3em;
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

// #page-header {
//   font-weight: normal;
//   font-style: italic;
//   text-align: center;
//   margin: 0;
//   padding: 0;
//   margin-bottom: 1%;
// }
#page-header {
  font-weight: normal;
  margin-bottom: 1.5%;
  margin-top: 0;
  text-align: center;
}
::v-deep #time-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  // height: 8%;
  // margin-top: 2em;
  transition: $normal-transition;
  p {
    color: $gray;
    font-size: 0.9em;
    padding: 0.3em;
    margin: 0 0.5em;
  }
}
</style>
