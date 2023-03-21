<template>
  <div id="nav-menu" @mouseleave="hideIfUp" :class="{ up: hideMenu }">
    <div id="menu-bar">
      <!-- <h2>{{ menuJson.e_headerText }}</h2> -->
      <!-- <E :h="menuJson.e_headerText" t="h2" v-if="menuJson" class="logo" /> -->
      <div class="logo-and-name-wrapper">
        <transition
          :enter-active-class="`${TEnter.FADE_IN}`"
          :leave-active-class="`${TExit.FADE_OUT}`"
        >
          <img
            class="logo"
            :src="require(`@/assets/images/shared/adm_logo.png`).default"
            v-if="currentSectionIndex < 1"
            key="logo"
          />
          <E
            :h="sectionNames[currentSectionIndex - 1]"
            t="h3"
            v-else-if="currentSectionIndex >= 1"
            :class="`header menu-section-name ${
              sectionNames[currentSectionIndex - 1].length > 25
                ? 'long'
                : 'short'
            }`"
            key="sectionName"
          />
        </transition>
      </div>

      <div class="main-menu-title header" v-if="currentSectionIndex === 0">
        Main Menu
      </div>

      <transition
        :enter-active-class="`${TEnter.FADE_IN}`"
        :leave-active-class="`${TExit.FADE_OUT}`"
      >
        <div
          id="nav-sub-section-data"
          ref="tabs-list"
          v-if="subSections && subSections.length"
        >
          <div
            class="tab"
            v-for="(subSection, index) in subSections"
            :key="index"
            :class="{
              active: index === activeTab,
              greyedOut: lockedSubSections[index],
            }"
            @click="tabClicked(index, lockedSubSections[index])"
          >
            <p class="tags-paragraph">
              <font-awesome-icon
                class="lock"
                icon="lock"
                v-if="lockedSubSections[index]"
              />
              {{ subSection.name }}
            </p>
          </div>
          <div class="tabs-slider" ref="tabs-slider"></div>
        </div>
      </transition>

      <div id="nav-right-side" class="icons">
        <h2 id="menu-toggle" class="menu-icon" @click="menuToggle">
          <font-awesome-icon v-if="!open" icon="bars" class="hamburger-menu" />
          <font-awesome-icon v-if="open" icon="times" class="hamburger-menu" />
        </h2>

        <!-- <h2>
          <font-awesome-icon
            id="glossary-link"
            class="menu-icon"
            icon="book"
            @click="showGlossary"
            v-if="menuJson"
          />
        </h2> -->

        <transition
          :enter-active-class="TEnter.FADE_IN"
          :leave-active-class="TExit.FADE_OUT"
        >
          <h2 v-show="showHomeButton">
            <font-awesome-icon
              id="home-link"
              class="menu-icon"
              icon="home"
              @click="goHome"
              v-if="menuJson"
            />
          </h2>
        </transition>
      </div>
    </div>
    <!-- <div class="sections-wrapper" :class="{ up: hideMenu && !open }">
      <transition
        :enter-active-class="menuOpenClass"
        :leave-active-class="menuCloseClass"
      >
         <div id="sections" v-if="open">
          <div
            class="menu-item"
            :class="{ currentSection: currentSectionIndex === index }"
            v-for="(section, index) in sections"
            :key="section.id"
            @click="handleClick(index)"
          >
            <div class="menu-section-icon">
              <div v-if="!lockedSections[index] && !completedSections[index]">
                {{ " " }}
              </div>
              <div v-else-if="lockedSections[index]">
                <font-awesome-icon class="menu-icon lock" icon="lock" />
              </div>
              <div v-else-if="completedSections[index]">
                <font-awesome-icon class="menu-icon check" icon="check" />
              </div>
            </div>
            <h2>{{ section.name }}</h2>
          </div>
        </div> 
      </transition>
    </div> -->
  </div>
</template>

<script lang="ts">
import { TEnter, TExit, TTimes } from "@/types"
// import E from "@/components/editable/E.vue"
import E from "@/components/editable/E.vue"
import Vue from "vue"

export default Vue.extend({
  name: "Menu",
  data() {
    return {
      activeTab: 0,
      menuOpenClass: `${TEnter.SLIDE_IN_DONW} ${TTimes.MEDIUM}`,
      menuCloseClass: `${TExit.SLIDE_OUT_UP} ${TTimes.MEDIUM}`,
      TEnter,
      TExit,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setTabSlider()
    })
  },
  methods: {
    setTabSlider() {
      // console.log("setting tabs slider")
      const tabList = this.$refs["tabs-list"] as HTMLElement

      const theActiveTab = tabList?.querySelector(".active") as HTMLElement

      // relative position of activeTab
      if (theActiveTab) {
        let offsetLeft = theActiveTab.offsetLeft
        let width = theActiveTab.offsetWidth

        const tabSlider = this.$refs["tabs-slider"] as HTMLElement

        tabSlider.style.left = `${offsetLeft}px`
        tabSlider.style.width = `${width}px`
      }
    },
    tabClicked(index: number, isNotAllowed: boolean) {
      if (!isNotAllowed) {
        this.activeTab = index
        // now go to section and page
        // find the page
        let pageNum = this.subSections[index].page
        this.$store.dispatch("meta/goToSubSection", {
          pageIndex: pageNum,
        })
      }
    },
    menuToggle() {
      // alert("asfd")
      this.open
        ? this.$store.dispatch("meta/closeMenu")
        : this.$store.dispatch("meta/openMenu")
    },
    hideIfUp() {
      if (this.hideMenu) {
        this.$store.dispatch("meta/closeMenu")
      }
    },
    handleClick(sectionIndex: number) {
      if (sectionIndex !== this.currentSectionIndex) {
        this.$store.dispatch("meta/goToPage", { sectionIndex, pageIndex: 0 })
      }
    },
    // showGlossary() {
    //   // alert("eh")
    //   this.$emit("showGlossary")
    // },
    goHome() {
      // this.$store.dispatch("meta/goToPage", { sectionIndex: 0, pageIndex: 0 })
      this.$store.dispatch("meta/goHome")
    },
  },
  computed: {
    lockedSubSections(): boolean[] {
      // hmm maybe I should have indexed the sections by number instead of name in this getter. Oh well
      // remember, 0 is the Menu ..
      let lessonName = ""
      switch (this.currentSectionIndex) {
        case 1:
          lessonName = "intro"
          break
        case 2:
          lessonName = "whatsInScope"
          break
        case 3:
          lessonName = "exploringScope3"
          break
        case 4:
          lessonName = "dayInTheLife"
          break
      }

      return this.$store.getters["meta/getLockedLessonParts"](lessonName)
    },
    // a computed getter
    showHomeButton() {
      let { currSection, currPage } =
        this.$store.getters["meta/getSectionAndPageIndex"]
      // return currSection === 0 && currPage === 0
      if (currSection === 0) {
        return false
      }
      if (currSection === 0) {
        return false
      }
      return true
    },
    sections() {
      return this.$store.getters["meta/getAllSections"]
    },
    hideMenu() {
      return this.$store.getters["meta/getMenuStatus"].hidden
    },
    open() {
      return this.$store.getters["meta/getMenuStatus"].open
    },
    completedSections(): boolean[] {
      return this.$store.getters["meta/getSuspendedData"].completed
    },
    lockedSections(): boolean[] {
      return this.$store.getters["meta/getSuspendedData"].locked
    },
    subSections(): Record<string, any>[] {
      return this.$store.getters["meta/getCurrentSubSectionData"]
    },
    currentSectionIndex(): number {
      let { currSection: currSectionIndex } =
        this.$store.getters["meta/getSectionAndPageIndex"]

      return currSectionIndex
    },
    menuJson(): string | undefined {
      const extraJson = this.$store.getters["meta/getExtraJson"]("extra")

      return extraJson ? extraJson : undefined
    },
    sectionNames(): string | undefined {
      const { e_lessonNames } =
        this.$store.getters["meta/getExtraJson"]("extra")

      return e_lessonNames ? e_lessonNames : undefined
    },
    currSectionId(): string {
      return this.$store.getters["meta/getCurrentSectionId"]
    },
    currPageNumber(): number {
      return this.$store.getters["meta/getCurrentPageNumber"]
    },
  },
  watch: {
    activeTab(nv, ov) {
      this.$nextTick(() => {
        this.setTabSlider()
      })
    },
    currSectionId(nv, ov) {
      this.$nextTick(() => {
        this.activeTab = 0
        this.setTabSlider()
      })
    },
    currPageNumber(nv, ov) {
      // calculate the active tab based on the page number
      let activeTab = 0

      if (this.subSections) {
        this.subSections.forEach((subSection, index) => {
          if (nv >= subSection.page) {
            activeTab = index
          }
        })
      }

      this.activeTab = activeTab
    },
  },
  components: { E },
})
</script>

<style lang="scss">
.main-menu-title {
  z-index: 0;
  position: absoute;
  width: 100%;
  position: absolute;
  text-align: center;
}
#nav-menu {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transition: 600ms all;
  min-width: 1000px;
  &.up {
    top: -45px;
    &:hover {
      top: 0px;
      cursor: pointer;
    }
  }
}
#menu-bar {
  height: 76px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  position: absolute;
  padding-left: 30px;
  padding-right: 30px;
  box-sizing: border-box;
  z-index: 10;
  border-radius: 0;
  transition: 600ms all;
  border: 1px solid #aaa;
  box-shadow: $box-shadow;
  z-index: 1000;
  overflow: hidden;

  .logo-and-name-wrapper {
    position: relative;
    height: 50px;
    width: 400px;
    z-index: 1;
    .logo {
      width: 60px;
      position: absolute;
    }
    .menu-section-name {
      position: absolute;
      margin: 0;
      font-size: 1.1em;
      margin-top: 0.5em;

      &.long {
        margin-top: 0;
        height: 100%;
        line-height: 1.1em;
        font-size: 1.1em;
      }
    }
  }

  #nav-sub-section-data {
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    height: 100%;
    position: absolute;
    left: 0;
    width: 100%;
    top: 0;
    z-index: 0;

    .tab {
      height: 100%;
      margin-right: 5%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: $gray;
      &:hover {
        color: $green;
      }
      &.greyedOut {
        cursor: not-allowed;
        opacity: 0.5;
        &:hover {
          color: $gray;
        }
        .lock {
          margin-right: 0.5em;
        }
      }
    }
  }

  #nav-right-side {
    width: 12%;
    display: flex;
    flex-direction: row-reverse;
    position: relative;
    z-index: 1;

    .menu-icon {
      cursor: pointer;
      margin-left: 1em;
      &:hover {
        color: $buttonHover;
      }
    }

    .hamburger-menu {
      width: 25px;
    }
  }
}

#sections {
  background: white;
  flex-direction: column;
  max-width: 350px;
  min-width: 350px;
  position: absolute;
  right: 30px;
  top: 50px;
  z-index: 5;
  padding-top: 31px;
  border-radius: 0 0 11px 11px;
  border: 1px solid #aaa;
  box-shadow: $box-shadow;
  .menu-item {
    user-select: none;
    padding-left: 10px;
    cursor: pointer;
    padding-top: 10px;
    padding-bottom: 10px;
    display: flex;
    align-items: center;
    .menu-section-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 25px;
      font-size: 1.1em;
      .menu-icon.lock {
        position: relative;
        bottom: 0px;
      }
      .menu-icon.check {
        position: relative;
        font-size: 1.2em;
        bottom: -1px;
        right: 1px;
      }
    }
    &:last-of-type {
      margin-bottom: 8px;
    }
    h2 {
      margin: 0;
      padding: 0;
    }
    &:hover {
      background: #ccc;
    }
    &.currentSection {
      cursor: default;
      background: #ccc;
    }
  }
}
.sections-wrapper {
  position: relative;
  transition: 600ms all;
  bottom: 0px;
  &.up {
    bottom: 40px;
  }
}
.tabs-slider {
  background-color: $green;
  position: absolute;
  bottom: 0px;
  // width: 100%;
  transition: 0.2s all;
  height: 5px;
}
</style>
