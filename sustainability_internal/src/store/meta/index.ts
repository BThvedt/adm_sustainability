import { Module } from "vuex"
import { RootState } from "../types"
import { MetaState, RouteActions, SpecialPageStatus } from "./types"
import { getters } from "./getters"
import { mutations } from "./mutations"
import { actions } from "./actions"

/**
 * The 'Meta' module
 * Handles the course structure, the user's location, progress, scores, etc
 * Handles getting, setting, and saving of meta-specific stuff, except for saving custom data which
 * the root store does. The calls for the actions to load data for this and all modules happen
 * from the root store's "init" function
 */

const state: MetaState = {
  bodyClickedTicker: 0,
  windowResizeTicker: 0,
  sizes: [],
  sections: [],

  currSize: null,
  currSection: 0,
  currPage: 0,
  isOnHiddenPage: false,
  allowedPaths: [], // an array of router paths the module uses

  routeAction: RouteActions.NOT_SET,

  specialPages: {
    loading: undefined,
    locked: undefined,
  },

  specialPageStatus: SpecialPageStatus.NONE,
  navStatus: {
    prevDisabled: false,
    nextDisabled: false,
    prevHidden: false,
    nextHidden: false,
  },
  menuStatus: {
    hidden: false,
    open: false,
  },

  extraJson: {},

  modalShowing: false,

  scorm: {
    module: {
      resumed: undefined, // to be added later
      moduleStatus: undefined, // to be added later
      lastLocation: undefined, // a route
      score: {
        max: 100,
        min: 0,
        raw: 0,
      },
    },
    user: {
      userName: undefined,
      userId: undefined,
    },
    suspendedData: {
      locked: [],
      completed: [],
      lastLogin: "1/1/2021",
      lockedLessonParts: {},
    },
  },
  jsonData: {},
  jsonLoaded: false,
  lesson3ChosenIds: [],
}

// module needs state and rootstate
export const meta: Module<MetaState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
