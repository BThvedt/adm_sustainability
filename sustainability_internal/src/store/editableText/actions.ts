import { ActionTree } from "vuex"
import { RootState } from "../types"
import { TextState } from "./index"
// import traverse from "traverse"
import axios from "axios"

const regex =
  /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/

export const actions: ActionTree<TextState, RootState> = {
  setCurrentEditableID({ commit }, payload: string): void {
    // console.log(payload)
    commit("setCurrentEditableID", payload)
  },
  readyToEdit({ commit }): void {
    commit("readyToEdit")
  },
  stopEditing({ commit }): void {
    commit("notReadyToEdit")
  },
  setParentOrigin({ commit }, payload: string): void {
    commit("setParentOrigin", payload)
  },
  setChangedText({ commit }, payload: { id: string; textData: string }): void {
    commit("setChangedText", payload)
  },
  async loadLocalKeyedJson({
    commit,
    dispatch,
    rootState,
    state,
  }): Promise<void> {
    // go through all the allowed paths. Load into membory
    const { sections } = (rootState as any).meta

    // the keys folder should be somewhere near the JSON folder. Right now it's adjacent
    // so I'm just replacing the json part of the path with 'keys'
    const jsonPath = process.env.VUE_APP_JSON_PATH

    const jsonPathArr = jsonPath.split("/")
    jsonPathArr.pop()
    jsonPathArr.push("keys")
    // const keyPath = jsonPathArr.join("/")

    // const importJson = (path: string) => import(`${keyPath}/${path}`)

    for (let x = 0; x < sections.length; x++) {
      const { id: sectionID, pages } = sections[x]

      for (let y = 0; y < pages.length; y++) {
        const { id: pageID } = pages[y]

        const jsonDataObj = (
          (await import(`/public/data/keys/${sectionID}/${pageID}`)) as any
        ).default

        Object.keys(jsonDataObj).forEach((key) => {
          state.textData[key] = jsonDataObj[key]
        })
      }
    }

    // now for the extra json
    const { extraJson } = (rootState as any).meta

    for (const x in Object.keys(extraJson)) {
      const jsonDataObj = (
        (await import(`/public/data/keys/${Object.keys(extraJson)[x]}`)) as any
      ).default

      Object.keys(jsonDataObj).forEach((key) => {
        state.textData[key] = jsonDataObj[key]
      })
    }
  },
  async loadSavedJson(
    { commit, dispatch, rootState, state },
    payload
  ): Promise<void> {
    // ironically this is a lot easier than loading local json because it comes in from the server all nice
    // console.log("PAYLOAD IS")
    // console.log(payload)
    payload.forEach((textDataObj: any) => {
      state.textData[textDataObj.id] = {
        html: textDataObj.html,
      }
    })

    // console.log("DONE LOADING SAVED JSON")
    // console.log(state.textData)
  },
}
