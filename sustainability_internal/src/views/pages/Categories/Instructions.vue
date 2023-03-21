<template>
  <PageBase>
    <div id="intro-page-two" class="module-page-container text-image-page">
      <E :h="json.e_title" t="h1" class="big-title" />
      <E :h="json.e_subtitle" t="h2" class="big-subtitle" />
      <div id="image-and-text">
        <div id="text-part">
          <transition
            :enter-active-class="TEnter.FADE_IN"
            :leave-active-class="TExit.FADE_OUT"
            mode="out-in"
          >
            <div class="text-container-one" key="1" v-if="part === 1">
              <E :h="json.e_listtitle" t="h3" class="header" />
              <E :h="json.e_list" t="div" />
              <transition
                :enter-active-class="TEnter.FADE_IN_UP"
                :leave-active-class="TExit.FADE_OUT"
              >
                <div
                  @click="goToNextPart"
                  v-show="showNext"
                  id="next-container"
                >
                  <div class="button next-button small-button">
                    <strong><E :h="json.e_nextButton" t="p" /></strong>
                  </div>
                </div>
              </transition>
            </div>
            <div class="text-container-two" key="2" v-else>
              <E :h="json.e_listtitle" t="h3" class="header" />
              <!-- <E :h="json.e_list_two" t="div" /> -->
              <E :h="json.e_list_part_two" t="div" />
              <E :h="json.e_text" t="div" />
              <transition
                :enter-active-class="TEnter.FADE_IN_UP"
                :leave-active-class="TExit.FADE_OUT"
              >
                <div
                  @click="goToNextPage"
                  v-show="showStart"
                  id="start-container"
                >
                  <div class="button next-button small-button">
                    <strong><E :h="json.e_continueButton" t="p" /></strong>
                  </div>
                </div>
              </transition>
            </div>
          </transition>
        </div>
        <div id="image-part">
          <div id="the-images">
            <transition
              :enter-active-class="TEnter.FADE_IN"
              :leave-active-class="TExit.FADE_OUT"
            >
              <img
                v-if="image === 1"
                key="1"
                class="instruction-image"
                :src="
                  require('@/assets/images/categories/instructions_1.jpg')
                    .default
                "
              />
              <img
                v-else-if="image === 2"
                key="2"
                class="instruction-image"
                :src="
                  require('@/assets/images/categories/instructions_2.jpg')
                    .default
                "
              />
              <img
                v-else-if="image === 3"
                key="3"
                class="instruction-image"
                :src="
                  require('@/assets/images/categories/instructions_3.jpg')
                    .default
                "
              />
            </transition>
          </div>

          <div id="the-controls-container">
            <div id="the-controls">
              <font-awesome-icon
                icon="arrow-left"
                class="step-image-control"
                @click="prevImage"
              />
              Step {{ image }}
              <font-awesome-icon
                icon="arrow-right"
                class="step-image-control"
                @click="nextImage"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="button large-button" @click="goToNextPage">
          <E :h="json.e_continueButton" t="p" />
        </div> -->
      <!-- <transition
        :enter-active-class="TEnter.FADE_IN_UP"
        :leave-active-class="TExit.FADE_OUT"
      >
        <div @click="goToNextPage" v-show="showStart" id="continue-container">
          <div class="button continue-button small-button">
            <strong><E :h="json.e_continueButton" t="p" /></strong>
          </div>
        </div>
      </transition> -->
    </div>
  </PageBase>
</template>

<script lang="ts">
import Vue from "vue"
import PageBase from "@/components/PageBase.vue"
import { TEnter, TExit, TTimes, TAttnSeek } from "@/types"

import E from "@/components/editable/E.vue"
import { genericAwait } from "@/lib/randomFunctions"

export default Vue.extend({
  name: "Menu",
  components: { PageBase, E },
  data() {
    return {
      showNext: false,
      showStart: false,
      part: 1,
      image: 1,
      TEnter,
      TExit,
    }
  },
  mounted() {
    setTimeout(() => {
      this.showNext = true
    }, 1000)
  },
  methods: {
    nextImage() {
      if (this.image < 3) {
        this.image++
      } else {
        this.image = 1
      }
    },
    prevImage() {
      if (this.image > 1) {
        this.image--
      } else {
        this.image = 3
      }
    },
    async goToNextPart() {
      this.part = 2
      await genericAwait(1500)
      this.showStart = true
    },
    goToNextPage() {
      // unlock the next section
      this.$store.dispatch("meta/unlockLessonPart", {
        lesson: "whatsInScope",
        part: 1, // zero indexed remember
      })

      this.$store.dispatch("meta/goForward")
    },
  },
  props: ["json"],
})
</script>

<style scoped lang="scss">
.text-image-page {
  display: flex;
  flex-direction: column;
  .big-title {
    margin-top: 0;
    margin-bottom: 0.3em;
  }
  .big-subtitle {
    margin-top: 0;
  }
  #image-and-text {
    display: flex;

    #text-part {
      .header {
        margin-top: 0;
      }
      width: 40%;
      #next-container,
      #start-container {
        margin-top: 1.5rem;
      }
      position: relative;
    }
    #image-part {
      width: 50%;
      margin-left: 5%;
      position: relative;
      height: 375px;
      .instruction-image {
        width: 100%;
        position: absolute;
      }
    }
    #the-controls-container {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: center;
      margin-top: 0.5rem;
      position: absolute;
      bottom: 0;

      #the-controls {
        width: 30%;
        display: flex;
        justify-content: space-around;
        align-items: center;

        .step-image-control {
          color: $darkBlue;

          cursor: pointer;
          &:hover {
            color: $buttonHover;
          }
        }
      }
    }
  }
  .text-container-one,
  .text-container-two {
    // margin-top: 3%;
    position: absolute;
    margin-bottom: 2.5%;
  }

  // .right-side {
  //   width: 50%;
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  //   img {
  //     width: 90%;
  //   }
  // }
  #continue-container {
    right: 4.5em;
    bottom: 3em;
  }
}
</style>
