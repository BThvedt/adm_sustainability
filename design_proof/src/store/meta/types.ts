import { ScormStatusString } from "@/types"

export type Size = {
  name: string
  width: number
  height: number
  breakpoint: number | "Infinity"
}

export type Page = {
  id: string
  name: string
  specialClass?: string
  data?: Record<string, any>
}

export interface HiddenPage extends Page {}

export type Section = {
  id: string
  name: string
  locked: boolean
  //  loaded: boolean
  pages: Page[]
  hiddenPages?: HiddenPage[]
  subSectionData?: Record<string, any>[]
}

export type SuspendedData = {
  locked: boolean[]
  completed: boolean[]
  lastLogin: string
  lockedLessonParts: Record<string, boolean[]>
}

export enum Entry {
  "ab-initio", // first time entered
  "resume", // resuming
}

export type ScormScore = {
  max: number
  min: number
  raw: number
}

// custom scorm data, saved as a string, stringified and paresed as JSON
// this ultimately happens in the root store
export interface MetaCustomData {
  locked: boolean[]
}

// stuff that's intertwined with scorm
export interface ModuleData {
  resumed: boolean | undefined
  moduleStatus: ScormStatusString | undefined
  lastLocation: string | undefined
  score: ScormScore
}

export interface UserData {
  userName: string | undefined
  userId: string | undefined
}

export enum RouteActions {
  NOT_SET,
  PAGING_FORWARD,
  PAGING_BACKWARD,
  GOING_TO_NEXT_SECTION,
  GOING_TO_PREV_SECTION,
  JUMPING_TO_PAGE,
  JUMPING_TO_SUBSECTION,
  GOING_BACK_HOME,
  GOING_TO_HIDDEN_PAGE,
  RETURNING_FROM_HIDDEN_PAGE,
}

export type SpecialPages = {
  loading: boolean | undefined
  locked: boolean | undefined
}

export type FakeLoadingTimes = {
  on: boolean
  minDuration: number
}

export enum SpecialPageStatus {
  NONE,
  LOCKED,
}

export type NavStatus = {
  prevDisabled: boolean
  nextDisabled: boolean
  prevHidden: boolean
  nextHidden: boolean
}

export type MenuStatus = {
  hidden: boolean
  open: boolean
}

export interface MetaState {
  //fakeLoadingTimes: FakeLoadingTimes | undefined
  bodyClickedTicker: number
  windowResizeTicker: number
  sizes: Size[]
  sections: Section[]
  currSize: Size | null
  currSection: number
  currPage: number
  isOnHiddenPage: boolean
  allowedPaths: string[]
  routeAction: RouteActions
  specialPages: SpecialPages
  specialPageStatus: SpecialPageStatus
  navStatus: NavStatus
  menuStatus: MenuStatus
  extraJson: Record<string, any>
  modalShowing: boolean
  scorm: {
    module: ModuleData
    user: UserData
    suspendedData: SuspendedData
  }
  jsonData: Record<string, any>
  jsonLoaded: boolean
}
