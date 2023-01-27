<template>
  <PageBase>
    <div id="activity-two" class="module-page-container">
      <E id="page-header" :h="json.e_prompt" t="h3" class="header" />
      <div id="choice-container">
        <div
          class="choice"
          v-for="(person, index) in people"
          :key="person.id"
          :class="`choice-${index}`"
        >
          <transition :leave-active-class="TExit.FADE_OUT">
            <div
              v-if="chosenIndex === -1 || chosenIndex === index"
              class="img-and-button-wrapper"
            >
              <img
                class="selected-category-display-image"
                :src="require(`@/assets/images/${person.image}`).default"
              />
              <E :h="person.title" t="h3" class="header" />
              <transition :leave-active-class="TExit.FADE_OUT">
                <div
                  v-if="chosenIndex === -1"
                  class="button"
                  @click="choose(index)"
                >
                  <E :h="person.e_buttontext" t="h3" />
                </div>
              </transition>
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
import { TEnter, TExit, TTimes, TAttnSeek } from "@/types"
import { genericAwait } from "@/lib/randomFunctions"

export default Vue.extend({
  name: "Menu",
  components: { PageBase, E },
  data() {
    return {
      chosenIndex: -1,
      choiceMade: false,
      people: this.json.people,
      TEnter,
      TExit,
      TTimes,
    }
  },
  methods: {
    async choose(index: number) {
      this.chosenIndex = index
      await genericAwait(1000)
      this.$store.dispatch("meta/goForward")
    },
  },
  props: ["json"],
})
</script>

<style scoped lang="scss">
#activity-two {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
#page-header {
  font-weight: normal;
  font-style: italic;
  text-align: center;
  margin: 0;
  padding: 0;
  margin-bottom: 1%;
}
#choice-container {
  display: flex;
  height: 80%;
  width: calc(100% - 3em);
  justify-content: center;
  .choice {
    margin: 1.5%;
    margin-top: 2%;
    &.choice-1,
    &.choice-2 {
      user-select: none;
      cursor: not-allowed;
      opacity: 0.5;
      filter: grayscale(100);
    }
  }
  .img-and-button-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    img {
      height: 50%;
    }
  }
}
</style>
