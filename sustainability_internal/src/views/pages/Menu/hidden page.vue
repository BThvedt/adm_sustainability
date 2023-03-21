<template>
  <PageBase>
    <div id="page-b" class="module-page-container">
      <h1>THIS IS THE HIDDEN PAGE YAY</h1>
      <E :h="json.e_title" t="h1" class="h1-class" />
      <p @click="returnBack">Go back from the page</p>
    </div>
  </PageBase>
</template>

<script lang="ts">
import Vue from "vue"
import PageBase from "@/components/PageBase.vue"
import E from "@/components/editable/E.vue"

export default Vue.extend({
  name: "Menu",
  components: { PageBase, E },
  data() {
    return {}
  },
  methods: {
    returnBack() {
      this.$store.dispatch("meta/returnFromHiddenPage")
    },
  },

  props: ["json"],
})
</script>

<style scoped lang="scss">
.tabs-container {
  display: flex;
  &.horizontal {
    flex-direction: column;
  }
  &.vertical {
    flex-direction: row;
  }
  ul {
    display: flex;
    margin: 0;
    padding: 0;
    &.horizontal {
      flex-direction: row;
    }
    &.vertical {
      flex-direction: column;
    }

    li {
      padding: 1em;
      list-style: none;
      input {
        display: none;
      }
      &.active {
        color: teal;
      }
    }
    li,
    label {
      cursor: pointer;
    }
  }
  .tabs {
    position: relative;
    &.horiztonal {
      margin-bottom: 1.5em;
    }
    &.vertical {
      padding-right: 1.5em;
      margin-right: 1.5em;
    }
    .tabs-slider {
      background-color: teal;
      position: absolute;
      bottom: 0px;
      // width: 100%;
      transition: 0.3s all;
      &.horizontal {
        bottom: 0px;
        height: 4px;
      }
      &.vertical {
        right: 0px;
        width: 4px;
      }
    }
  }
}
#page-b {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 3em;
}
</style>
