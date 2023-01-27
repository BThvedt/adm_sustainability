<template>
  <transition
    :enter-active-class="`${TEnter.SLIDE_IN_DONW} ${TTimes.MEDIUM}`"
    :leave-active-class="`${TExit.SLIDE_OUT_UP} ${TTimes.MEDIUM}`"
  >
    <div id="resources-menu" v-show="open">
      <ul>
        <li>
          <transition
            :enter-active-class="`${TEnter.FADE_IN} ${TTimes.FAST}`"
            :leave-active-class="`${TExit.FADE_OUT} ${TTimes.VERY_FAST}`"
          >
            <p
              class="small-headline menu-title header"
              v-if="showResourceLinks && open"
            >
              Resources
            </p>
          </transition>
        </li>
        <li
          v-for="(resource, i) in resources"
          :key="`resource-${i}`"
          class="download-li"
          :class="{ 'last-one': i === resources.length - 1 }"
        >
          <transition
            :enter-active-class="`${TEnter.FADE_IN} ${TTimes.FAST}`"
            :leave-active-class="`${TExit.FADE_OUT} ${TTimes.VERY_FAST}`"
          >
            <button
              type="button"
              class="plain-btn small-headline resource-link header"
              v-if="showResourceLinks && open"
              :key="i"
            >
              <span
                v-html="resource.name"
                @click="downloadResource(resource.link, resource.name, 'pdf')"
              ></span>
            </button>
          </transition>
        </li>
        <li>
          <transition
            :enter-active-class="`${TEnter.FADE_IN} ${TTimes.FAST}`"
            :leave-active-class="`${TExit.FADE_OUT} ${TTimes.VERY_FAST}`"
          >
            <p
              class="small-headline menu-title header"
              v-if="showResourceLinks && open"
            >
              Links
            </p>
          </transition>
        </li>
        <li
          v-for="(link, i) in links"
          :key="i"
          class="resource-link-li"
          :class="{ 'last-one': i === links.length - 1 }"
        >
          <transition
            :enter-active-class="`${TEnter.FADE_IN} ${TTimes.FAST}`"
            :leave-active-class="`${TExit.FADE_OUT} ${TTimes.VERY_FAST}`"
          >
            <button
              type="button"
              class="plain-btn small-headline resource-link"
              v-if="showResourceLinks && open"
              :key="i"
            >
              <a
                class="header"
                v-html="link.name"
                :href="link.link"
                target="_blank"
              />
            </button>
          </transition>
        </li>

        <li>
          <transition
            :enter-active-class="`${TEnter.FADE_IN} ${TTimes.FAST}`"
            :leave-active-class="`${TExit.FADE_OUT} ${TTimes.VERY_FAST}`"
          >
            <button
              type="button"
              class="plain-btn small-headline resource-link glossary-link"
              v-if="showResourceLinks && open"
              @click="glossaryClick"
            >
              <p class="header">Glossary</p>
            </button>
          </transition>
        </li>
      </ul>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from "vue"
import { TEnter, TExit, TTimes } from "@/types"
import { genericAwait } from "@/lib/randomFunctions"
import axios from "axios"

export default Vue.extend({
  name: "TopRightButtons",
  data() {
    return {
      showResourceLinks: false,
      // resources,
      // links,
      TEnter,
      TExit,
      TTimes,
    }
  },
  computed: {
    open(): boolean {
      return this.$store.getters["meta/getMenuStatus"].open
    },
    hideMenu(): boolean {
      return this.$store.getters["meta/getMenuStatus"].hidden
    },
    resources(): string | undefined {
      const { resources } = this.$store.getters["meta/getExtraJson"]("extra")

      return resources ? resources : undefined
    },
    links(): string | undefined {
      const { links } = this.$store.getters["meta/getExtraJson"]("extra")

      return links ? links : undefined
    },
  },
  methods: {
    downloadResource(link: string, label: string, type: string) {
      let contentType = ""

      switch (type) {
        case "pdf":
          contentType = "application/pdf"
          break
        default:
          break
      }

      axios
        .get(link, { responseType: "blob" })
        .then((response) => {
          const blob = new Blob([response.data], { type: contentType })
          const link = document.createElement("a")
          link.href = URL.createObjectURL(blob)
          link.download = label
          link.click()
          URL.revokeObjectURL(link.href)
        })
        .catch(console.error)
    },
    glossaryClick() {
      // alert("eh")
      this.$emit("glossaryClicked")
    },
  },
  watch: {
    async open(newVal: boolean) {
      if (newVal) {
        this.showResourceLinks = true
      } else {
        this.showResourceLinks = false
      }
    },
  },
})
</script>

<style scoped lang="scss">
.resource-link-li.last-one {
  border-bottom: 1px dotted $gray;
  margin-bottom: 1em;
}
#resources-menu {
  position: absolute;
  top: 0;
  right: 1em;
  padding: 1.5em;
  padding-top: 76px;
  padding-bottom: 1em;
  border: 1px solid $gray;
  border-radius: 0px 0px 15px 15px;
  box-shadow: $box-shadow;
  background: white;
  overflow: hidden;
  min-height: 243px;
  z-index: 997;
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    padding-top: 0.5em;
    li {
      transition: $very-fast-transition;
      // height: 38px;
      min-width: 365px;
      button {
        text-align: left;
      }
      span,
      a {
        display: inline-block;
        margin-bottom: 1em;
        text-decoration: none;
      }
      p.menu-title {
        margin: 0;
        padding: 0;
        padding-bottom: 0.5em;
      }
      p.menu-title,
      &.menu-title {
        color: $gray;
        border-bottom: 1px dotted $gray;
        margin-bottom: 1em;
      }
      &:first-of-type {
        margin-bottom: 0.5em;
      }
      &:last-of-type {
        height: 25px;
      }

      .resource-link {
        color: $darkBlue;
        font-size: 0.8em;
        &:hover {
          color: $buttonHover;
          cursor: pointer;
        }
        &.glossary-link {
          position: relative;
          z-index: 500;
        }
      }
    }
  }
}
</style>
