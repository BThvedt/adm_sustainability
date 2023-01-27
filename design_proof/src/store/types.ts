export interface RootState {
  initialized: boolean
  errorConnecting: boolean | undefined
  isDev: boolean
  builtWithoutLms: boolean
  noLms: boolean | undefined
}
