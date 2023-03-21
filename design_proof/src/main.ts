/*
import Module from "@/Module"

export default new Module("#devhook", {
  // config object
})

const app = document.querySelector("#devhook")
*/

/*** Uncomment above and comment out below to do a build **/

import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"

import "@/assets/scss/index.scss"
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css"
import "vue-loading-overlay/dist/vue-loading.css"
import "animate.css"
import "vue-scroll-picker/dist/style.css"
// import "video.js/dist/video-js.css"

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
  faBook,
  faHome,
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
  faChevronDown,
  faBook,
  faHome
  // text editor icons
  // faAlignCenter,
  // faBold
)

Vue.component("font-awesome-icon", FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#devhook")
