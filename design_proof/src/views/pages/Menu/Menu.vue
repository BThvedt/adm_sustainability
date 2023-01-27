<template>
  <PageBase>
    <div id="menu" class="module-page-container">
      <E :h="json.e_title" t="h1" class="big-title" />
      <E :h="json.e_subtitle" t="h2" class="big-subtitle" />
      <div id="menu-item-container">
        <div
          class="menu-item"
          v-for="(item, index) in menu"
          :key="item.section"
        >
          <div class="menu-item-left-side">
            <img
              class="menu-item-image"
              :src="require(`@/assets/images/${item.image}`).default"
            />
          </div>

          <div class="menu-item-right-side">
            <E :h="item.e_title" t="p" class="header" />
            <E :h="item.e_subTitle" t="p" />

            <div class="est-time-wrapper">
              <div v-if="lockedSections[index + 1]">
                <font-awesome-icon class="menu-icon lock" icon="lock" />
              </div>
              <div v-else-if="completedSections[index + 1]">
                <font-awesome-icon class="menu-icon check" icon="check" />
              </div>
              <E :h="item.e_estTime" t="p" class="estimated-time" />
            </div>

            <div
              class="button launch-button"
              v-if="!lockedSections[index + 1]"
              @click="navigate(item.section)"
            >
              <E :h="item.e_button" t="p" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageBase>
</template>

<script lang="ts">
import Vue from "vue"
import PageBase from "@/components/PageBase.vue"
import E from "@/components/editable/E.vue"
import { bigConsoleLog } from "@/lib/randomFunctions"

export default Vue.extend({
  name: "Menu",
  components: { PageBase, E },
  data() {
    return {
      menu: this.json.menu,
    }
  },
  async mounted() {
    // await genericAwait(1000)
    this.$store.dispatch("meta/setLastLocation", {
      sectionId: "Hx5Dxudy",
      pageId: "8U9NajQt",
    })
  },
  methods: {
    navigate(index: number) {
      this.$store.dispatch("meta/goToPage", {
        sectionIndex: index,
        pageIndex: 0,
      })
    },
  },
  computed: {
    lockedSections(): boolean[] {
      return this.$store.getters["meta/getSuspendedData"].locked
    },
    completedSections(): boolean[] {
      return this.$store.getters["meta/getSuspendedData"].completed
    },
  },
  props: ["json"],
})
</script>

<style scoped lang="scss">
// @media screen and (max-width: 1180px) {
//   .menu-item-image {
//     top: 15%;
//   }
// }
#menu-item-container {
  display: flex;
  align-items: space-between;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 3%;

  .menu-item {
    width: 48%;
    background: white;
    display: flex;
    margin-bottom: 2%;
    box-shadow: $box-shadow;
    max-height: 197px;
    .menu-item-left-side {
      width: 28%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      box-sizing: content-box;
      overflow: hidden;
      .menu-item-image {
        object-fit: cover;
        // width: 145%;
        height: 100%;
        position: relative;
        // top: 27%;
      }
    }
    .menu-item-right-side {
      padding: 2% 3%;
      width: 66%;
      box-sizing: content-box;
      color: $gray;
      position: relative;
      ::v-deep .editable-text-span.header {
        ol {
          margin-top: 0.4em;
          margin-bottom: 0.65em;
        }
      }
      p {
        margin: 0;
        margin-top: 2%;
      }
      .est-time-wrapper {
        color: $gray;
        display: flex;
        align-items: center;
        .menu-icon {
          margin-right: 0.5em;
        }
        .estimated-time {
          color: $gray;
          margin-top: 0.5em;
        }
      }
    }
    .launch-button {
      margin-top: 1.5%;
      width: 50%;
      max-width: 190px;
      position: absolute;
      bottom: 0.7em;
      p {
        margin: 0;
      }
    }
  }
}
@media screen and (max-width: 1180px) {
  #menu-item-container {
    //max-height: 197px;
    max-height: 205px;
    margin-top: 4%;
    .menu-item {
      max-height: 205px;
    }
  }
}
</style>
