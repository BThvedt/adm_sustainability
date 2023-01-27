import Vue from "vue"
import Vuex, { StoreOptions } from "vuex"
import { RootState } from "./types"
import { meta } from "@/store/meta"
import { editableText } from "@/store/editableText"
import { bigConsoleLog } from "@/lib/randomFunctions"

import scorm from "@/scorm"

Vue.use(Vuex)

/**
 * The root store. Stores extremely basic stuff (was scorm initialized?) and dispatches the nessesary actions
 * to set up the data in all the modules. Also handles saving 'custom data' because scorm 1.2 only allows
 * one real point to do this.
 */

const state: RootState = {
  initialized: false,
  errorConnecting: undefined,
  isDev: process.env.NODE_ENV === "production" ? false : true,
  builtWithoutLms: process.env.VUE_APP_RUN_MODE !== "lms" ? true : false,
  noLms: undefined,
}

const store: StoreOptions<RootState> = {
  state,
  mutations: {
    setInitialized(state) {
      state.initialized = true
      state.errorConnecting = false
    },
    setError(state) {
      state.errorConnecting = true
    },
  },
  actions: {
    async initialize({ commit, dispatch, state }) {
      if (state.isDev || state.builtWithoutLms) {
        bigConsoleLog("NO LMS")

        state.noLms = true
        await dispatch("meta/loadMeta")

        // ok now these should have been loaded
        const sections = (state as any).meta.sections
      } else if (scorm.init()) {
        bigConsoleLog("LMS CONNECTED")
        // always need to set suspend, since I'm assuming I'm always saving scorm's allowed "suspended" data
        scorm.set("cmi.exit", "suspend")
        commit("setInitialized")

        // dispatch loadMeta and loadUser
        dispatch("meta/loadMeta")

        // ok now these should have been loaded
        const sections = (state as any).meta.sections

        // dispatch("json/loadJson", sections)
      } else {
        console.log("Error connecting")
        commit("setErrorConnecting")
      }
    },
  },
  modules: {
    meta,
    editableText,
  },
}

export default new Vuex.Store<RootState>(store)
