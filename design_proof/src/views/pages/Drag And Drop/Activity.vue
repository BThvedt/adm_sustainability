<template>
  <PageBase>
    <div id="drag-and-drop-section" class="module-page-container">
      <!-- <TitleAndSubTitle :title="title" :subTitle="subTitle" /> -->

      <DnDDragAreas
        :dropIsCorrect="dropIsCorrect"
        :draggables="draggables"
        :interactionPhase="interactionPhase"
        :draggableIndex="draggableIndex"
        :iconIdBeingDragged="iconIdBeingDragged"
        :clickRevealIndex="clickRevealIndex"
        :areaBeingRead="areaBeingRead"
        :incorrectText="incorrectText"
        :correctText="correctText"
        :unShuffledDraggables="unShuffledDraggables"
        :prompt="json.e_prompt"
        @dragstart="setDragging"
        @dragend="stopDragging"
        @prevClicked="prevClicked"
        @nextClicked="nextClicked"
        @tryAgain="tryAgain"
        @goToNext="goToNext"
      />

      <transition
        :enter-active-class="`${TEnter.FADE_IN}`"
        :leave-active-class="`${TExit.FADE_OUT}`"
        mode="out-in"
      >
        <h2
          class="header small-text drag-and-drop-count"
          v-if="draggableIndex >= 0 && draggableIndex + 1 <= draggables.length"
        >
          {{ draggableIndex + 1 }} / {{ draggables.length }}
        </h2>
      </transition>

      <DnDDropAreas
        :dropAreas="dropAreas"
        :areaDroppedOn="areaDroppedOn"
        :dropIsCorrect="dropIsCorrect"
        :clickRevealTracker="clickRevealTracker"
        :interactionPhase="interactionPhase"
        :grayOutAreasExceptThisOne="grayOutAreasExceptThisOne"
        :areaBeingRead="areaBeingRead"
        :areaDraggedOver="areaDraggedOver"
        :draggables="draggables"
        @drop="onDrop"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
        @click="handleClick"
      />

      <transition
        :enter-active-class="TEnter.FADE_IN_UP"
        :leave-active-class="TExit.FADE_OUT"
      >
        <div @click="finish" id="continue-container" v-if="showContinue">
          <div class="continue-button small-button">
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
import { TEnter, TExit, TTimes } from "@/types"
import { genericAwait } from "@/lib/randomFunctions"
import DnDDropAreas from "./components/DnDDropAreas.vue"
import DnDDragAreas from "./components/DnDDragAreas.vue"

const shuffle = (array: any[]) => {
  for (var x = 0; x < array.length; x++) {
    const randIndex = Math.floor(Math.random() * array.length)
    const randItem = array[randIndex]
    const thisItem = array[x]

    array[x] = randItem
    array[randIndex] = thisItem
  }

  return array
}

export default Vue.extend({
  name: "DragAndDrop",
  data() {
    return {
      introModal: this.json.introModal,
      conclusionModal: this.json.conclusionModal,
      incorrectText: this.json.incorrectText,
      correctText: this.json.correctText,
      title: this.json.e_title,
      subTitle: this.json.e_subTitle,
      dropAreas: this.json.toolDropAreas as any[],
      draggables: shuffle([...this.json.toolDraggables]),
      unShuffledDraggables: this.json.toolDraggables,
      iconIdBeingDragged: null as number | null,
      areaDraggedOver: null as number | null,
      dropIsCorrect: null as boolean | null,
      areaDroppedOn: null as number | null,
      draggableIndex: -1,
      interactionPhase: "drag-and-drop",
      TTimes,
      TEnter,
      TExit,
      grayOutAreasExceptThisOne: null as number | null,
      areaBeingRead: null as number | null,
      clickRevealTracker: [] as (boolean | null)[],
      clickRevealIndex: 0,
      showContinue: false,

      hideDrags: false,
    }
  },
  async mounted() {
    let dropAreaCopy = structuredClone(this.dropAreas)

    // console.log("TOOL DrAGGGABLES ARE")
    // console.log(this.json.toolDraggables)

    dropAreaCopy.forEach((area: any) => {
      area.droppedItemId = null
    })

    this.dropAreas = dropAreaCopy

    this.clickRevealTracker = new Array(this.draggables.length).fill(null)

    await genericAwait(1000)
    // ;(this.$refs["IntroModal"] as any).show()
    this.startLesson()
  },
  methods: {
    async startLesson() {
      // await genericAwait(1000)
      this.draggableIndex = 0
    },
    goBackHome() {
      let { currSection } = this.$store.getters["meta/getSectionAndPageIndex"]
      this.$store.dispatch("meta/markSectionComplete", currSection)
      this.$store.dispatch("meta/goHome") // goes to the home of the current role
    },
    finish() {
      // alert("you're done, son")
      // ;(this.$refs["ConclusionModal"] as any).show()
      console.log("time to finish")
    },
    prevClicked() {
      if (this.clickRevealIndex > 0) {
        this.clickRevealIndex--
      }
    },
    nextClicked() {
      if (
        this.clickRevealIndex <
        this.unShuffledDraggables[this.areaBeingRead!].e_clickRevealScreens
          .length -
          1
      ) {
        this.clickRevealIndex++

        if (
          this.clickRevealIndex ===
          this.unShuffledDraggables[this.areaBeingRead!].e_clickRevealScreens
            .length -
            1
        ) {
          this.grayOutAreasExceptThisOne = null

          if (this.clickRevealTracker.every((entry) => entry)) {
            this.showContinue = true
          }
        }
      }
    },
    handleClick(index: number) {
      if (
        this.interactionPhase === "click-reveal" &&
        this.grayOutAreasExceptThisOne === null
      ) {
        this.clickRevealIndex = 0
        this.areaBeingRead = this.dropAreas[index].accepts - 1

        this.grayOutAreasExceptThisOne = index
        this.clickRevealTracker.splice(index, 1, true)
      }
    },
    onDrop(payload: { $event: any; index: number; accepts: number }) {
      let { $event, index, accepts } = payload

      // console.log({ $event, index, accepts })

      this.areaDraggedOver = null

      this.areaDroppedOn = index
      this.dropAreas[index].droppedItemId = $event.data

      if ($event.data === accepts) {
        this.dropIsCorrect = true
        // if (this.draggableIndex < this.draggables.length - 1) {
        //   this.draggableIndex++
        // } else {
        //   this.subTitle = this.json.e_subTitle_2
        //   this.interactionPhase = "click-reveal"
        // }
      } else {
        this.dropIsCorrect = false
        this.iconIdBeingDragged = null
      }
    },
    async tryAgain() {
      this.dropIsCorrect = null
      await genericAwait(1200)
      const index = this.areaDroppedOn as number
      this.areaDroppedOn = null
      this.dropAreas[index].droppedItemId = null

      // put the draggable back in the array
      // let draggable = structuredClone(this.draggables[this.draggableIndex])
      // let newDraggables = structuredClone(this.draggables)
      // newDraggables.splice(this.draggableIndex, 1)
      // newDraggables[newDraggables.length] = draggable
      // this.draggables = newDraggables

      this.dropIsCorrect = null
      await genericAwait(1200)
    },
    async goToNext() {
      // Ok I think something is gonna have to happen here but for now just go to next page
      if (this.draggableIndex < this.draggables.length - 1) {
        this.areaDraggedOver = null

        const index = this.areaDroppedOn as number
        this.dropAreas[index].droppedItemId = null
        this.areaDroppedOn = null
        this.draggableIndex++
        this.dropIsCorrect = null
        await genericAwait(1200)
      } else {
        await genericAwait(300)
        this.$store.dispatch("meta/goForward")
      }
    },
    handleDragEnter(index: number) {
      this.areaDraggedOver = index
    },
    handleDragLeave() {
      this.areaDraggedOver = null
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
  components: {
    PageBase,
    DnDDropAreas,
    DnDDragAreas,
  },
  props: ["json"],
})
</script>

<style scoped lang="scss">
.drag-and-drop-count {
  text-align: center;
  font-weight: bold;
  position: relative;
  bottom: 1.5%;
}
#continue-container {
  position: absolute;
  right: 2em;
  bottom: 0.8em;
}
</style>
