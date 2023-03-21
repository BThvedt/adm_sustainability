<template>
  <ModalBaseOld size="small" :modalShow="show">
    <div id="modal-content-container">
      <h2>Welcome Back, {{ userData.userName }}!</h2>
      <p>Your last login was {{ lastLogin }}</p>
      <h3>Your progress has been saved. <br />Continue where you left off?</h3>
      <div id="choice-container">
        <div class="choice-div" @click="onYesClick">
          <strong>Continue {{ lastLocation }}</strong>
        </div>
        <div class="choice-div" @click="onNoClick">
          <strong>Go Back to Start</strong>
          <span class="small-text">
            (this will not reset any saved progress)
          </span>
        </div>
      </div>
    </div>
  </ModalBaseOld>
</template>

<script lang="ts">
import Vue from "vue"
import ModalBaseOld from "@/components/ModalBaseOld.vue"
import { Section, UserData } from "@/store/meta/types"
import { bigConsoleLog } from "@/lib/randomFunctions"

export default Vue.extend({
  data() {
    return {}
  },
  computed: {
    userData(): UserData {
      return this.$store.getters["meta/getUserData"]
    },
    lastLogin(): string {
      return this.$store.getters["meta/getSuspendedData"].lastLogin
    },
    lastLocation(): string {
      let lastLocation = this.$store.getters["meta/getLastLocation"]

      // we are assuming that last location is set if this module is showing
      // right now it's just set to the first section so even tehn it should work
      if (!lastLocation) {
        bigConsoleLog(
          "ERROR shoing continue modal when last location is not set"
        )
        return ""
      } else {
        const sectionId = lastLocation.split("/")[1]
        const sections = this.$store.getters["meta/getAllSections"]
        //getAllSections
        const { name } = sections.find(({ id }: Section) => id === sectionId)
        const index = sections.findIndex(({ id }: Section) => id === sectionId)
        return `From Section ${index}: ${name} `
      }
    },
  },
  methods: {
    onNoClick() {
      this.$emit("onClose", false)
    },
    onYesClick() {
      this.$emit("onClose", true)
    },
  },
  props: {
    show: Boolean,
  },
  components: { ModalBaseOld },
})
</script>

<style scoped lang="scss">
#modal-content-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 75%;
  position: relative;
  bottom: 5%;
  h2 {
    margin-bottom: 0;
  }
  h3 {
    text-align: center;
    margin: 0;
  }
  #choice-container {
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    width: 100%;
    button {
      font-size: 16px;
      padding: 10px;
      width: 75px;
      cursor: pointer;
    }

    .choice-div {
      background: rgb(239, 239, 239);
      border: 1px solid rgb(133, 133, 133);
      font-size: 16px;
      padding: 10px;
      cursor: pointer;
      display: flex;
      justify-content: space-around;
      flex-direction: column;
      width: 100%;
      margin-top: 2em;
      text-align: center;
      transition: 0.15s all;
      user-select: none;
      .small-text {
        font-size: 14px;
      }
      &:hover {
        background: rgb(219, 219, 219);
        border: 1px solid rgb(118, 118, 118);
      }
    }
  }
}
</style>
