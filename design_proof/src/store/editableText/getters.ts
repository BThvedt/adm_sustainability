import { bigConsoleLog } from "@/lib/randomFunctions"
import { GetterTree } from "vuex"
import { RootState } from "../types"
import { TextState } from "./index"

export const getters: GetterTree<TextState, RootState> = {
  getReadyToEdit(state): boolean {
    return state.readyToEdit
  },
  currentEditableID(state): string {
    return state.currentEditableID
  },
  getTextData(state) {
    return (key: string) => {
      // bigConsoleLog("WTF")
      console.log("ID IS ")
      console.log(key)
      // console.log(JSON.stringify(state.textData, null, 2))
      // console.log(state.textData)
      // console.log(`GETTING TEXTDATA WITH KEY ${key}`)
      // console.log(state.textData[key])
      if (key === "dfc1ea3f-6a10-41a2-adfb-19d05078e5d1") {
        console.log(state.textData)
      }

      return state.textData[key]
    }
  },
  // getAlteredButUnsavedTextData(state) {
  //   return (id: string) => {
  //     // console.log("ID IS ")
  //     // console.log(id)
  //     // console.log(JSON.stringify(state.textData, null, 2))
  //     // console.log(state.textData)
  //     return state.dataToBeSaved[id]
  //   }
  // },
  // getUnsavedData(state) {
  //   return state.dataToBeSaved
  // },
  getEditorPosition(state) {
    return state.controlPosition
  },
  getEditorData(state) {
    return state.editorData
  },
  getParentOrigin(state) {
    return state.parentOrigin
  },
  // selectedEditableId(state): boolean {
  //   return state.somethingIsBeingEdited
  // },
}
