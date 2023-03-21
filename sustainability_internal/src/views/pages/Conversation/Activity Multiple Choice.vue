<template>
  <PageBase>
    <div id="activity-three" class="module-page-container">
      <!-- <E id="page-header" :h="json.e_prompt" t="h3" class="header" /> -->
      <div id="step-area-wrapper">
        <div id="step-areas">
          <div
            class="step-area"
            v-for="(step, index) in steps"
            :key="step.id"
            :class="`step-area-${index}`"
          >
            <div class="step-area-bar-and-title-contaienr">
              <div class="step-area-title-container">
                <font-awesome-icon
                  icon="check"
                  :class="`visited-icon ${TEnter.FADE_IN}`"
                  v-if="stepsCompleted[index] === true"
                />
                <E :h="step.e_title" t="p" class="small-text" />
              </div>

              <div :class="`step-circle step-${index}`"></div>
            </div>

            <div
              class="step-area-gray-bar-container"
              v-if="index < steps.length - 1"
            >
              <div :class="`step-area-gray-bar`" />
            </div>
          </div>
        </div>
      </div>

      <div id="content-area">
        <div id="person-and-speech-bubble-wrapper">
          <div id="image-wrapper">
            <img
              class="selected-category-display-image"
              :src="
                require(`@/assets/images/${characterImages[personChosen]}`)
                  .default
              "
            />
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
                  :h="steps[currentStep].e_continue"
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
            <div v-if="currQuestion">
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
          </transition>
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
  name: "ConversationMultipleChoice",
  components: { PageBase, E },
  data() {
    return {
      characterImages: this.json.characterImages,
      stepsCompleted: [] as boolean[],
      currentStep: 0,
      steps: this.json.steps,
      personChosen: 0, // the question in array of questions in each step.. get from a "getter" in the real version

      answered: false,
      selected: -1,
      correct: false,

      currQuestion: null as any,

      showQuestion: true,
      showFeedback: false,

      feedback: {},

      TEnter,
      TExit,
      TTimes,
    }
  },
  mounted() {
    this.stepsCompleted = new Array(this.json.steps.length).fill(false)

    this.currQuestion = this.steps[this.currentStep].question[this.personChosen]
  },
  methods: {
    select(choice: number) {
      if (!this.answered) {
        this.answered = true
        this.selected = choice

        this.correct = this.currQuestion.choices[choice].correct
        this.feedback = this.currQuestion.choices[choice].feedback
        // this.showQuestion = false
        this.showFeedback = true
      }
    },
    goToNext() {
      this.stepsCompleted.splice(this.currentStep, 1, true)
      if (this.currentStep < this.stepsCompleted.length - 1) {
        this.currentStep += 1
        this.currQuestion =
          this.steps[this.currentStep].question[this.personChosen]
        this.resetVars()
      } else {
        this.$store.dispatch("meta/goForward")
      }
    },
    tryAgain() {
      this.resetVars()
    },
    resetVars() {
      this.answered = false
      this.selected = -1

      this.correct = false
      this.feedback = {}
      this.showFeedback = false
    },
    // answerQuestion(index: number) {},
  },
  props: ["json"],
})
</script>

<style scoped lang="scss">
@media screen and (max-width: 1180px) {
  #stage .module-page-container {
    padding-top: $menuHeight;
    padding-left: 1em;
    padding-right: 1em;
    padding-bottom: 0;
  }
}
.module-page-container {
  display: flex;
  flex-direction: column;
  padding-bottom: 0;
}
#page-header {
  font-weight: normal;
  font-style: italic;
  text-align: center;
  margin: 0;
  padding: 0;
  margin-bottom: 1%;
}
#content-area {
  height: 80%;
  overflow: hidden;
  display: flex;
  #multiple-choice-wrapper {
    width: 45%;
    .question-instructions {
      margin-left: 1em;
    }
    .question-choice {
      padding: 1em;
      padding-left: 3em;
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
  }
  #person-and-speech-bubble-wrapper {
    width: 55%;
    position: relative;
    .speech-bubble {
      position: absolute;
      left: 40%;
      top: 15%;
      width: 40%;
      background: white;
      padding: 1.5em 2em;
      box-shadow: $box-shadow;
      border-radius: 30px;

      &.feedback-bubble {
        padding-bottom: 4.5em;
        .button {
          position: absolute;
          right: 2em;
          margin-top: 2em;
        }
      }

      &::after {
        content: "";
        border-top: 20px solid transparent;
        border-bottom: 20px solid transparent;
        border-right: 30px solid white;
        display: block;
        position: absolute;
        left: -29px;
        top: 28px;
      }
      &::before {
        content: "";
        border-top: 22px solid transparent;
        border-bottom: 22px solid transparent;
        border-right: 32px solid #e2e2e2;
        display: block;
        position: absolute;
        left: -31px;
      }
    }
    #image-wrapper {
      padding-top: 1em;
      padding-left: 1em;

      img {
        width: 265px;
      }
    }
  }
}
#step-area-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20%;
  padding-bottom: 1em;
  #step-areas {
    display: flex;

    // align-items: center;
    justify-content: space-around;
    // width: 100%;
    width: 90%;
    margin: auto;

    .step-area-bar-and-title-contaienr {
      display: flex;
      flex-direction: column;
      align-items: center;

      .step-area-title-container {
        position: relative;
        display: flex;
        align-items: center;
        .visited-icon {
          position: absolute;
          left: -1.5em;
          color: $emerald;
        }
      }

      .step-circle {
        width: 80px;
        height: 80px;
        border-radius: 100%;
        cursor: pointer;
        opacity: 0.5;
        transition: $fast-transition;
        &:hover {
          opacity: 1;
        }
        &.step-0 {
          background: rgb(89, 75, 159);
        }
        &.step-1 {
          background: rgb(191, 31, 74);
        }
        &.step-2 {
          background: rgb(172, 129, 45);
        }
        &.step-3 {
          background: rgb(0, 78, 108);
        }
        &.step-4 {
          background: rgb(175, 120, 129);
        }
        &.step-5 {
          background: rgb(234, 176, 100);
        }
      }
    }
    .step-area {
      display: flex;
      align-items: center;
      flex-grow: 1;
      &.step-area-5 {
        flex-grow: 0;
      }
      .step-area-gray-bar-container {
        flex-grow: 1;
        .step-area-gray-bar {
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
</style>
