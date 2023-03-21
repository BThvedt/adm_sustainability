<template>
  <div
    id="jira"
    @click="reportIssue"
    @mousedown="mousedownFcn"
    @mouseup="mouseupFcn"
    @mouseleave="mouseupFcn"
    :class="{ mousedown: mousedown }"
  >
    <p>Report Issue</p>
  </div>
</template>

<script>
import Vue from "vue"
export default Vue.extend({
  name: "JiraButton",
  data() {
    return {
      mousedown: false,
    }
  },
  methods: {
    mousedownFcn() {
      this.mousedown = true
    },
    mouseupFcn() {
      this.mousedown = false
    },
    reportIssue() {
      // only one module.. so this part is unnecessary
      ///const moduleName = this.$store.getters["meta/getModuleName"]
      const currentSection = this.$store.getters["meta/getCurrentSection"]
      //const currentPage = this.$store.getters["meta/getCurrentPage"]

      const currentLocation = `${currentSection.name}`

      const jiraWindow = "jiraWindow.html" + "?loc=" + currentLocation

      window.open(jiraWindow, "_blank", "height=600px, width=750px")
    },
  },
})
</script>

<style scoped lang="scss">
#jira {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 10px;
  background-color: darkcyan;
  color: white;
  font-family: sans-serif;
  font-weight: bold;
  // box-shadow: 0px 0px 3px #777, inset 2px 2px 2px #00abab,
  //   inset -2px -2px 2px #006b6b;
  box-shadow: 0px 0px 3px #777;
  border-radius: 2px;
  transition: 0.15s all;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000;
  p {
    margin: 0;
    padding: 0;
  }
  &:hover {
    background-color: #006b6b;
    // box-shadow: inset 2px 2px 2px #008b8b, inset -2px -2px 2px #004b4b;
  }
  &.mousedown {
    transform: scale(0.95);
  }
}
</style>
