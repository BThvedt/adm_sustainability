<template>
  <ModalBase :size="'glossary'" ref="modalBase" :showing="showing">
    <div id="glossary-modal-inner">
      <h2 id="glossary-title">Glossary</h2>

      <!-- <h1 id="todo-id">TO DO: Make Glossary</h1> -->

      <Tabs
        id="glossary-tabs"
        :tabList="
          Object.keys(glossaryJson.tabs).map(
            (term) => term.charAt(0).toUpperCase() + term.slice(1)
          )
        "
      >
        <template v-slot:tabPanel-1>
          <Tabs
            id="glossary-terms-tabs"
            orientation="vertical"
            :transition="true"
            :tabList="glossaryJson.tabs.terms.tabs.map((tab) => tab.e_label)"
          >
            <template
              v-for="(tab, index) in glossaryJson.tabs.terms.tabs"
              v-slot:[getSlotName(index)]
              :class="`tab-${index + 1}`"
            >
              <GlossaryPage :terms="tab.items" :key="index" />
            </template>
          </Tabs>
        </template>
        <template v-slot:tabPanel-2>
          <div id="acronyms-container">
            <Tabs
              id="glossary-terms-tabs-two"
              orientation="vertical"
              :transition="true"
              :tabList="
                glossaryJson.tabs.acronyms.tabs.map((tab) => tab.e_label)
              "
            >
              <template
                v-for="(tab, index) in glossaryJson.tabs.acronyms.tabs"
                v-slot:[getSlotName(index)]
                :class="`tab-${index + 1}`"
              >
                <GlossaryPage :terms="tab.items" :key="index" />
              </template>
            </Tabs>
          </div>
        </template>
      </Tabs>

      <div id="close-container">
        <button class="button" id="close-button" @click="closeModal">
          Close
        </button>
      </div>
    </div>
  </ModalBase>
</template>

<script lang="ts">
import Vue from "vue"
import ModalBase from "@/components/ModalBase.vue"
import E from "@/components/editable/E.vue"
import Tabs from "@/components/templates/Tabs.vue"
import GlossaryPage from "@/components/modals/glossary/GlossaryPage.vue"
// import VueJsonPretty from "vue-json-pretty"
// import "vue-json-pretty/lib/styles.css"

export default Vue.extend({
  name: "GlossaryModal",
  data() {
    return {
      // showing: false,
      // tabList: ["Terms", "Acronyms"],
      // terms: ["A - F", "G - P", "Q - Z"],
    }
  },
  // mounted() {
  //   this.$nextTick(() => {
  //     this.showing = true
  //   })
  // },
  methods: {
    async show() {
      await (this.$refs["modalBase"] as any)?.show()
    },
    async closeModal() {
      await (this.$refs["modalBase"] as any)?.hide()
      this.$emit("onClose")
    },
    getSlotName(index: number) {
      // console.log("INDEX IS")
      // console.log(index)
      return `tabPanel-${index + 1}`
    },
    getVSlotName(index: number) {
      return `tabPanel-${index + 1}`
    },
  },
  computed: {
    glossaryJson(): string | undefined {
      const glossaryJson = this.$store.getters["meta/getExtraJson"]("glossary")

      return glossaryJson ? glossaryJson : undefined
    },
  },
  props: [
    "titleAndText",
    "modalSize",
    "specialClass",
    "title",
    "subTitle",
    "text",
    "showing",
  ],

  components: { ModalBase, Tabs, GlossaryPage },
  // components: { ModalBase },
})
</script>

<style scoped lang="scss">
#todo-id {
  margin-top: 4em;
}
#glossary-modal-inner {
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 0em 1.5em 1em 1.5em;
  color: $gray;

  #glossary-title {
    color: $darkBlue;
    position: absolute;
    top: 0;
  }
  ::v-deep #glossary-tabs {
    font-size: 0.9em;
    line-height: 1.1em;

    .tabs-content {
      ul li {
        margin: 0.5em 0em;
      }
    }

    .tabs {
      margin-left: 8em;
      margin-top: 0.3em;
    }
    .tabs-content {
      // margin-left: -8em;
      width: calc(100%);
    }

    #glossary-terms-tabs,
    #glossary-terms-tabs-two {
      .tabs-list.vertical {
        width: 75px;
      }
      .tabs {
        margin-left: 0;
        margin-right: 0;
        padding-right: 0;
      }
      .tabs-content {
        padding-top: 1em;
        margin-left: 0em;
      }
    }
  }
  // #acronyms-container {
  //   padding-top: 1em;
  //   padding-left: 2em;
  // }
  #close-container {
    margin: 1.5em 0em 1em 0em;
    display: flex;
    flex-direction: row-reverse;
    width: calc(100% - 3em);
    position: absolute;
    bottom: 0;
    box-sizing: border-box;
    // padding-right: 3em;
    // padding-right: 3em;
  }

  #close-button {
    cursor: pointer;
    padding: 0.5em 1em;
  }
}
</style>
