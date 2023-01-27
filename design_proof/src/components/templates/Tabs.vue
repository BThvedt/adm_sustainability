<template>
  <div class="tabs-container" :class="orientation">
    <div class="tabs" :class="orientation">
      <ul class="tabs-list" ref="tabs-list" :class="orientation">
        <li
          v-for="(tab, index) in tabList"
          :key="index"
          :class="{ active: index + 1 === activeTab }"
        >
          <!-- <label :for="`${_uid}${index}`" v-html="tab" /> -->
          <E t="label" :h="tab" :for="`${_uid}${index}`" />
          <!-- I can't actually believe this works? Don't have to pass "for" to 'E'?? s -->
          <input
            :id="`${_uid}${index}`"
            type="radio"
            :name="`${_uid}-tab`"
            :value="index + 1"
            v-model="activeTab"
          />
        </li>
      </ul>
      <div class="tabs-slider" ref="tabs-slider" :class="orientation"></div>
    </div>
    <div class="tabs-content">
      <template v-for="(tab, index) in tabList">
        <div :key="index" v-if="index + 1 === activeTab">
          <slot :name="`tabPanel-${index + 1}`" />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import E from "@/components/editable/E.vue"

export default Vue.extend({
  name: "Menu",
  components: { E },
  data() {
    return {
      activeTab: this.initialTab,
    }
  },
  mounted() {
    // this.setTabSlider()
    this.$nextTick(() => {
      this.setTabSlider()
    })
  },

  methods: {
    setTabSlider() {
      const tabList = this.$refs["tabs-list"] as HTMLElement

      const theActiveTab = tabList.querySelector(".active") as HTMLElement

      // relative position of activeTab
      if (this.orientation === "horizontal") {
        let offsetLeft = theActiveTab.offsetLeft
        let width = theActiveTab.offsetWidth

        const tabSlider = this.$refs["tabs-slider"] as HTMLElement

        tabSlider.style.left = `${offsetLeft}px`
        tabSlider.style.width = `${width}px`
      } else {
        let offsetTop = theActiveTab.offsetTop
        let height = theActiveTab.offsetHeight

        const tabSlider = this.$refs["tabs-slider"] as HTMLElement

        tabSlider.style.top = `${offsetTop}px`
        tabSlider.style.height = `${height}px`
      }
    },
  },
  watch: {
    activeTab(ov, nv) {
      this.$nextTick(() => {
        this.setTabSlider()
      })
    },
  },
  props: {
    tabList: {
      type: Array,
      required: true,
    },
    orientation: {
      type: String,
      required: false,
      default: () => "horizontal",
      validator: (value) => ["horizontal", "vertical"].includes(value),
    },
    initialTab: {
      type: Number,
      required: false,
      default: 1,
    },
  },
})
</script>

<style scoped lang="scss">
.tabs-container {
  display: flex;
  &.horizontal {
    flex-direction: column;
  }
  &.vertical {
    flex-direction: row;
  }
  ul {
    display: flex;
    margin: 0;
    padding: 0;
    &.horizontal {
      flex-direction: row;
    }
    &.vertical {
      flex-direction: column;
    }

    li {
      padding: 1em;
      list-style: none;
      input {
        display: none;
      }
      &.active {
        color: teal;
      }
    }
    li,
    label {
      cursor: pointer;
    }
  }
  .tabs {
    position: relative;
    &.horiztonal {
      margin-bottom: 1.5em;
    }
    &.vertical {
      padding-right: 1.5em;
      margin-right: 1.5em;
    }
    .tabs-slider {
      background-color: teal;
      position: absolute;
      bottom: 0px;
      // width: 100%;
      transition: 0.2s all;
      &.horizontal {
        bottom: 0px;
        height: 4px;
      }
      &.vertical {
        left: 0px;
        width: 4px;
      }
    }
  }
}
</style>
