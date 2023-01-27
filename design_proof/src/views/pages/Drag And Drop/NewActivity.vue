<template>
  <PageBase>
    <div id="drag-and-drop-section" class="module-page-container">
      <div id="top-section">
        <div id="feedback-section" v-if="showFeedback">
          <h1 v-if="correct">Correct</h1>
          <h1 v-if="!correct">Incorrect</h1>
          <p>{{ theFeedback }}</p>
          <button @click="moveOn">Continue</button>
        </div>
        <div id="drag-areas">
          <Drag
            class="drag-class"
            v-for="dragArea in dragAreas"
            :data="dragArea"
            :key="dragArea.id"
            dropAreas
            go-back
          >
            <p>{{ dragArea.text }}</p>
          </Drag>
        </div>
      </div>
      <div id="drop-areas">
        <Drop
          class="drop-area"
          v-for="dropArea in dropAreas"
          :key="dropArea"
          @drop="onDrop($event, dropArea)"
        >
          <template v-for="dragArea in dragAreas">
            <div
              class="drag-class"
              v-if="
                areaJustDroppedId === dragArea.id &&
                dropAreaJustDroppedOnId === dropArea
              "
              :key="dragArea.id"
            >
              <p>{{ dragArea.text }}</p>
            </div>
          </template>
        </Drop>
      </div>
    </div>
  </PageBase>
</template>

<script lang="ts">
import Vue from "vue"
import PageBase from "@/components/PageBase.vue"
import { Drag, Drop } from "vue-easy-dnd"

// wDx4QE90

export default Vue.extend({
  name: "NewDragAndDrop",
  data() {
    return {
      dragAreas: [
        {
          id: 1,
          correctArea: 1,
          text: "one",
          correctFeedback: "correct - one",
          incorrectFeedback: "incoorect - one",
        },
        {
          id: 2,
          correctArea: 3,
          text: "two",
          correctFeedback: "correct - two",
          incorrectFeedback: "incoorect - two",
        },
        {
          id: 3,
          correctArea: 2,
          text: "three",
          correctFeedback: "correct - three",
          incorrectFeedback: "incoorect - three",
        },
        {
          id: 4,
          correctArea: 2,
          text: "four",
          correctFeedback: "correct - four",
          incorrectFeedback: "incoorect - four",
        },
        {
          id: 5,
          correctArea: 1,
          text: "five",
          correctFeedback: "correct - five",
          incorrectFeedback: "incoorect - five",
        },
      ],
      dropAreas: [1, 2, 3],

      areaJustDroppedId: null as number | null,
      dropAreaJustDroppedOnId: null as number | null,

      theFeedback: "",
      showFeedback: false,
      correct: null as boolean | null,
    }
  },
  async mounted() {
    console.log("thing")
  },
  methods: {
    onDrop(e: any, dropAreaJustDroppedOnId: number) {
      let { data: areaJustDropped } = e
      this.areaJustDroppedId = areaJustDropped.id
      this.dropAreaJustDroppedOnId = dropAreaJustDroppedOnId

      this.correct = areaJustDropped.correctArea === dropAreaJustDroppedOnId
      this.showFeedback = true

      if (this.correct) {
        this.theFeedback = areaJustDropped.correctFeedback
      } else {
        this.theFeedback = areaJustDropped.incorrectFeedback
      }
    },
    moveOn() {
      this.showFeedback = false

      let itemIndex = this.dragAreas.findIndex((area) => {
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

      this.showFeedback = false
      this.areaJustDroppedId = null
      this.dropAreaJustDroppedOnId = null
      this.theFeedback = ""
    },
  },
  components: { PageBase, Drop, Drag },
})
</script>

<style scoped lang="scss">
#drag-areas {
  display: flex;
  justify-content: center;
}
.drag-class {
  background: white;
  width: 75px;
  height: 75px;
  margin: 1em;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
}

#drop-areas {
  display: flex;
  justify-content: center;
  .drop-area {
    width: 120px;
    height: 120px;
    border: 1px solid black;
    margin: 1em;
  }
}
</style>
