import { ActionTree } from "vuex"
import { RootState } from "../types"
import {
  MetaState,
  RouteActions,
  Section,
  SpecialPageStatus,
  SuspendedData,
} from "./types"
import { bigConsoleLog } from "@/lib/randomFunctions"
import jsonData from "../../json/meta.json"
import scorm from "../../scorm"
import router from "@/router"
import { ScormStatusString } from "@/types"

// scorm run time reference
// https://scorm.com/scorm-explained/technical-scorm/run-time/run-time-reference/

export const actions: ActionTree<MetaState, RootState> = {
  async loadMeta({ commit, dispatch, rootState, state }): Promise<void> {
    const { noLms } = rootState
    bigConsoleLog(`Loading metadata from ${noLms ? "JSON" : "lms"}`)

    // first load the non lms-realtated stuff into the store that this framework needs ..
    const { sizes, sections, specialPages, extraJson } = jsonData

    // need to grab a liitttttleee bit of stuff from the lms ... the bulk of it gets loaded later
    let suspendedData: SuspendedData

    if (!noLms) {
      // do not try to parse this without making sure it exists!
      const unparsedSuspendedData = scorm.get("cmi.suspend_data")

      if (!unparsedSuspendedData) {
        scorm.set("cmi.suspend_data", JSON.stringify(jsonData.suspendedData))
        suspendedData = jsonData.suspendedData
      } else {
        suspendedData = JSON.parse(unparsedSuspendedData)
      }
    } else {
      suspendedData = jsonData.suspendedData
    }

    // ok proceed with loading data and comitting
    // sectionData has the data in the form that the store wants
    const sectionsData: Section[] = sections.map((section, i) => ({
      ...section,
      locked: suspendedData.locked[i],
      // loaded: false,
    }))

    // try setting allowed paths .. this has to be done early on to work I think .. not quite sure what exactly is happening
    // initrouter down below sets the routes and componetns in the router
    const allowedPaths: string[] = []
    sectionsData.forEach((section: Section) => {
      const { pages, hiddenPages } = section
      pages.forEach(async (page) => {
        allowedPaths.push(`/${section.id}/${page.id}`)
      })
      hiddenPages?.forEach(async (page) => {
        allowedPaths.push(`/${section.id}/${page.id}`)
      })
    })

    commit("setAllowedPaths", allowedPaths)

    // this sets up the "strucure" of the course. Sizxes, the sections (and pages in the section)
    //commit("setFakeLoadingTimes", fakeLoadingTimes)
    commit("setSizes", sizes)
    commit("setSections", sectionsData)
    commit("setSpecialPages", specialPages)
    commit("setSuspendedData", suspendedData!) // yes, typescript, "suspendedData" IS assigned..

    // let's load us up some json
    // uses vue_app_json_path. If using keyed json, have to load keyed json as well.
    if (process.env.VUE_APP_RUN_MODE !== "module_portal") {
      await dispatch("loadJson", sectionsData)
      await dispatch("loadExtraJson", extraJson)
    }

    if (process.env.VUE_APP_RUN_MODE === "local_keyed") {
      // alright. Name this better 'load local keyed json' or something and use VUE_APP_JSON_PATH in the function..
      // console.log("loading local keyed json")
      await dispatch("editableText/loadLocalKeyedJson")
    }

    // in case multiple resolutions, this code will have to be completed. But that's for later
    commit("setCurrSize", sizes[0])

    // initRouter loads the paths to each page in router. Also sets the 'allowed paths' value in state
    if (process.env.VUE_APP_RUN_MODE !== "module_portal") {
      // this is done in App.vue if running in module_portal
      commit("initRouter") // got rid of payload.. sectionsData should be in state
    }
    //commit("initRouter", sectionsData)

    // now load the rest of the stuff, either from LMS or the JSON
    if (noLms) {
      const { moduleDefaults, userDefaults } = jsonData

      // last location is the trickiest
      let lastLocation: string | null = jsonData.moduleDefaults.lastLocation

      if (!lastLocation) {
        // set the first page
        const { id: sectionId } = sections[0]
        const { id: pageId } = sections[0].pages[0]

        lastLocation = `/${sectionId}/${pageId}`
      }

      commit("loadModule", {
        ...moduleDefaults,
        moduleStatus: moduleDefaults.moduleStatus as any as ScormStatusString,
        lastLocation: lastLocation ? lastLocation : undefined,
      })

      commit("setUser", userDefaults)

      // prevent redunant routing can happen on hot refreshes, etc
      if (router.currentRoute.path !== lastLocation) {
        commit("setCurrPageAndCurrSecForPath", lastLocation)
        router.push(lastLocation)
      } else {
        // might be refreshing in dev mode. still have to set currPage and curSection
        commit("setCurrPageAndCurrSecForPath", lastLocation)
      }
    } else {
      // there is AN LMS. HORRAY

      dispatch("setLastLogin")

      // ok we have suspended data

      let lastLocation = scorm.get("cmi.core.lesson_location")
      let resumed = false

      if (!lastLocation) {
        const { id: sectionId } = sections[0]
        const { id: pageId } = sections[0].pages[0]

        lastLocation = `/${sectionId}/${pageId}`

        const { moduleDefaults } = jsonData

        scorm.set("cmi.core.lesson_location", lastLocation)
        scorm.set("cmi.core.lesson_status", ScormStatusString.incomplete)
        scorm.set("cmi.core.score.raw", moduleDefaults.score.raw)
        scorm.set("cmi.core.score.max", moduleDefaults.score.max)
        scorm.set("cmi.core.score.min", moduleDefaults.score.min)

        commit("loadModule", {
          ...moduleDefaults, // moduledefaults should have the default score
          moduleStatus: ScormStatusString.incomplete, // have to use right types!
          lastLocation, // lastlocation isn't in the json
        })
      } else {
        // we must be resuming
        // get last location
        resumed = true

        const moduleStatus = scorm.get("cmi.core.lesson_status")

        // get score here.. pass it to 'set module' mutation
        const raw = parseInt(scorm.get("cmi.core.score.raw"))
        const max = parseInt(scorm.get("cmi.core.score.max"))
        const min = parseInt(scorm.get("cmi.core.score.min"))

        commit("loadModule", {
          resumed,
          moduleStatus,
          lastLocation,
          score: {
            max,
            min,
            raw,
          },
        })
      }

      // okey dokie just grab some student info ..
      const userName = scorm.get("cmi.core.student_name")
      const userId = scorm.get("cmi.core.student_id")

      commit("setUser", {
        userName,
        userId,
      })

      if (router.currentRoute.path !== lastLocation) {
        //router.push(lastLocation)
        dispatch("goToPath", lastLocation)
      }

      // console.log(lastLocation)
    }
  },
  async goForward({ commit, rootState, state, dispatch }): Promise<void> {
    const { currSection, currPage } = state

    if (currPage < state.sections[currSection].pages.length - 1) {
      dispatch("showMenu") // let individual pages control this
      dispatch("showNav") // let individual pages control this
      dispatch("enableNav") // let individual pages control this
      commit("goToNextPage")
      commit("setRouteAction", RouteActions.PAGING_FORWARD)
    } else if (currSection < state.sections.length - 1) {
      dispatch("showMenu") // let individual pages control this
      dispatch("showNav") // let individual pages control this
      dispatch("enableNav") // let individual pages control this
      commit("goToNextSection")
      commit("setRouteAction", RouteActions.GOING_TO_NEXT_SECTION)

      const newSectionId = state.sections[currSection + 1].id
      const newPageId = state.sections[currSection + 1].pages[0].id
      state.scorm.module.lastLocation = `/${newSectionId}/${newPageId}`

      const lockedArray = state.scorm.suspendedData.locked

      // console.log("going forward")

      // don't save location if in a locked section
      if (!lockedArray[currSection + 1]) {
        console.log(
          `setting last location in state /${newSectionId}/${newPageId}`
        )
        commit("setLastLocation", `/${newSectionId}/${newPageId}`)
        if (!rootState.noLms) {
          console.log(
            `setting last location in lms /${newSectionId}/${newPageId}`
          )
          scorm.set("cmi.core.lesson_location", `/${newSectionId}/${newPageId}`)
        }
      }
    }
  },
  async goBackward({ dispatch, commit, rootState, state }): Promise<void> {
    const { currSection, currPage } = state

    if (currPage > 0) {
      dispatch("showMenu") // let individual pages control this
      dispatch("enableNav") // let individual pages control this
      commit("goToPrevPage")
      commit("setRouteAction", RouteActions.PAGING_BACKWARD)
    } else if (currSection > 0) {
      dispatch("showMenu") // let individual pages control this
      dispatch("enableNav") // let individual pages control this
      commit("goToPrevSection")
      commit("setRouteAction", RouteActions.GOING_TO_PREV_SECTION)

      const newSectionId = state.sections[currSection - 1].id
      const newPageId = state.sections[currSection - 1].pages[0].id
      state.scorm.module.lastLocation = `/${newSectionId}/${newPageId}`

      // don't save location if in a locked section
      const lockedArray = state.scorm.suspendedData.locked

      // don't save location if in a locked section
      if (!lockedArray[currSection - 1]) {
        commit("setLastLocation", `/${newSectionId}/${newPageId}`)
        if (!rootState.noLms) {
          scorm.set("cmi.core.lesson_location", `/${newSectionId}/${newPageId}`)
        }
      }
    }
  },
  async goHome({ state, dispatch, commit }) {
    // dispatch("goToPage", { sectionIndex: newSection, pageIndex: newPage })

    commit("setRouteAction", RouteActions.GOING_BACK_HOME)
    commit("setAndGoToSectionAndPage", {
      sectionIndex: 0,
      pageIndex: 0,
    })
  },
  async goToHiddenPage({ commit }, pageName) {
    console.log("REMMEBER TO HIDE THE NAVE HERE.. HIDDEN PAGES DO NOT HAVE NAV")
    commit("setRouteAction", RouteActions.GOING_TO_HIDDEN_PAGE)
    commit("goToHiddenPage", { pageName })
  },
  async returnFromHiddenPage({ commit }) {
    console.log("RETURNING FROM HIDDEN PAGE")
    commit("setRouteAction", RouteActions.RETURNING_FROM_HIDDEN_PAGE)
    commit("returnFromHiddenPage")
  },
  async loadJson({ commit, rootState }, sections) {
    // load each file. Key is sectionID/pageID
    // methods getJson() (use route) or getJsonById('sectionID/pageId")

    // const json = async () => await import(`@/json/asdf/asdf`)

    for (let x = 0; x < sections.length; x++) {
      const { id: sectionID, pages, hiddenPages } = sections[x]

      for (let y = 0; y < pages.length; y++) {
        const { id: pageID } = pages[y]

        const path = `/${sectionID}/${pageID}`

        const json = (
          (await import(
            `${process.env.VUE_APP_JSON_PATH}/${sectionID}/${pageID}`
          )) as any
        ).default

        commit("addJson", { path, json })
      }

      for (let y = 0; y < hiddenPages?.length; y++) {
        const { id: pageID } = hiddenPages[y]

        const path = `/${sectionID}/${pageID}`

        const json = (
          (await import(
            `${process.env.VUE_APP_JSON_PATH}/${sectionID}/${pageID}`
          )) as any
        ).default

        commit("addJson", { path, json })
      }

      commit("jsonLoaded", true)
    }
  },
  async loadPagesFromModulePortal({ commit, rootState }, payload) {
    // console.log("TIME TO LOAD JSON FROM MODULE PORTAL")
    // console.log(payload)
    bigConsoleLog("ok start here")
    payload.forEach(({ sectionId, pageId, extraJsonFileName, json }: any) => {
      if (pageId) {
        // this is a regular page
        commit("addJson", { path: `/${sectionId}/${pageId}`, json })
      } else if (extraJsonFileName) {
        // this is a file for 'extra json'
        commit("loadExtraJson", {
          propertyName: extraJsonFileName.split(".")[0],
          extra_json: json,
        })
      }
    })
    bigConsoleLog("done loading extra json")
    commit("jsonLoaded", true)
  },
  async loadExtraJson({ commit, rootState }, extraJsonFiles) {
    for (let x = 0; x < extraJsonFiles.length; x++) {
      const extra_json = (
        (await import(
          `${process.env.VUE_APP_JSON_PATH}/${extraJsonFiles[x]}`
        )) as any
      ).default

      // get the file name
      const propertyName = extraJsonFiles[x].split(".")[0]

      commit("loadExtraJson", { propertyName, extra_json })
    }
  },
  setModuleRawScore({ state, rootState, commit }, rawScore: number) {
    // hmmm .. it is possible for rawscore to come in as a string. Thought that would cause error but what to I know
    if (typeof rawScore === "string") {
      rawScore = parseInt(rawScore)
    }

    const {
      module: { score },
    } = state.scorm
    const { max, min } = score

    if (rawScore < min || rawScore > max) {
      return
    }

    commit("setModuleRawScore", rawScore)

    const { noLms } = rootState

    if (!noLms) {
      scorm.set("cmi.core.score.raw", rawScore)
    }
  },
  setModuleStatus({ state, rootState, commit }, status: ScormStatusString) {
    console.log("SETTING MODULE STATUS")
    commit("setModuleStatus", status)

    const { noLms } = rootState

    // what doesn't work: browsed.. not_attempted
    // passed sets completeion to complete and success to past
    // complete sets completion to complete

    // when complete .. cannot set to failed, incomplete. Setting to passed works .. browsed/not_attempted doesn't
    // when incomplete.. setting to failed works. Setting to completed or passed works .. but can't go back
    // when failed .. does setting to incomplete work?

    // usual behavior.. until 'completed' or 'passed' .. a module can either be 'incomplete' or 'failed'
    // once 'completed' the completeion doesn't go back to incomplete

    // FYI scorm cloud has 3 metrics: Completion, Success, and Score
    // Success can eitehr be unknown, failed, or passed
    // completion can either be incompelte, or complete, or unknown

    // they all start out unkonwn
    // once a learner starts a course, by default it's completeion = incomplete and success = unknown

    if (!noLms) {
      console.log(`setting scorm status as ${status}`)
      scorm.set("cmi.core.lesson_status", status)
    }
  },
  async goToSubSection(
    { dispatch, commit, rootState, state },
    { pageIndex }
  ): Promise<void> {
    commit("setRouteAction", RouteActions.JUMPING_TO_SUBSECTION)
    const { currSection, currPage } = state

    if (
      pageIndex < 0 ||
      pageIndex >= state.sections[currSection].pages.length
    ) {
      throw new Error("Invalid page")
    }

    dispatch("showMenu") // let individual pages control this
    dispatch("enableNav") // let individual pages control this
    commit("setAndGoToSectionAndPage", { sectionIndex: currSection, pageIndex })

    // need to save locatation if not a locked section
    const lockedArray = state.scorm.suspendedData.locked

    const { id: sectionId } = state.sections[currSection]
    const { id: pageId } = state.sections[currSection].pages[pageIndex]

    commit("setLastLocation", `/${sectionId}/${pageId}`)
    if (!rootState.noLms) {
      scorm.set("cmi.core.lesson_location", `/${sectionId}/${pageId}`)
    }
  },
  async goToPage(
    { dispatch, commit, rootState, state },
    { sectionIndex, pageIndex }
  ): Promise<void> {
    commit("setRouteAction", RouteActions.JUMPING_TO_PAGE)

    const { currSection, currPage } = state

    // avoid redundant naviagion
    if (!(sectionIndex === currSection && pageIndex === currPage)) {
      if (sectionIndex < 0 || sectionIndex >= state.sections.length) {
        throw new Error("Invalid section")
      } else if (
        pageIndex < 0 ||
        pageIndex >= state.sections[sectionIndex].pages.length
      ) {
        throw new Error("Invalid page")
      }

      dispatch("showMenu") // let individual pages control this
      dispatch("enableNav") // let individual pages control this
      commit("setAndGoToSectionAndPage", { sectionIndex, pageIndex })

      // need to save locatation if not a locked section
      const lockedArray = state.scorm.suspendedData.locked

      if (!lockedArray[sectionIndex]) {
        const { id: sectionId } = state.sections[sectionIndex]
        const { id: pageId } = state.sections[sectionIndex].pages[pageIndex]

        commit("setLastLocation", `/${sectionId}/${pageId}`)
        if (!rootState.noLms) {
          scorm.set("cmi.core.lesson_location", `/${sectionId}/${pageId}`)
        }
      }
    }
  },
  async goToSectionAndPage({ commit, rootState, state, dispatch }, payload) {
    // taken care of in setAndGoToSectionAndPage
    const { sectionIndex, pageIndex } = payload
    commit("setAndGoToSectionAndPage", { sectionIndex, pageIndex })
  },
  async setLastLocation({ commit, rootState, state, dispatch }, payload) {
    const { sectionId: newSectionId, pageId: newPageId } = payload
    console.log("in set last location action")
    console.log(`/${newSectionId}/${newPageId}`)
    commit("setLastLocation", `/${newSectionId}/${newPageId}`)

    // why am I doing this seperate? Oh well
    if (!rootState.noLms) {
      scorm.set("cmi.core.lesson_location", `/${newSectionId}/${newPageId}`)
    }
  },
  async goToPath(
    { dispatch, commit, rootState, state },
    path: string
  ): Promise<void> {
    // avoid redundant navigation just to be safe
    if (
      state.allowedPaths.indexOf(path) !== -1 &&
      path !== router.currentRoute.path
    ) {
      dispatch("showMenu") // let individual pages control this
      dispatch("enableNav") // let individual pages control this

      commit("setRouteAction", RouteActions.JUMPING_TO_PAGE)
      commit("setCurrPageAndCurrSecForPath", path)

      router.push(path)
    }
  },
  disableNavPrev({ commit }) {
    commit("setNavStatus", {
      prevDisabled: true,
    })
  },
  enableNavPrev({ commit }) {
    commit("setNavStatus", {
      prevDisabled: false,
    })
  },
  disableNavNext({ commit }) {
    commit("setNavStatus", {
      nextDisabled: true,
    })
  },
  enableNavNext({ commit }) {
    commit("setNavStatus", {
      nextDisabled: false,
    })
  },
  disableNav({ commit }) {
    commit("setNavStatus", {
      prevDisabled: true,
      nextDisabled: true,
    })
  },
  enableNav({ commit }) {
    commit("setNavStatus", {
      prevDisabled: false,
      nextDisabled: false,
    })
  },

  hideNavPrev({ commit }) {
    commit("setNavStatus", {
      prevHidden: true,
    })
  },
  showNavPrev({ commit }) {
    commit("setNavStatus", {
      prevHidden: false,
    })
  },
  hideNavNext({ commit }) {
    commit("setNavStatus", {
      nextHidden: true,
    })
  },
  showNavNext({ commit }) {
    commit("setNavStatus", {
      nextHidden: false,
    })
  },
  hideNav({ commit }) {
    commit("setNavStatus", {
      prevHidden: true,
      nextHidden: true,
    })
  },
  showNav({ commit }) {
    commit("setNavStatus", {
      prevHidden: false,
      nextHidden: false,
    })
  },

  hideMenu({ commit }) {
    commit("setMenuStatus", { hidden: true })
  },
  showMenu({ commit }) {
    commit("setMenuStatus", { hidden: false })
  },
  openMenu({ commit }) {
    commit("setMenuStatus", { open: true })
  },
  closeMenu({ commit }) {
    commit("setMenuStatus", { open: false })
  },
  setSpecialPageStatus({ commit }, payload: SpecialPageStatus) {
    commit("setSpecialPageStatus", payload)
  },
  goToNextSection({ commit, state }) {
    const { currSection, sections } = state
    if (currSection + 1 < sections.length) {
      commit("goToNextSection")
      commit("setRouteAction", RouteActions.GOING_TO_NEXT_SECTION)
    }
  },
  goToPrevSection({ commit, state }) {
    const { currSection } = state
    if (currSection > 0) {
      commit("goToPrevSection")
      commit("setRouteAction", RouteActions.GOING_TO_PREV_SECTION)
    }
  },
  unlockSection({ state, commit, dispatch }, payload: number) {
    const sectionIndex = payload
    const { locked } = state.scorm.suspendedData
    locked[sectionIndex] = false

    dispatch("updateSuspendedData", {
      ...state.scorm.suspendedData,
      locked,
    })
  },
  lockSection({ state, commit, dispatch }, payload: number) {
    const sectionIndex = payload
    const { locked } = state.scorm.suspendedData
    locked[sectionIndex] = true

    dispatch("updateSuspendedData", {
      ...state.scorm.suspendedData,
      locked,
    })
  },
  markSectionComplete({ state, commit, dispatch }, payload: number) {
    // note .. this is not a "scorm setting" this is just in suspendedData
    const sectionIndex = payload
    const { completed } = state.scorm.suspendedData
    completed[sectionIndex] = true

    dispatch("updateSuspendedData", {
      ...state.scorm.suspendedData,
      completed,
    })
  },
  markSectionIncomplete({ state, commit, dispatch }, payload: number) {
    // note .. this is not a "scorm setting" this is just in suspendedData
    const sectionIndex = payload
    const { completed } = state.scorm.suspendedData
    completed[sectionIndex] = false

    dispatch("updateSuspendedData", {
      ...state.scorm.suspendedData,
      completed,
    })
  },
  setLastLogin({ state, rootState, commit, dispatch }) {
    // eh.. localString should work fine here. No need for ISO strings, etc
    const now = new Date().toLocaleString()
    dispatch("updateSuspendedData", {
      ...state.scorm.suspendedData,
      lastLogin: now,
    })
  },
  updateSuspendedData({ state, rootState, commit }, payload: SuspendedData) {
    commit("setSuspendedData", payload)

    const { noLms } = rootState

    if (!noLms) {
      scorm.set("cmi.suspend_data", JSON.stringify(payload))
    }
  },
  saveAndExitScorm() {
    bigConsoleLog("Saveing and Exiting Scorm")
    // const API = scorm.API.getHandle()
    // API.LMSCommit("")
    // scorm.set("cmi.core.exit", "logout")
    scorm.save()
    scorm.quit()
  },
  bodyClicked({ commit }) {
    commit("incrementTicker")
  },
}
