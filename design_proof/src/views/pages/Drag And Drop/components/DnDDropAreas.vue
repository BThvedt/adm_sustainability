<template>
  <div id="drop-areas">
    <template v-for="(dropArea, i) in dropAreas">
      <Drop
        class="tool-drop-area"
        :class="{
          draggedOver:
            dropArea.droppedItemId !== dropArea.accepts &&
            areaDraggedOver === i,
          correct: dropArea.droppedItemId === dropArea.accepts,
          clickRevealPhase: interactionPhase === 'click-reveal',
          active: areaBeingRead === i,
          grayedOut:
            grayOutAreasExceptThisOne !== null &&
            grayOutAreasExceptThisOne !== i,
          selected: clickRevealTracker[i],
        }"
        :key="i"
        @drop="onDrop($event, i, dropArea.accepts)"
        @dragenter="handleDragEnter(i)"
        @dragleave="handleDragLeave(i)"
        @click="handleClick(i)"
      >
        <!-- <div
          class="drop-circle"
          :class="{ draggedOver: areaDraggedOver === i }"
          v-if="dropArea.droppedItemId === null && !clickRevealTracker[i]"
        /> -->
        <transition :leave-active-class="`${TExit.FADE_OUT}`" mode="out-in">
          <img
            v-if="
              typeof dropArea.droppedItemId === 'number' &&
              !clickRevealTracker[i]
            "
            :src="
              require(`@/assets/images/DragDrop/${getImage(
                dropArea.droppedItemId
              )}`).default
            "
          />
        </transition>
        <div class="selected-icon" v-if="clickRevealTracker[i]">
          <Icon :iconName="'check'" />
        </div>
        <div
          class="wrong-answer"
          v-if="
            areaDroppedOn === i &&
            dropIsCorrect !== true &&
            dropIsCorrect !== null
          "
        >
          <font-awesome-icon icon="times" class="icon" />
        </div>
        <E class="drag-item-title" :h="dropArea.e_title" t="h3" />
      </Drop>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { TEnter, TExit, TTimes } from "@/types"
import { Drag, Drop } from "vue-easy-dnd"
import { genericAwait } from "@/lib/randomFunctions"
import Icon from "@/components/Icon.vue"
import E from "@/components/editable/E.vue"

export default Vue.extend({
  name: "DropAreas",
  data() {
    return {
      TEnter,
      TExit,
      TTimes,
    }
  },

  methods: {
    handleDragEnter(index: number) {
      this.$emit("dragenter", index)
    },
    handleDragLeave() {
      this.$emit("dragleave")
    },
    onDrop($event: any, index: number, accepts: number) {
      console.log("EVENT IS")
      console.log($event)
      this.$emit("drop", { $event, index, accepts })
    },
    handleClick(index: number) {
      this.$emit("click", index)
    },
    getImage(droppedItemId: number): string | null {
      let draggable = this.draggables.find((draggable: any) => {
        return draggable.id === droppedItemId
      })

      if (draggable) {
        return draggable.icon
      } else {
        return null
      }
    },
  },
  components: { Drop, Icon, E },
  props: [
    "draggables",
    "dropAreas",
    "areaDroppedOn",
    "dropIsCorrect",
    "clickRevealTracker",
    "interactionPhase",
    "grayOutAreasExceptThisOne",
    "areaBeingRead",
    "areaDraggedOver",
    "draggableIndex",
  ],
})
</script>

<style scoped lang="scss">
#drop-areas {
  height: 37%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  ::v-deep .tool-drop-area {
    height: 100%;
    width: 27%;
    transform: skew(-20deg);
    border-radius: 15px;
    background: white;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.15);
    border: 1px solid #d2d2d2;
    border-radius: 40% 4%;
    text-align: center;
    margin-left: 30px;
    margin-right: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: $very-fast-transition;
    position: relative;
    box-shadow: inset 0px 6px 12px rgba(0, 0, 0, 0.25);
    h3 {
      transform: skew(20deg);
    }
    .drag-item-title {
      position: absolute;
      bottom: 13%;
      right: 5%;
      width: 105%;
    }
    &.correct {
      box-shadow: inset 0px 6px 12px $green;
      .drag-item-title {
        color: $green;
      }
    }
    &.draggedOver {
      border-color: black;
      box-shadow: inset 0px 6px 12px rgba(139, 196, 0, 0.5);
      .drag-item-title {
        color: black;
      }
      .drop-circle {
        border-color: black;
      }
    }

    &.clickRevealPhase {
      box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      &:hover {
        border-color: black;
        .drag-item-title {
          color: black;
        }
      }
      .drag-item-title {
        color: #a8a8a8;
      }
      &.grayedOut {
        &:hover {
          border-color: #d2d2d2;
          .drag-item-title {
            color: #a8a8a8;
          }
        }
      }
    }
    &.active {
      border-color: black;
      .drag-item-title {
        color: black;
      }
    }
    .wrong-answer {
      color: red;
      position: absolute;
      font-size: 5em;
      transform: skew(20deg);
      padding-bottom: 0.4em;
      .icon {
        position: relative;
        right: 5%;
      }
    }
    img {
      height: 75px;
      transform: skew(20deg);
      position: relative;
      right: 7%;
      bottom: 5%;
    }
    ::v-deep .selected-icon {
      svg {
        width: 75px;
        fill: green;
      }
    }
    &.grayedOut {
      background: #e8e8e8;
      filter: contrast(0.9);
      opacity: 0.4;
      cursor: default;
    }
    .drop-circle {
      width: 75px;
      height: 75px;
      border: 3px dashed #d2d2d2;
      border-radius: 100%;
      transition: $very-fast-transition;
      transform: skew(20deg);
      position: relative;
      right: 5%;
      top: 3%;
    }
    .drag-item-title {
      //font-family: "Roboto Condensed";
      font-weight: bold;
      //text-transform: uppercase;
      // font-size: $text-size-small;
      color: $gray;
      margin: 0;
      padding: 0;
      margin-top: 1em;
      transition: $very-fast-transition;
    }
  }
}

// fixes for editing - it's ok changing strategy next iteration
::v-deep .drag-item-title h3 {
  font-size: 1em;
  margin: 0;
  padding: 0;
}
</style>
