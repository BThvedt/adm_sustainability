import { MutationTree } from "vuex"
import { TextState } from "./index"

export const mutations: MutationTree<TextState> = {
  setCurrentEditableID(state, payload: string) {
    state.currentEditableID = payload
  },
  readyToEdit(state) {
    state.readyToEdit = true
  },
  notReadyToEdit(state) {
    state.readyToEdit = false
  },
  changeCtrlPos(state, position: { top: number; left: number }) {
    state.controlPosition.top = position.top
    state.controlPosition.left = position.left
  },
  setEditor(state, { id, editor, element }) {
    state.editorData = {
      id,
      editor,
      element,
    }
  },
  setChangedText(state, { id, textData }) {
    state.textData[id] = textData
  },
  unsetEditor(state, { id }) {
    if (id === state.editorData.id) {
      state.editorData.editor = null
    }
  },
  setParentOrigin(state, domain) {
    state.parentOrigin = domain
  },
}
