import { ScormStatusString } from "@/types"
import { GetterTree } from "vuex"
import { RootState } from "../types"
import {
  MetaState,
  RouteActions,
  Section,
  SpecialPageStatus,
  NavStatus,
  MenuStatus,
  ModuleData,
  SuspendedData,
  UserData,
  ScormScore,
} from "./types"

export const getters: GetterTree<MetaState, RootState> = {
  getLesson3ChosenIds(state) {
    return state.lesson3ChosenIds
  },
  getLockedLessonParts:
    (state) =>
    (payload: string): boolean[] => {
      const lesson = payload
      const { lockedLessonParts } = state.scorm.suspendedData

      if (lockedLessonParts[lesson]) {
        return lockedLessonParts[lesson]
      } else {
        return []
      }
    },
  getModalShowing(state) {
    return state.modalShowing
  },
  isOnHiddenPage(state) {
    return state.isOnHiddenPage
  },
  getScreenDimensions(state): { width: number; height: number } {
    if (state.currSize) {
      const { width, height } = state.currSize
      return { width, height }
    } else {
      return {
        width: 0,
        height: 0,
      }
    }
  },
  getCurrentSection(state): Section {
    const { currSection } = state
    return state.sections[currSection]
  },
  getCurrentSubSectionData(state): Record<string, any>[] | undefined {
    const { currSection } = state
    return state.sections[currSection] &&
      state.sections[currSection].subSectionData
      ? state.sections[currSection].subSectionData
      : []
  },
  getCurrentSectionId(state): string {
    const { currSection } = state
    return state.sections[currSection]?.id
      ? state.sections[currSection]?.id
      : ""
  },
  getCurrentPageId(state): string {
    const { currSection, currPage } = state
    return state.sections[currSection]?.pages[currPage].id || ""
  },
  getCurrentPageNumber(state): number {
    const { currPage } = state
    return currPage
  },
  getPageSpecialClass(state): string {
    const { currSection, currPage } = state
    const { specialClass } = state.sections[currSection].pages[currPage]
    return specialClass ? specialClass : "no-special-class"
  },
  getPageData(state): Record<string, any> {
    const { currSection, currPage } = state
    const { data } = state.sections[currSection].pages[currPage]
    return data ? data : {}
  },
  getAllSections(state): Section[] {
    // console.log("getting sections")
    // console.log(state)
    return state.sections
  },
  getAllowedRoutePaths(state): string[] | undefined {
    if (state.allowedPaths.length) {
      return state.allowedPaths
    } else {
      return undefined
    }
  },
  getLastLocation(state): string | undefined {
    return state.scorm.module.lastLocation
  },
  getRouteAction(state): RouteActions {
    return state.routeAction
  },
  getSpecialPageStatus(state): SpecialPageStatus {
    // console.log("asdfasdfadfasdfasfdasfsad")
    return state.specialPageStatus
  },
  getNavStatus(state): NavStatus {
    return state.navStatus
  },
  getMenuStatus(state): MenuStatus {
    return state.menuStatus
  },
  getSuspendedData(state): SuspendedData {
    return state.scorm.suspendedData
  },
  getSectionAndPageIndex(state): { currSection: number; currPage: number } {
    return {
      currSection: state.currSection,
      currPage: state.currPage,
    }
  },
  getUserData(state): UserData {
    return state.scorm.user
  },
  getArrayOfLockedSections(state): boolean[] {
    return state.scorm.suspendedData.locked
  },
  getArrayOfCompletedSections(state): boolean[] {
    return state.scorm.suspendedData.completed
  },
  getFirstPageRoutePath(state): string {
    const { id: sectionId } = state.sections[0]
    const { id: pageId } = state.sections[0].pages[0]
    return `/${sectionId}/${pageId}`
  },
  // um, guess I didn't know what to call this so ..
  getStoreBasicModuleInfo(state): ModuleData {
    return state.scorm.module
  },
  getModuleStatus(state): ScormStatusString | undefined {
    return state.scorm.module.moduleStatus
  },
  getModuleScoreData(state): ScormScore {
    return state.scorm.module.score
  },
  getExtraJson(state): any {
    return (arg: string) => {
      if (state.extraJson[arg]) {
        return state.extraJson[arg]
      } else {
        return undefined
      }
    }
  },
  getBodyClickTicker(state): number {
    return state.bodyClickedTicker
  },
  getWindowResizeTicker(state): number {
    return state.windowResizeTicker
  },
  jsonLoaded(state): boolean {
    return state.jsonLoaded
  },
}
