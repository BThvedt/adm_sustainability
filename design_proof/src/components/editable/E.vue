<template>
  <!-- <span
    @click="startEditing($event)"
    v-if="!editing"
    ref="textSpan"
    class="editable-text-span"
    :class="{ readyToEdit: readyToEdit }"
    >{{ t }}</span
  > -->

  <component
    :is="t"
    @mousedown="startEditing($event)"
    v-if="!editing"
    ref="textSpan"
    class="editable-text-span"
    :class="{ readyToEdit: readyToEdit }"
    v-html="html"
    @click="clickedWhileNotEditing"
  />
  <div
    v-else-if="editing"
    class="animate__animated animate__fadeIn"
    :class="{ waitingForDelay: !smallDelayDone }"
    @click="clickedWhileEditing($event)"
    ref="editorArea"
  >
    <editor-content :editor="editor" />
  </div>
  <!-- <textarea
    class="editable-textarea"
    v-else-if="editing"
    v-model="html"
    ref="textArea"
    :style="style"
    @click="clickedWhileEditing($event)"
  ></textarea> -->
</template>

<script lang="ts">
import Vue from "vue"
import { makeRandomString } from "@/lib/randomFunctions"
import { Editor, EditorContent } from "@tiptap/vue-2"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Superscript from "@tiptap/extension-superscript"
import Subscript from "@tiptap/extension-subscript"
import Link from "@tiptap/extension-link"
import Highlight from "@tiptap/extension-highlight"
import TextAlign from "@tiptap/extension-text-align"
import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "prosemirror-state"

const regex =
  /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/

// https://tiptap.dev/guide/custom-extensions
// if the element isn't a div, ol, or ul.. force a "hard break" on keydown
const CustEnterExtension = Extension.create({
  // Your code here
  name: "returnHandler",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleKeyDown: (view, event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              // do something
              return true
            }

            return false
          },
        },
      }),
    ]
  },
})

// NEXT STEP: IF build mode.. maybe unnecessary. Since now the plan is just to replace this component with just a span with plain text when delivering
// and taking out the store. OK. NExT STEP is IF ENV VAR (rename the var) is set.. read from /public instead of /data, and enable/disable editing functionality
// get the pageID/sectionID from .. route I guess since these will always be displayed on section/page. An alternative would be "parent" .. might be better tbh, would work with non-pager formats
// for now just use the route I guess.
// then simulate using id's/values in store. Make server tomorrow.

export default Vue.extend({
  name: "E",
  data() {
    return {
      editable: process.env.VUE_APP_EDITABLE_TEXT === "true" ? true : false,
      randID: "", // just lazy and don't want to figure out some way of making these myself
      editing: false,
      editor: null as any | null,
      textData: {} as any,
      unwrapBeforeSave: false,
      tagsToReplace: [] as string[],
      smallDelayDone: false, // THERE IS A BUG IF THIS IS DOUBLE CLICKED TOO FAST
      smallDelayInterval: null as null | number,
      html: " ",
      style: {},
      rows: 0,
    }
  },
  mounted() {
    // this.text = this.t

    if (this.h.match(regex)) {
      // need getters. LOOK in Data to be saved first...
      // then "downloaded data" second ...
      // finally in textData third ...

      // let dataGetter: any

      // is the data "unsaved"?
      // this.textData = this.$store.getters[
      //   "editableText/getAlteredButUnsavedTextData"
      // ](this.h)

      // note .. this loads .. on mount . but MIGHT NOT be loaded
      if (!this.textData?.html) {
        this.textData = this.$store.getters["editableText/getTextData"](this.h)
      }

      if (this.textData.html) {
        this.html = this.textData.html
      }
    } else {
      this.html = this.h
    }

    this.randID = makeRandomString()

    // https://www.w3schools.com/jsref/prop_node_parentelement.asp
  },
  methods: {
    clickedWhileNotEditing() {
      this.$emit("click")
    },
    clickedWhileEditing(e: MouseEvent) {
      e.stopPropagation()
    },
    startEditing(e: MouseEvent) {
      if (this.editable && this.readyToEdit) {
        e.stopPropagation() // this will avoid triggering the body clicked ticker
        if (!this.editing) {
          this.editing = true
          this.$store.dispatch("editableText/setCurrentEditableID", this.randID)

          // THERE IS A BUG IF THIS IS DOUBLE CLICKED TOO FAST
          // So this is my attempt to stop the bug. This controls a class wiht
          // an important no-pointer-events rule
          this.smallDelayInterval = setTimeout(() => {
            this.smallDelayDone = true
          }, 350)

          if (this.h.match(regex)) {
            // The PARENT is what cares about the saving of text data
            // this.textData = this.$store.getters[
            //   "editableText/getAlteredButUnsavedTextData"
            // ](this.h)

            //if (!this.textData?.html) {
            this.textData = this.$store.getters["editableText/getTextData"](
              this.h
            )
            // console.log("starting to edit")
            // console.log(this.textData)
            //}
            if (this.textData.html) {
              this.html = this.textData.html
            }
          }
        } else if (!this.smallDelayDone) {
          this.editing = false
        }
      }
    },
  },
  computed: {
    readyToEdit(): boolean {
      return this.editable && this.$store.getters["editableText/getReadyToEdit"]
    },

    bodyClickTicker(): number {
      return this.$store.getters["meta/getBodyClickTicker"]
    },
    currentEditableId() {
      // state.currentEditableID
      return this.$store.getters["editableText/currentEditableID"]
    },
    parentOrigin(): string {
      return this.$store.getters["editableText/getParentOrigin"]
    },
  },
  watch: {
    currentEditableId(newVal) {
      if (newVal != this.randID) {
        this.editing = false
      }
    },
    bodyClickTicker() {
      this.editing = false
    },
    editing(nv, ov) {
      if (nv === true) {
        let extensions = [
          StarterKit,
          Underline,
          Superscript,
          Subscript,
          Link,
          Highlight.configure({ multicolor: true }),
          TextAlign.configure({
            types: ["heading", "paragraph"],
          }),
        ]

        if (this.t !== "div" && this.t !== "ul" && this.t !== "ol") {
          extensions.push(CustEnterExtension)
        }

        // MAKE THE EDITOR HERE
        // if (nv === true) {
        switch (this.t) {
          case "label":
            this.unwrapBeforeSave = true
            this.tagsToReplace = ["<p>", "</p>"]
            break
          case "p":
            this.unwrapBeforeSave = true
            this.tagsToReplace = ["<p>", "</p>"]
            break
          case "h1":
            this.unwrapBeforeSave = true
            this.tagsToReplace = ["<p>", "</p>", "<h1>", "</h1>"]
            break
          case "h2":
            this.unwrapBeforeSave = true
            this.tagsToReplace = ["<p>", "</p>", "<h2>", "</h2>"]
            break
          case "h3":
            this.unwrapBeforeSave = true
            this.tagsToReplace = ["<p>", "</p>", "<h3>", "</h3>"]
            break
          case "h4":
            this.unwrapBeforeSave = true
            this.tagsToReplace = ["<p>", "</p>", "<h4>", "</h4>"]
            break
          case "h5":
            this.unwrapBeforeSave = true
            this.tagsToReplace = ["<p>", "</p>", "<h5>", "</h5>"]
            break
        }

        let self = this
        this.editor = new Editor({
          content: this.html,
          extensions,
          onUpdate({ editor }) {
            // The content has changed.
            // console.log("UPDATE")
            // console.log(editor.getHTML())

            // I'm preeeety sure this.h will always be uuid.. BUT .. MAKE SURE ..
            if (self.h.match(regex)) {
              let textToBeSaved = editor.getHTML()

              if (self.unwrapBeforeSave) {
                self.tagsToReplace.forEach((tag) => {
                  textToBeSaved = textToBeSaved.replace(tag, "")
                })
              }

              // sets the text back in text data
              self.$store.dispatch("editableText/setChangedText", {
                id: self.h, // a uuid
                textData: {
                  id: self.textData.id ? self.textData.id : undefined,
                  html: textToBeSaved,
                  editedByName: "",
                  editedByID: "",
                  editedByTime: new Date().getUTCDate(),
                },
              })

              // unsaved changes in store. Use a computed value to get the unsaved changes
              // then watch that value to send changes to the server

              // or just do it here ..
              // parent.postMessage({ bar: "(from e component)" }, "*")

              // if we have textdata from a live source, it will have an id

              if (
                process.env.VUE_APP_RUN_MODE === "module_portal" &&
                process.env.VUE_APP_EDITABLE_TEXT === "true"
              ) {
                // console.log("about to post text data")
                // console.log(self.textData)
                parent.postMessage(
                  {
                    type: "textdata",
                    data: {
                      id: self.h,
                      // key: self.h,
                      html: textToBeSaved,
                      editedByName: "",
                      editedByID: "",
                      editedByTime: new Date().getUTCDate(),
                      needsUnwrapping: self.unwrapBeforeSave,
                      tagsToReplace: self.tagsToReplace,
                    },
                  },
                  self.parentOrigin
                )
              }
            }
          },
        })

        switch (this.t) {
          case "p":
            this.editor.chain().focus().setParagraph().run()
            break
          case "h1":
            this.editor.chain().focus().toggleHeading({ level: 1 }).run()
            break
          case "h2":
            this.editor.chain().focus().toggleHeading({ level: 2 }).run()
            break
          case "h3":
            this.editor.chain().focus().toggleHeading({ level: 3 }).run()
            break
          case "h4":
            this.editor.chain().focus().toggleHeading({ level: 4 }).run()
            break
          case "h5":
            this.editor.chain().focus().toggleHeading({ level: 5 }).run()
            break
          case "ol":
            this.editor.chain().focus().toggleBulletList().run()
            break
          case "ul":
            this.editor.chain().focus().toggleCodeBlock().run()
            break
          default:
            this.editor.chain().focus().setParagraph().run()
            break
        }

        // give divs full controlls
        this.$store.commit("editableText/setEditor", {
          id: this.randID,
          editor: this.editor,
          element: this.t,
        })
      } else {
        this.smallDelayDone = false
        clearTimeout(this.smallDelayInterval || undefined)
        if (this.editor) {
          if (this.html) {
            let newHtml = this.editor.getHTML()
            if (this.unwrapBeforeSave) {
              // let newHtml = this.html
              this.tagsToReplace.forEach((tag) => {
                newHtml = newHtml.replace(tag, "")
              })
              // this.html = newHtml
            }
            this.html = newHtml
          }

          this.$store.commit("editableText/unsetEditor", {
            id: this.randID,
          })
          this.editor.destroy()
        }
      }
    },
    beforeDestroy() {
      if (this.editor) {
        this.$store.commit("editableText/unsetEditor", {
          id: this.randID,
        })
        this.editor.destroy()
      }
    },
  },
  components: { EditorContent },
  props: ["h", "t"],
})
</script>

<style scoped lang="scss">
.textDiv {
  display: inline;
}
.editable-text-span {
  &.readyToEdit {
    background: cyan !important;
    box-shadow: 0px 0px 7px 3px rgba(0, 0, 0, 0.2);
  }
}
.editable-textarea {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  outline: none;
}
.waitingForDelay {
  pointer-events: none !important;
  // background: orange;
  transition: 0.25s all;
}
</style>
