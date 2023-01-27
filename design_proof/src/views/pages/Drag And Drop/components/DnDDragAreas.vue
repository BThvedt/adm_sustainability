<template>
  <div id="drag-areas">
    <transition
      :enter-active-class="`${TEnter.FADE_IN}`"
      :leave-active-class="`${TExit.FADE_OUT}`"
      mode="out-in"
    >
      <div v-if="interactionPhase === 'drag-and-drop'" key="interaction-phase">
        <transition
          :enter-active-class="`${TEnter.FADE_IN}`"
          :leave-active-class="`${TExit.FADE_OUT}`"
          mode="out-in"
        >
          <div
            id="draggable-items-outer-wrapper"
            v-if="
              dropIsCorrect === null && draggableIndex <= draggables.length - 1
            "
            key="a"
          >
            <E
              id="page-header"
              :h="prompt"
              t="h2"
              class="header small-text drag-and-drop-title"
            />
            <!-- <h2 class="header small-text drag-and-drop-title">
              Drag and drop each scenario into the appropriate scope level.
            </h2> -->
            <div class="drag-icon-and-text-wrapper">
              <transition
                :enter-active-class="`${TEnter.FADE_IN_RIGHT}`"
                :leave-active-class="`${TExit.FADE_OUT_LEFT}`"
                mode="out-in"
              >
                <template v-for="(draggable, i) in draggables">
                  <div
                    class="drag-icon-and-text"
                    v-if="i === draggableIndex"
                    :key="i"
                  >
                    <div class="drag-wrapper">
                      <Drag
                        class="drag-item-class"
                        go-back
                        :data="draggable.correctDropArea"
                        @dragstart="setDragging(draggable.id)"
                        @dragend="stopDragging()"
                        :class="{
                          hidden: iconIdBeingDragged === draggable.id,
                        }"
                      >
                        <div class="drag-item-inner">
                          <img
                            :src="
                              require(`@/assets/images/DragDrop/${draggable.icon}`)
                                .default
                            "
                          />
                        </div>
                      </Drag>
                    </div>
                    <E class="drag-description" :h="draggable.e_text" t="p" />
                  </div>
                </template>
              </transition>
            </div>
          </div>

          <div v-if="dropIsCorrect === false" key="b">
            <div id="incorrect-try-again">
              <E :h="incorrectText.e_prompt" t="h1" class="header" />
              <E
                :h="draggables[draggableIndex].feedback.e_incorrect"
                t="h1"
                class="feedback-text"
              />
              <div @click="tryAgain" class="button small-button">
                <E :h="incorrectText.e_tryAgain" t="p" />
              </div>
            </div>
          </div>
          <div v-if="dropIsCorrect === true" key="c">
            <div id="correct-message">
              <E :h="correctText.e_prompt" t="h1" class="header" />
              <E
                :h="draggables[draggableIndex].feedback.e_correct"
                t="h1"
                class="feedback-text"
              />
              <div @click="goToNext" class="button small-button">
                <E :h="correctText.e_text" t="p" />
              </div>
            </div>
          </div>
        </transition>
        <!-- <h2
          class="header small-text drag-and-drop-count"
          v-if="draggableIndex >= 0"
        >
          {{ draggableIndex + 1 }} / {{ draggables.length }}
        </h2> -->
      </div>
      <div
        v-else-if="interactionPhase === 'click-reveal'"
        key="click-reveal"
        id="click-reveal-phase-draggable-items-outer-wrapper"
      >
        <div id="yet-another-wrapper-div">
          <transition
            :enter-active-class="`${TEnter.FADE_IN}`"
            :leave-active-class="`${TExit.FADE_OUT}`"
            mode="out-in"
          >
            <template v-for="(draggable, i) in unShuffledDraggables">
              <div
                class="click-reveal-drag-icon-and-text"
                :class="`draggable-${i}`"
                :key="i"
                v-if="i === areaBeingRead"
              >
                <div class="drag-wrapper">
                  <div class="drag-item-class">
                    <div class="drag-item-inner">
                      <img
                        :src="
                          require(`@/assets/images/DragDrop/${draggable.icon}`)
                            .default
                        "
                      />
                    </div>
                  </div>
                </div>
                <div class="drag-description">
                  <transition
                    :enter-active-class="`${TEnter.FADE_IN} ${TTimes.FAST}`"
                    :leave-active-class="`${TExit.FADE_OUT} ${TTimes.FAST}`"
                    mode="out-in"
                  >
                    <template
                      v-for="(screen, i) in draggable.e_clickRevealScreens"
                    >
                      <E
                        :h="draggable.e_clickRevealScreens[clickRevealIndex]"
                        v-if="clickRevealIndex === i"
                        :key="i"
                        t="p"
                      />
                    </template>
                  </transition>
                </div>
              </div>
            </template>
          </transition>
        </div>
        <transition
          :enter-active-class="`${TEnter.FADE_IN}`"
          :leave-active-class="`${TExit.FADE_OUT}`"
        >
          <div
            id="arrows-container"
            v-if="areaBeingRead !== null"
            key="arrow-container"
          >
            <div
              class="click-reveal-prev-icon"
              :class="{ inactive: clickRevealIndex === 0 }"
              @click="prevClicked"
            >
              <font-awesome-icon :icon="'arrow-left'" />
            </div>
            <div class="slide-info">
              <p>
                {{ clickRevealIndex + 1 }} of
                {{
                  unShuffledDraggables[areaBeingRead].e_clickRevealScreens
                    .length
                }}
              </p>
            </div>
            <div
              class="click-reveal-next-icon"
              @click="nextClicked"
              :class="{
                inactive:
                  clickRevealIndex ===
                  unShuffledDraggables[areaBeingRead].e_clickRevealScreens
                    .length -
                    1,
              }"
            >
              <font-awesome-icon :icon="'arrow-right'" />
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { TEnter, TExit, TTimes } from "@/types"
import { Drag } from "vue-easy-dnd"
import E from "@/components/editable/E.vue"

export default Vue.extend({
  name: "DragAreas",
  data() {
    return {
      TEnter,
      TExit,
      TTimes,
    }
  },

  methods: {
    nextClicked() {
      this.$emit("nextClicked")
    },
    prevClicked() {
      this.$emit("prevClicked")
    },
    setDragging(id: number) {
      this.$emit("dragstart", id)
    },
    stopDragging() {
      this.$emit("dragend")
    },
    tryAgain() {
      this.$emit("tryAgain")
    },
    goToNext() {
      this.$emit("goToNext")
    },
  },
  watch: {
    draggables() {
      console.log("watching draggables")
      console.log(this.draggables)
    },
  },
  components: { Drag, E },
  props: [
    "dropIsCorrect",
    "draggables",
    "interactionPhase",
    "draggableIndex",
    "iconIdBeingDragged",
    "clickRevealIndex",
    "areaBeingRead",
    "incorrectText",
    "correctText",
    "unShuffledDraggables",
    "prompt",
  ],
})
</script>

<style lang="scss">
#arrows-container {
  position: absolute;
  width: 100%;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: $very-fast-transition;
  bottom: 1em;
  .slide-info {
    // font-family: $noto;
    display: flex;
    flex-direction: column;
    align-items: center;
    p {
      margin: 0;
      padding: 0;
      min-width: 70px;
      text-align: center;
      // color: $darkGray;
    }
  }
  .click-reveal-prev-icon,
  .click-reveal-next-icon {
    font-size: 2em;
    color: $blue;
    cursor: pointer;
    margin: 0em 0.5em;
    // &:hover {
    //   color: $darkBlue;
    // }
    &.inactive {
      cursor: default;
      // color: $lightGray;
      opacity: 0.5;
      // &:hover {
      //   color: $lightGray;
      // }
    }
  }
}

#drag-areas {
  // height: 55%;
  min-height: 295px;

  position: relative;
  width: 93%;
  margin: auto;
  margin-bottom: 1%;
  #click-reveal-phase-draggable-items-outer-wrapper,
  #draggable-items-outer-wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  #yet-another-wrapper-div {
    position: relative;
    width: 90%;
    height: 93%;
    display: flex;
    bottom: 0%;

    .click-reveal-drag-icon-and-text {
      display: flex;
      position: absolute;
      height: 88%;
      overflow: hidden;
      font-size: 0.93em;
      line-height: 1.27em;
      ul li p {
        margin: 0;
        padding: 0;
      }
    }
  }

  .drag-and-drop-title {
    font-style: italic;
    margin-top: 0;
    margin-bottom: 3%;
  }

  .drag-and-drop-count {
    font-weight: bold;
    position: absolute;
    bottom: 10%;
    width: 100%;
    text-align: center;
  }

  .drag-icon-and-text-wrapper {
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 236px;
  }
  .drag-icon-and-text {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .drag-wrapper {
    width: 30%;
    display: flex;
    align-items: center;
    justify-content: center;
    .drag-item-class {
      display: block;
      color: white;
      background: white;
      font-size: 2em;
      border-radius: 100%;
      border: 1px solid #a8a8a8;
      box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.15);
      width: 120px;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 8px solid $green;

      &.hidden {
        opacity: 0;
      }
      img {
        height: 75px;
        display: block;
        position: relative;
        bottom: 3%;
        left: 3%;
      }
      z-index: 1;
    }
  }
  .drag-description {
    width: 60%;
    // color: #595959;
    color: $gray;
    background: white;
    box-shadow: $box-shadow;
    padding: 1.6em;
    box-sizing: border-box;
    border-radius: 40px 0;
    font-size: 1em;
    position: relative;
    bottom: 25px;
    text-align: center;
    z-index: 0;
  }
  // p.drag-description {
  //   font-size: 1em;
  //   position: relative;
  //   bottom: 4%;
  //   text-align: center;
  // }
  #incorrect-try-again,
  #correct-message {
    text-align: center;

    padding-top: 1em;
    h1 {
      font-size: 1em;
      font-style: normal;
      font-family: $cali;
    }
    .small-button {
      margin: auto;
    }

    .feedback-text {
      color: black;
      font-weight: normal;
      font-style: italic;
      margin-bottom: 1em;
    }
  }
}
</style>
