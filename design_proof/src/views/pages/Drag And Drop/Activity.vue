<template>
  <PageBase>
    <div class="module-page-container">
      <transition
        :enter-active-class="TEnter.FADE_IN"
        :leave-active-class="TExit.FADE_OUT"
        mode="out-in"
      >
        <div
          id="final-feeback-section"
          v-if="showFinalFeedback && !completelyDone"
          key="finalFeedback"
        >
          <E
            class="feedback-heading header"
            t="h1"
            :h="finalFeedback.e_title"
          />
          <E class="feedback-text" t="h1" :h="finalFeedback.e_text" />
          <div @click="finish" class="button small-button">
            <E :h="finalFeedback.e_button" t="span" />
          </div>
        </div>
        <div
          id="drag-and-drop-section"
          v-if="!showFinalFeedback"
          key="dragAndDrop"
        >
          <div id="top-section">
            <transition
              :enter-active-class="TEnter.FADE_IN"
              :leave-active-class="TExit.FADE_OUT"
              mode="out-in"
            >
              <div id="feedback-section" v-if="showFeedback" key="feedback">
                <h1 class="feedback-heading header" v-if="correct">Correct</h1>
                <h1 class="feedback-heading header" v-if="!correct">
                  Incorrect
                </h1>
                <E :h="theFeedback" t="h1" class="feedback-text" />

                <div @click="moveOn" class="button small-button">
                  <span>Continue</span>
                </div>
              </div>
              <div id="drag-areas" v-else key="dragNdrop">
                <transition
                  :enter-active-class="TEnter.FADE_IN"
                  :leave-active-class="TExit.FADE_OUT"
                >
                  <div>
                    <E
                      id="page-header"
                      :h="json.e_prompt"
                      t="h2"
                      class="header small-text drag-and-drop-title"
                    />

                    <template v-for="(dragArea, i) in dragAreas">
                      <div
                        class="draggable-item-wrapper"
                        :key="dragArea.id"
                        v-if="i === 0"
                      >
                        <Drag
                          class="drag-class"
                          :data="dragArea"
                          dropAreas
                          @dragstart="setDragging(dragArea.id)"
                          @dragend="stopDragging()"
                          :class="{
                            hidden: iconIdBeingDragged === dragArea.id,
                          }"
                          go-back
                        >
                          <img
                            class="menu-item-image"
                            :src="
                              require(`@/assets/images/DragDrop/${dragArea.icon}`)
                                .default
                            "
                          />
                        </Drag>
                        <E
                          class="drag-description"
                          :h="dragArea.e_text"
                          t="p"
                        />
                      </div>
                    </template>
                  </div>
                </transition>
              </div>
            </transition>
          </div>

          <div id="bottom-section">
            <Drop
              class="drop-area"
              :class="`${iconIdBeingDragged ? 'drag-in-progress' : 'no-drag'} ${
                dropAreaJustDroppedOnId === dropArea.id
                  ? 'dropped-on'
                  : 'not-dropped-on'
              } ${
                correct && dropAreaJustDroppedOnId === dropArea.id
                  ? 'correct'
                  : dropAreaJustDroppedOnId === dropArea.id
                  ? 'incorrect'
                  : ''
              }`"
              v-for="dropArea in dropAreas"
              :key="dropArea.id"
              @drop="onDrop($event, dropArea.id)"
            >
              <transition :leave-active-class="TExit.FADE_OUT">
                <font-awesome-icon
                  v-if="
                    showFeedback &&
                    !correct &&
                    dropAreaJustDroppedOnId === dropArea.id
                  "
                  icon="times"
                  class="icon"
                />
              </transition>
              <template v-for="dragArea in dragAreas">
                <transition
                  :leave-active-class="`${TExit.FADE_OUT} ${TTimes.FAST}`"
                  :key="dragArea.id"
                >
                  <div
                    class="dropped-item"
                    v-if="
                      areaJustDroppedId === dragArea.id &&
                      dropAreaJustDroppedOnId === dropArea.id
                    "
                  >
                    <img
                      class="menu-item-image"
                      :src="
                        require(`@/assets/images/DragDrop/${dragArea.icon}`)
                          .default
                      "
                    />
                  </div>
                </transition>
              </template>
              <E class="drop-area-title" :h="dropArea.e_title" t="h3" />

              <transition
                :enter-active-class="`${TEnter.FADE_IN} delay-half-sec`"
              >
                <E
                  class="drop-area-subtitle header"
                  :h="dropArea.e_subtitle"
                  t="h3"
                  v-if="!(dropAreaJustDroppedOnId === dropArea.id)"
                />
              </transition>

              <transition
                :enter-active-class="`${TEnter.FADE_IN} delay-half-sec`"
              >
                <E
                  class="drop-area-description"
                  :h="dropArea.e_description"
                  t="p"
                  v-if="!(dropAreaJustDroppedOnId === dropArea.id)"
                />
              </transition>
            </Drop>
          </div>
        </div>
      </transition>
    </div>
  </PageBase>
</template>

<script lang="ts">
import Vue from "vue"
import PageBase from "@/components/PageBase.vue"
import { Drag, Drop } from "vue-easy-dnd"
import { TEnter, TExit, TTimes } from "@/types"
import { genericAwait } from "@/lib/randomFunctions"
import E from "@/components/editable/E.vue"

// wDx4QE90

export default Vue.extend({
  name: "NewDragAndDrop",
  data() {
    return {
      dragAreas: this.json.toolDraggables,

      dropAreas: this.json.toolDropAreas,

      areaJustDroppedId: null as number | null,
      dropAreaJustDroppedOnId: null as number | null,

      theFeedback: "",
      showFeedback: false,
      correct: null as boolean | null,

      iconIdBeingDragged: null as number | null,

      finalFeedback: this.json.finalFeedback,
      showFinalFeedback: false,
      completelyDone: false,

      TEnter,
      TExit,
      TTimes,
    }
  },
  async mounted() {
    console.log("thing")
  },
  methods: {
    async finish() {
      this.completelyDone = true
      await genericAwait(1000)

      this.$store.dispatch("meta/unlockLessonPart", {
        lesson: "whatsInScope",
        part: 2, // zero indexed remember
      })

      this.$store.dispatch("meta/goForward")
    },
    onDrop(e: any, dropAreaJustDroppedOnId: number) {
      let { data: areaJustDropped } = e
      this.areaJustDroppedId = areaJustDropped.id
      this.dropAreaJustDroppedOnId = dropAreaJustDroppedOnId

      this.correct = areaJustDropped.correctDropArea === dropAreaJustDroppedOnId
      this.showFeedback = true

      if (this.correct) {
        this.theFeedback = areaJustDropped.feedback.e_correct
      } else {
        this.theFeedback = areaJustDropped.feedback.e_incorrect
      }
    },
    moveOn() {
      this.showFeedback = false

      let itemIndex = this.dragAreas.findIndex((area: any) => {
        return area.id === this.areaJustDroppedId
      })
      if (this.correct) {
        // splice  it from dragAreas
        this.dragAreas.splice(itemIndex, 1)
      } else {
        // put it back in drag areas at the end of the array
        let theAreaJustDropped = structuredClone(this.dragAreas[itemIndex])
        this.dragAreas.splice(itemIndex, 1)
        this.dragAreas.push(theAreaJustDropped)
      }

      if (this.dragAreas.length) {
        this.dropAreaJustDroppedOnId = null
        this.areaJustDroppedId = null
        this.showFeedback = false
        this.theFeedback = ""
      } else {
        this.showFinalFeedback = true
      }
    },
    setDragging(data: number) {
      setTimeout(() => {
        this.iconIdBeingDragged = data
      }, 40)
    },
    stopDragging() {
      setTimeout(() => {
        this.iconIdBeingDragged = null
      }, 500) // oof
    },
  },
  props: ["json"],
  components: { PageBase, Drop, Drag, E },
})
</script>

<style scoped lang="scss">
#drag-and-drop-section {
  height: 100%;
  box-sizing: border-box;
  width: 100%;
}
#final-feeback-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  h1 {
    font-size: 1em;
  }
}
.feedback-text {
  color: black;
  font-weight: normal;
  font-style: italic;
  margin-bottom: 1em;
  font-size: 1em;
  font-family: $cali;
}
#top-section {
  // background-color: rgba(255, 0, 0, 0.1);
  height: 50%;
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  .drag-and-drop-title {
    font-style: italic;
    margin-top: 0;
    text-align: center;
  }
  #feedback-section,
  #drag-areas {
    position: absolute;
  }
  #feedback-section {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    .feedback-heading {
      font-size: 1em;
    }
  }
  #drag-areas {
    display: flex;
    justify-content: center;
    width: 100%;
    // background-color: rgba(255, 255, 0, 0.1);
  }
  .draggable-item-wrapper {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 100%;
    .drag-description {
      width: 60%;
      color: #6d6e71;
      background: white;
      // box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.15);
      padding: 1.6em;
      box-sizing: border-box;
      border-radius: 40px 0;
      font-size: 1em;
      position: relative;
      bottom: 25px;
      text-align: center;
      z-index: 0;
    }
  }
}
// #bottom-section {
//   // background-color: rgba(0, 255, 0, 0.1);
// }

.drag-class {
  background: white;
  font-size: 2em;
  border-radius: 100%;
  // box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.15);
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 8px solid #8bc400;
  z-index: 1;
  &.hidden {
    opacity: 0;
  }
  .menu-item-image {
    height: 75px;
    display: block;
    position: relative;
    bottom: 3%;
    left: 3%;
  }
}

#bottom-section {
  display: flex;
  justify-content: center;
  height: 50%;
  box-sizing: border-box;
  padding: 1.5em;
  .drop-area {
    height: 100%;
    width: 27%;
    transform: scale(0.95) skew(-20deg);
    border-radius: 15px;
    background: $darkBlue;
    color: white;
    // box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.15);
    border: 1px solid #d2d2d2;
    border-radius: 40% 4%;
    text-align: center;
    margin-left: 30px;
    margin-right: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: 300ms all;
    position: relative;
    border: 2px solid transparent;
    overflow: hidden;
    // box-shadow: inset 0px 6px 12px rgba(0, 0, 0, 0.25);
    .icon {
      color: red;
      position: absolute;
      font-size: 5em;
      transform: skew(20deg);
      padding-bottom: 0.4em;
      z-index: 10;
    }

    &:hover {
      transform: scale(1.05) skew(-20deg);
    }
    &.no-drag:not(.dropped-on) {
      &:hover {
        cursor: pointer;
        background: white;
        color: $gray;
        box-shadow: inset 5px 5px 5px rgba(0, 0, 0, 0.2);
        border: 2px solid $green;
        .drop-area-title {
          top: 25%;
          color: $green;
        }
        .drop-area-subtitle {
          top: 35%;
        }
        .drop-area-description {
          top: 47%;
          color: $gray;
        }
      }
    }
    &.dropped-on {
      background: white;
      .drop-area-title {
        top: 75% !important;
        color: $gray;
      }
      .drop-area-subtitle {
        display: none;
      }
      .drop-area-description {
        display: none;
      }
      &:hover {
        transform: scale(0.95) skew(-20deg);
      }
    }
    &.correct {
      border: 2px solid $green;
    }
    &.incorrect {
      border: 2px solid $red;
    }
    h3,
    .dropped-item {
      transform: skew(20deg);
      img {
        width: 75px;
        position: relative;
        bottom: 15%;
      }
    }
    .drop-area-title,
    .drop-area-subtitle,
    .drop-area-description {
      position: absolute;
      transition-property: top;
      transition-delay: 0s;
      transition-duration: 0.5s;
      margin: 0;
    }

    .drop-area-title {
      top: 45%;
    }
    .drop-area-subtitle {
      top: 55%;
    }
    .drop-area-description {
      top: 67%;
      color: $darkBlue;
      width: 80%;
    }
  }
}
.delay-half-sec {
  animation-delay: 1s;
}
</style>
