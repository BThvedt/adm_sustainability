import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import VueResource from "vue-resource"

import "@/assets/scss/index.scss"
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css"
import "vue-loading-overlay/dist/vue-loading.css"
import "animate.css"

import { library } from "@fortawesome/fontawesome-svg-core"
import {
  faUserSecret,
  faBars,
  faTimes,
  faLock,
  faCheck,
  faSquare,
  faArrowRight,
  faCreditCard,
  faRocket,
  faRecycle,
  faBalanceScale,
  faSuitcase,
  faPause,
  faPlay,
  faStop,
  faVolumeDown,
  faVolumeMute,
  faVolumeUp,
  faSearch,
  faLightbulb,
  faChartBar,
  faDollarSign,
  faFile,
  faQuestion,
  faExclamation,
  faBullseye,
  faChevronUp,
  faChevronDown,

  // text editor icons
  // faAlignCenter,
  // faBold,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { IconDefinition } from "@fortawesome/fontawesome-common-types"

library.add(
  faUserSecret,
  faTimes,
  faBars,
  faLock,
  faCheck,
  faSquare,
  faArrowRight,
  faCreditCard,
  faRocket,
  faRecycle,
  faBalanceScale,
  faSuitcase,
  faPause,
  faPlay,
  faStop,
  faVolumeUp,
  faVolumeDown,
  faVolumeMute,
  faSearch,
  faLightbulb,
  faChartBar,
  faDollarSign,
  faFile,
  faQuestion,
  faExclamation,
  faBullseye,
  faChevronUp,
  faChevronDown

  // text editor icons
  // faAlignCenter,
  // faBold
)

Vue.component("font-awesome-icon", FontAwesomeIcon)

Vue.config.productionTip = false

// new Vue({
//   router,
//   store,
//   render: (h) => h(App),
// }).$mount("#app")

const Instance = new Vue({
  router,
  store,
  render: (h) => h(App),
}) //.$mount("#app")

interface ModuleConfig {
  foo?: string
}

export default class Module {
  constructor(selector: string, config: ModuleConfig) {
    Vue.set(Instance, "config", {
      ...config,
      // id is optional. but allows setting the app's `id` dynamically to same `id`
      // as the context page placeholder (which app replaces), for consistency
      // for this, you have to assign `config.id` to App's `$el` in its `mounted()`
      id: selector.replace("#", ""),
      // or document.querySelector(selector).id || 'someClassApp'
    })
    Instance.$mount(selector)
    return Instance
  }
}
