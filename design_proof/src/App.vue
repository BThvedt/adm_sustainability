<template>
  <div class="module-app-container" @click="bodyClicked">
    <div id="app" class="background-transition" :class="theSpecialPageClass">
      <transition
        :enter-active-class="TEnter.FADE_IN"
        :leave-active-class="TExit.FADE_OUT"
      >
        <div class="modalbackground" v-if="isModalShowing" />
      </transition>

      <NavMenu ref="navMenu" :key="screenResizeTicker" />

      <div id="stage" v-if="mounted && showStage">
        <!-- put menu here -->
        <transition
          :enter-active-class="'animate__animated animate__fadeIn'"
          :leave-active-class="'animate__animated animate__fadeOut'"
        >
          <div v-if="jsonLoaded && true">
            <transition
              name="nav-transition"
              :enter-active-class="transitionEnterClass"
              :leave-active-class="transitionLeaveClass"
              :mode="transitionMode"
            >
              <router-view />
            </transition>
          </div>
          <div id="lesson-loading" v-else>
            <h1 class="animate__animated animate__fadeIn">Loading...</h1>
          </div>
        </transition>

        <!-- <Navigation /> -->

        <ContinueModal
          :show="continueModalShow"
          @onClose="handleContinueClose"
        />

        <ResourcesMenu @glossaryClicked="showGlossary" />

        <GlossaryModal ref="glossaryModal" />

        <!-- <p>Current page data</p>
        <div>{{ currentPageData }}</div> -->

        <transition
          :enter-active-class="`${TEnter.FADE_IN} one-sec-delay`"
          :leave-active-class="TExit.FADE_OUT"
        >
          <div
            @click="goToNextPage"
            id="continue-container"
            v-if="currentPageData.showContinue && !onHiddenPage"
          >
            <div class="continue-button small-button button">
              <strong>Continue</strong>
            </div>
          </div>
        </transition>

        <transition
          :enter-active-class="`${TEnter.FADE_IN} `"
          :leave-active-class="TExit.FADE_OUT"
        >
          <div
            @click="goToPrevPage"
            id="back-container"
            v-if="currentPageData.showBack && !onHiddenPage"
          >
            <div class="back-button small-button button">
              <strong>Back</strong>
            </div>
          </div>
        </transition>
      </div>

      <FloatingControls />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
// import Navigation from "./components/Navigation/Navigation.vue"
import NavMenu from "@/components/Menu/NavMenu.vue"

import router from "./router"
import { RouteActions, Section } from "./store/meta/types"
import ContinueModal from "@/components/modals/ContinueModal.vue"
import { TEnter, TExit, TTimes } from "@/types"
import { bigConsoleLog } from "./lib/randomFunctions"
import FloatingControls from "@/components/editable/FloatingControls.vue"
import GlossaryModal from "@/components/modals/GlossaryModal.vue"
import ResourcesMenu from "@/components/Menu/ResourcesMenu.vue"

// oh yeah gotta change app

// dynamically load all the json up front
// keyis sectionId/pageId .. value is json
// it becomes a computed value in page wrapper
// passed to the page object
// jsonPath is an env variable
// how to destructure .. just call it json?
// make the prop say 't="json.e_xxx"' that's particular enough that a script can remove the 'e_' for the final build from both the Json and the templates
// ultimate goal is just to replace all <T t="json.e_xxx"> components with just {{json.xxx}}
// ok. Goal is to do this.. then make invoices

const transitions = {
  sectionForward: {
    enter: `${TEnter.BACK_IN_RIGHT}`,
    leave: `${TExit.FADE_OUT} ${TTimes.MEDIUM}`,
    mode: "out-in",
  },
  sectionBackward: {
    enter: `${TEnter.BACK_IN_LEFT}`,
    leave: `${TExit.FADE_OUT} ${TTimes.MEDIUM}`,
    mode: "out-in",
  },
  pageForward: {
    enter: TEnter.FADE_IN_RIGHT,
    leave: TExit.FADE_OUT_LEFT,
    mode: "",
  },
  pageBackward: {
    enter: TEnter.FADE_IN_LEFT,
    leave: TExit.FADE_OUT_RIGHT,
    mode: "",
  },
  jumpToPage: {
    enter: TEnter.ZOOM_IN_DOWN,
    leave: TExit.FADE_OUT,
    mode: "out-in",
  },
  jumpToSubSection: {
    enter: TEnter.FADE_IN,
    leave: TExit.FADE_OUT,
    mode: "",
  },
  goingBackHome: {
    enter: TEnter.FADE_IN_LEFT,
    leave: TExit.FADE_OUT,
    mode: "out-in",
  },
}

export default Vue.extend({
  //components: { Navigation, ContinueModal },

  name: "App",
  data() {
    return {
      mounted: false,
      continueModalShow: false,
      // test to see if section is greater!
      transitionEnterClass: "",
      transitionLeaveClass: "",
      transitionMode: "",
      theSpecialPageClass: "",
      interval: null as number | null,
      showStage: false,
      parentOrigin: "",
      glossaryShowing: false,
      currentPageData: {},
      // variables for module_portal
      partsLoaded: {
        text: false,
        files: false,
      },
      TEnter,
      TExit,
    }
  },
  created() {
    window.addEventListener("resize", this.resizeHandler)
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeHandler)
  },
  async mounted() {
    /*console.log("write the go to hidden page mutation next")
    console.log("and then, the menu-less boilerplate")
    alert(
      "Next, in Naviation component, make a getter for state isOnHiddenPage in meta, and hide the nav if true"
    )*/

    //await this.$store.dispatch("meta/loadMeta")

    await this.$store.dispatch("initialize")

    bigConsoleLog("Initialization Complete!")

    const moduleData = this.$store.getters["meta/getStoreBasicModuleInfo"]

    if (moduleData.resumed) {
      const lastLocation = this.$store.getters["meta/getLastLocation"]
      const firstPageRoute = this.$store.getters["meta/getFirstPageRoutePath"]

      if (lastLocation !== firstPageRoute) {
        this.continueModalShow = true // do you want to go to your last location?
      }
    }

    /*** --- Remove for delivery --- ***/
    if (process.env.VUE_APP_EDITABLE_TEXT === "true") {
      window.addEventListener("keydown", this.handleKeyPress)
      window.addEventListener("keyup", this.handleKeyUp)
    }

    // eh.. just do this every time .. in fact.. might want to move this to 'init'
    // alert("start here before going onto non navigatbale pages")
    // if (process.env.VUE_APP_RUN_MODE === "local_keyed") {
    //   // alright. Name this better 'load local keyed json' or something and use VUE_APP_JSON_PATH in the function..
    //   console.log("loading local keyed json")
    //   await this.$store.dispatch("editableText/loadLocalKeyedJson")
    // }

    if (process.env.VUE_APP_RUN_MODE === "module_portal") {
      console.log("posting message to parent window")
      parent.postMessage(
        {
          type: "ready",
          data: {
            message: "okReady",
          },
        },
        "*"
      )

      // OK. PLAN!

      // https://javascript.plainenglish.io/javascript-and-window-postmessage-a60c8f6adea9
      // https://stackoverflow.com/questions/8822907/html5-cross-browser-iframe-postmessage-child-to-parent

      this.showStage = false

      window.onmessage = null
      window.addEventListener("message", async (event) => {
        if (event.data.type === "readyRecieved") {
          console.log(
            `Ready recieved, setting parent origin to ${this.parentOrigin}`
          )

          this.parentOrigin = event.data.parentOrigin
          this.$store.dispatch(
            "editableText/setParentOrigin",
            this.parentOrigin
          )

          // now that we have the origin, signal that we're read for text data
          parent.postMessage(
            {
              type: "message",
              data: {
                message: "readyForData",
              },
            },
            this.parentOrigin
          )
        } else if (event.origin === this.parentOrigin) {
          // console.log("TIME TO PROCESS TEXT DATA")
          //await this.$store.dispatch("editableText/loadSavedJson")
          switch (event.data.type) {
            case "textData":
              await this.$store.dispatch(
                "editableText/loadSavedJson",
                event.data.textData
              )
              this.partsLoaded = { ...this.partsLoaded, text: true }

              if (this.partsLoaded.text && this.partsLoaded.files) {
                this.showStage = true
              }
              // this.showStage = true // don't want to render the stage before I get text in
              break
            case "pageData":
              this.partsLoaded = { ...this.partsLoaded, files: true }

              // gotta take care of a few things here which otherwise are done in router
              await this.$store.dispatch(
                "meta/loadPagesFromModulePortal",
                event.data.pageData
              )

              this.$store.commit("meta/initRouter")

              bigConsoleLog("done initing router")

              if (this.partsLoaded.text && this.partsLoaded.files) {
                this.showStage = true
              }
              break
            default:
              bigConsoleLog(
                `ERROR.. recieved event from module editor with type "${event.data.type}" - which is an unknown type!`
              )
              break
          }
        }
      })

      /*** --- End remove for delivery --- ***/
    } else {
      this.showStage = true
    }

    this.mounted = true

    bigConsoleLog("mounted complete")
  },
  computed: {
    isModalShowing(): boolean {
      return this.$store.getters["meta/getModalShowing"]
    },
    screenResizeTicker(): number {
      return this.$store.getters["meta/getWindowResizeTicker"]
    },
    screenDimensions: {
      get(): { width: string; height: string } {
        let { width, height } = this.$store.getters["meta/getScreenDimensions"]
        return { width: `${width}px`, height: `${height}px` }
      },
    },
    currSectionNum(): number {
      return this.$store.state.meta.currSection
    },
    currSection(): Section {
      return this.$store.getters["meta/getCurrentSection"]
    },
    currPageNum(): number {
      return this.$store.state.meta.currPage
    },
    currentPageId(): string {
      return this.$store.getters["meta/getCurrentPageId"]
    },
    routeAction(): RouteActions {
      return this.$store.getters["meta/getRouteAction"]
    },
    readyToEdit(): boolean {
      return this.$store.getters["editableText/getReadyToEdit"]
    },
    jsonLoaded(): boolean {
      // if (this.$store.getters["json/jsonLoaded"]) {
      //   bigConsoleLog("JSON LOADED")
      // }
      return this.$store.getters["meta/jsonLoaded"]
    },
    top(): number {
      // console.log(
      //   `top is ${this.$store.getters["editableText/getEditorPosition"]}`
      // )
      // return 10
      return this.$store.getters["editableText/getEditorPosition"]?.top
    },
    left(): number {
      // return 20
      return this.$store.getters["editableText/getEditorPosition"]?.left
    },
    onHiddenPage(): boolean {
      return this.$store.getters["meta/isOnHiddenPage"]
    },
  },
  methods: {
    resizeHandler(e: any) {
      // console.log("Ive been resized")
      // console.log(e)
      this.$store.commit("meta/incrementResizeTicker")
    },
    goToNextPage() {
      this.$store.dispatch("meta/goForward")
    },
    goToPrevPage() {
      this.$store.dispatch("meta/goBackward")
    },
    showGlossary() {
      // this.glossaryShowing = true
      ;(this.$refs["glossaryModal"] as any).show()
      this.$store.dispatch("meta/closeMenu")
    },
    handleContinueClose(shouldContinue: boolean) {
      this.continueModalShow = false

      if (shouldContinue) {
        // I think currently the initialize function loads this page by default ..
        // wonder if that is best behavior or if it should load 1st page by default
        // would have to manually just push the 1st page without mutating last locaiotn
        // and then if not continue.. mutate the last location to the first page then
        const lastLocation = this.$store.getters["meta/getLastLocation"]

        this.$store.dispatch("meta/goToPath", lastLocation)
      } else {
        this.$store.dispatch("meta/goToPage", { sectionIndex: 0, pageIndex: 0 })
      }
    },
    handleKeyPress(e: KeyboardEvent) {
      if (e.key === "Control" && !this.readyToEdit) {
        this.$store.dispatch("editableText/readyToEdit")
      }
    },
    handleKeyUp(e: KeyboardEvent) {
      if (e.key === "Control") {
        this.$store.dispatch("editableText/stopEditing")
      }
    },
    bodyClicked(e: KeyboardEvent) {
      console.log("ive been clicked")
      // let moduleEditorDomain =
      //   this.$store.getters["editableText/getModuleEditorDomain"]
      // parent.postMessage(
      //   {
      //     type: "clicked",
      //     data: {
      //       message: "iveBeenClicked",
      //     },
      //   },
      //   moduleEditorDomain
      // )
      if (process.env.VUE_APP_RUN_MODE === "module_portal") {
        parent.postMessage(
          {
            type: "clicked",
            data: {
              message: "iveBeenClicked",
            },
          },
          this.parentOrigin
        )
      }
    },
  },
  watch: {
    currentPageId(newval): void {
      if (newval === "9Mq8Y4Hv" || newval === "xAtc7ozA") {
        setTimeout(() => {
          this.theSpecialPageClass =
            this.$store.getters["meta/getPageSpecialClass"]
        }, 1000)
      } else {
        this.theSpecialPageClass =
          this.$store.getters["meta/getPageSpecialClass"]
      }

      this.$nextTick(() => {
        this.currentPageData = this.$store.getters["meta/getPageData"]
      })
    },
    routeAction(to, from): void {
      switch (to) {
        case RouteActions.PAGING_FORWARD:
          this.transitionEnterClass = transitions.pageForward.enter
          this.transitionLeaveClass = transitions.pageForward.leave
          this.transitionMode = transitions.pageForward.mode
          break
        case RouteActions.PAGING_BACKWARD:
          this.transitionEnterClass = transitions.pageBackward.enter
          this.transitionLeaveClass = transitions.pageBackward.leave
          this.transitionMode = transitions.pageBackward.mode
          break
        case RouteActions.GOING_TO_NEXT_SECTION:
          this.transitionEnterClass = transitions.sectionForward.enter
          this.transitionLeaveClass = transitions.sectionForward.leave
          this.transitionMode = transitions.sectionForward.mode
          break
        case RouteActions.GOING_TO_PREV_SECTION:
          this.transitionEnterClass = transitions.sectionBackward.enter
          this.transitionLeaveClass = transitions.sectionBackward.leave
          this.transitionMode = transitions.sectionBackward.mode
          break
        case RouteActions.JUMPING_TO_PAGE:
          this.transitionEnterClass = transitions.jumpToPage.enter
          this.transitionLeaveClass = transitions.jumpToPage.leave
          this.transitionMode = transitions.jumpToPage.mode
          break
        case RouteActions.GOING_BACK_HOME:
          this.transitionEnterClass = transitions.goingBackHome.enter
          this.transitionLeaveClass = transitions.goingBackHome.leave
          break
        case RouteActions.GOING_TO_HIDDEN_PAGE:
          this.transitionEnterClass = transitions.jumpToPage.enter
          this.transitionLeaveClass = transitions.jumpToPage.leave
          this.transitionMode = transitions.jumpToPage.mode
          break
        case RouteActions.JUMPING_TO_SUBSECTION:
          this.transitionEnterClass = transitions.jumpToSubSection.enter
          this.transitionLeaveClass = transitions.jumpToSubSection.leave
          this.transitionMode = transitions.jumpToSubSection.mode
          break
        case RouteActions.RETURNING_FROM_HIDDEN_PAGE:
          this.transitionEnterClass = transitions.jumpToPage.enter
          this.transitionLeaveClass = transitions.jumpToPage.leave
          this.transitionMode = transitions.jumpToPage.mode
          break
      }
    },
  },
  components: {
    // Navigation,
    NavMenu,
    ContinueModal,
    FloatingControls,
    GlossaryModal,
    ResourcesMenu,
  },
})
</script>

<style lang="scss">
.modalbackground {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
}
.module-app-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  // background: linear-gradient(
  //   0deg,
  //   rgba(255, 255, 255, 1) 0%,
  //   rgba(41, 201, 242, 1) 100%
  // );
  box-sizing: border-box;
  overflow: hidden;
}

#app {
  // display: flex;
  // align-items: center;
  // flex-direction: column;
  height: 100vh;
}
#stage {
  position: relative;
  // outline: 1px solid black;
  //background: #f5f5f5;
  border-radius: 2px;
  max-width: 1536px;
  max-height: 768px;
  min-width: 1000px;
  min-height: 640px;
  width: 100%;
  height: 100%;
  margin: auto;
}
#lesson-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
#continue-container {
  z-index: 0;
  position: absolute;
  right: 2em;
  bottom: 1.2em;
}
#back-container {
  z-index: 0;
  position: absolute;
  left: 2em;
  bottom: 1.2em;
}
.one-sec-delay {
  animation-delay: 1s;
}
</style>
