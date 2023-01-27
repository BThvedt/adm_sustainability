import { Section, SpecialPageStatus } from "@/store/meta/types"
import Vue from "vue"
import VueRouter, { RouteConfig } from "vue-router"
import { bigConsoleLog } from "@/lib/randomFunctions"
//import BlankPageFOrRootPath from "@/components/BlankPageForRootPath.vue"

Vue.use(VueRouter)

// whether or not these are accessable are determined in meta json
const routes: Array<RouteConfig> = [
  // {
  //   path: "/",
  //   name: "BlankComponent",
  //   component: BlankPageFOrRootPath,
  //   // component: () =>
  //   //   import(/* webpackChunkName: "about" */ "../views/About.vue"),
  // },
]

const router = new VueRouter({
  routes,
})

router.beforeEach((to, from, next) => {
  const store = router.app.$store

  if (store) {
    const allowedPaths = store.getters["meta/getAllowedRoutePaths"]

    if (allowedPaths?.length) {
      if (allowedPaths.indexOf(to.path) !== -1) {
        // ok. Now we gotta make sure the section isn't locked. If it's locked, go to the first page of the section
        const [sectionId, pageId] = to.path.split("/").slice(1)

        const sections: Section[] = store.getters["meta/getAllSections"]

        if (sections) {
          const sectionIndex = sections.findIndex(
            (section: Section) => section.id === sectionId
          )

          const pageIndex = sections[sectionIndex].pages.findIndex(
            ({ id }) => id === pageId
          )

          // hmm.. this'll work with hidden pages fine I think

          const lockedSections = store.getters["meta/getSuspendedData"].locked

          if (sectionIndex !== -1 && lockedSections[sectionIndex] === true) {
            bigConsoleLog("Going to locked section")
            store.dispatch(
              "meta/setSpecialPageStatus",
              SpecialPageStatus.LOCKED
            )
            // section is locked, go to the first page of the section

            if (pageIndex !== 0) {
              bigConsoleLog("Rerouting to first page of locked section")
              store.dispatch("meta/goToPage", { sectionIndex, pageIndex: 0 })
            } else {
              next()
            } // end forcing user to go to first page of locked section
          } else {
            // section exists, is not locked, and path is allowed
            // console.log("everything is normal. Proceed")
            store.dispatch("meta/setSpecialPageStatus", SpecialPageStatus.NONE)
            next()
          } // end locked section logic
        } else {
          // hopefully should never get here
          // deal with this if it ever comes up
          throw new Error("no sections in store")
          //next()
        }
      } else {
        // path does not exist. Go back to wherever we were last
        const lastLocation = store.getters["meta/getLastLocation"]
        store.commit("meta/setCurrPageAndCurrSecForPath", lastLocation)
        next(lastLocation)
      }
    } else {
      // deal with this if it ever comes up
      throw new Error("no allowed paths yet")
    }
  } else {
    // on the LMS for some reason it starts out with no store
    // and to.path === from.path which triggers redunant navigation
    // which causes an error

    if (to.path !== from.path) {
      next()
    }
  }
})

export default router
