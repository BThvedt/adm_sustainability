<template>
  <div>
    <ul>
      <li v-for="(term, index) in terms" :key="index">
        <!-- <p v-html="term.e_title" class="term-title" /> -->
        <E :h="term.e_title" t="p" class="term-title" />
        -&nbsp;
        <!-- <div v-html="term.e_text" class="term-text" /> -->
        <E :h="term.e_text" t="div" class="term-text" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import E from "@/components/editable/E.vue"

export default Vue.extend({
  name: "GlossaryPage",
  components: { E },
  data() {
    return {}
  },
  props: ["terms"],
})
</script>

<style scoped lang="scss">
ul {
  margin: 0;
  padding: 0;
  column-count: 2;

  ::v-deep li {
    break-inside: avoid;
    -webkit-column-break-inside: avoid;
    page-break-inside: avoid;
    margin: 1em 0em;
    &:first-of-type {
      margin-top: 0em;
    }
    list-style: none;
    .term-title,
    .term-text,
    .term-text > p {
      display: inline;
    }
    .term-title {
      font-weight: bold;
      color: black;
    }
    .term-text {
      ul {
        margin-top: 1em;
      }
      ul li {
        margin: 0;
        padding: 0;
        list-style: disc;
      }
      ul li p {
        margin: 0;
        padding: 0;
      }
    }
  }
}
</style>
