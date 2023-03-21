declare module "*.vue" {
  import Vue from "vue"
  export default Vue
}

declare module "*.svg" {
  const content: any
  export default content
}

interface WindowOrWorkerGlobalScope {
  structuredClone(value: any, options?: StructuredSerializeOptions): any
}
declare function structuredClone(
  value: any,
  options?: StructuredSerializeOptions
): any
