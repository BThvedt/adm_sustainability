//
<template></template>

//
<script lang="ts">
// import Vue from "vue"

// // the strategy is to watch unsaved data.
// // when a new key is added, emit an event
// // the "parent app" then gets that data. It adds it to it's tore
// // then when the server is done saving, this componet gets and event with the successful ids'
// // the succesful ids get removed from unsaved data and added to the data from server

// // data from server also gets fetched when the app starts. So it should also be up to date

// // CURRENTLY .. let's do live updates, but only one editor at at time. This is a TO DO..
// // later in the future plan to leverage the tiptap api to do multiple editors on text

// export default Vue.extend({
//   data() {
//     return {}
//   },
//   computed: {
//     unsavedTextData(): any {
//       return this.$store.getters["editableText/getUnsavedData"]
//     },
//     watch: {
//       unsavedTextData(nv: any, ov: any) {
//         // find any keys that aren't in the old value
//         console.log("asdf")
//         let newKeys = Object.keys(nv)
//         let oldKeys = Object.keys(ov)

//         newKeys.forEach((key) => {
//           if (!oldKeys.includes(key)) {
//             if ((window as any).bus) {
//               console.log('TEXT UPDATE IS')
//               ;(window as any).bus.$emit("text-update", nv[key])
//             }
//           }
//         })
//       },
//     },
//   },
// })
//
</script>

//
<style lang="scss"></style>
