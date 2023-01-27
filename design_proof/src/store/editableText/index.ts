import { Module } from "vuex"
import { RootState } from "../types"
import { TextData } from "./types"
import { getters } from "./getters"
import { mutations } from "./mutations"
import { actions } from "./actions"

export type TextState = {
  readyToEdit: boolean
  currentEditableID: string
  textData: Record<string, TextData> // origonal, "non-comitted" data. Editable elments look here third ..
  // downloadedData: Record<string, TextData> // saved data. Editable elements look here second ..
  // dataToBeSaved: Record<string, TextData> // data not saved yet. Editable elements look here first ..
  parentOrigin: string | null
  //moduleDomain: string | null
  controlPosition: {
    top: number
    left: number
  }
  editorData: {
    id: string
    editor: any | null
    element: string
  }
}

const state: TextState = {
  readyToEdit: false,
  currentEditableID: "",
  textData: {},
  // downloadedData: {},
  // dataToBeSaved: {},
  parentOrigin: "", // module only accepts messages with the site domain. Defined in Env vars, different for local or prod
  //moduleDomain: "", // link the site is using to communicate with the module
  controlPosition: {
    top: 0,
    left: 0,
  },
  editorData: {
    id: "",
    editor: null,
    element: "",
  },
}

// module needs state and rootstate
// start here
export const editableText: Module<TextState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
