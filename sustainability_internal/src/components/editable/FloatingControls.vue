<template>
  <VueDragResize
    :isActive="true"
    :w="180"
    :h="element === 'div' ? 234 : 140"
    :x="left"
    :y="top"
    :isResizable="false"
    v-on:dragging="dragFcn"
    id="floating-controls"
    v-if="editor"
  >
    <h3 class="editor-title editor-title-top" v-if="element === 'div'">
      Elements
    </h3>
    <div
      id="elements-container"
      class="button-wrapper"
      v-if="element === 'div'"
    >
      <button
        @click="editor.chain().focus().setParagraph().run()"
        :class="{ 'is-active': editor.isActive('paragraph') }"
      >
        <!-- paragraph -->
        <font-awesome-icon icon="paragraph" />
      </button>
      <button
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
      >
        <!-- h1 -->
        <font-awesome-icon icon="heading" class="heading-h1" />
      </button>
      <button
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
      >
        <!-- h2 -->
        <font-awesome-icon icon="heading" class="heading-h2" />
      </button>
      <button
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
      >
        <!-- h3 -->
        <font-awesome-icon icon="heading" class="heading-h3" />
      </button>
      <button
        @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
      >
        <!-- h4 -->
        <font-awesome-icon icon="heading" class="heading-h4" />
      </button>
      <button
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editor.isActive('orderedList') }"
      >
        <!-- ol -->
        <font-awesome-icon icon="list-ol" class="list" />
      </button>
      <button
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }"
      >
        <!-- ul -->
        <font-awesome-icon icon="list-ul" class="list" />
      </button>

      <button
        @click="editor.chain().focus().toggleCodeBlock().run()"
        :class="{ 'is-active': editor.isActive('codeBlock') }"
      >
        <!-- code block -->
        <font-awesome-icon icon="code" />
      </button>
      <button
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editor.isActive('blockquote') }"
      >
        <!-- blockquote -->
        <font-awesome-icon icon="quote-left" />
      </button>
      <button @click="editor.chain().focus().setHorizontalRule().run()">
        <!-- horizontal rule -->
        <span class="button-text">HR</span>
      </button>
      <button @click="editor.chain().focus().unsetAllMarks().run()">
        <!-- clear marks -->

        <span class="small-button-text">clr mks</span>
      </button>
      <button @click="editor.chain().focus().clearNodes().run()">
        <!-- clear nodes -->
        <span class="small-button-text">clr nds</span>
      </button>
    </div>
    <h3 class="editor-title" :class="{ 'editor-title-top': element !== 'div' }">
      <span v-if="element !== 'div'">{{ this.element.toUpperCase() }}</span>
      Styles
    </h3>
    <div id="styles-container" class="button-wrapper">
      <button
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
      >
        <!-- bold -->
        <font-awesome-icon icon="bold" />
      </button>

      <button
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
      >
        <!-- italic -->
        <font-awesome-icon icon="italic" />
      </button>
      <button
        @click="editor.chain().focus().toggleUnderline().run()"
        :class="{ 'is-active': editor.isActive('underline') }"
      >
        <!-- underline -->
        <font-awesome-icon icon="underline" />
      </button>
      <button
        @click="editor.chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strike') }"
      >
        <!-- strike-through -->
        <font-awesome-icon icon="strikethrough" />
      </button>
      <button
        @click="editor.chain().focus().toggleCode().run()"
        :class="{ 'is-active': editor.isActive('code') }"
      >
        <!-- code -->
        <font-awesome-icon icon="code" />
      </button>
      <button
        @click="editor.chain().focus().toggleHighlight().run()"
        :class="{ 'is-active': editor.isActive('highlight') }"
      >
        <!-- highlight -->
        <font-awesome-icon icon="pen" />
      </button>

      <button @click="editor.chain().focus().setHardBreak().run()">
        <!-- hard-break -->
        <span class="button-text">BR</span>
      </button>

      <button
        @click="editor.chain().focus().setTextAlign('left').run()"
        :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
      >
        <!-- text align left -->
        <font-awesome-icon icon="align-left" />
      </button>
      <button
        @click="editor.chain().focus().setTextAlign('center').run()"
        :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
      >
        <!-- text align center -->
        <font-awesome-icon icon="align-center" />
      </button>
      <button
        @click="editor.chain().focus().setTextAlign('right').run()"
        :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
      >
        <!-- text align right -->
        <font-awesome-icon icon="align-right" />
      </button>
      <button
        @click="editor.chain().focus().setTextAlign('justify').run()"
        :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"
      >
        <!-- text align justify -->
        <font-awesome-icon icon="align-justify" />
      </button>
      <button @click="editor.chain().focus().unsetTextAlign().run()">
        <!-- unset text align -->
        <div class="unset-text-align">
          <div class="times-wrapper">
            <font-awesome-icon icon="times" />
          </div>
          <font-awesome-icon icon="align-center" />
        </div>
      </button>

      <button
        @click="editor.chain().focus().toggleSuperscript().run()"
        :class="{ 'is-active': editor.isActive('superscript') }"
      >
        <!-- superscript -->
        <font-awesome-icon icon="superscript" />
      </button>
      <button
        @click="editor.chain().focus().toggleSubscript().run()"
        :class="{ 'is-active': editor.isActive('subscript') }"
      >
        <!-- subscript -->
        <font-awesome-icon icon="subscript" />
      </button>
      <button
        @click="setLink"
        :class="{ 'is-active': editor.isActive('link') }"
      >
        <!-- setLink -->
        <font-awesome-icon icon="link" />
      </button>
      <button
        @click="editor.chain().focus().unsetLink().run()"
        :disabled="!editor.isActive('link')"
      >
        <!-- unsetLink -->
        <font-awesome-icon icon="unlink" />
      </button>

      <button @click="editor.chain().focus().undo().run()">
        <!-- undo-->
        <font-awesome-icon icon="undo" />
      </button>
      <button @click="editor.chain().focus().redo().run()">
        <!-- undo-->
        <font-awesome-icon icon="redo" />
      </button>
    </div>
  </VueDragResize>
</template>

<script lang="ts">
import Vue from "vue"
import VueDragResize from "vue-drag-resize"

import { library } from "@fortawesome/fontawesome-svg-core"
import {
  faBold,
  faItalic,
  faUnderline,
  faStrikethrough,
  faAlignCenter,
  faCode,
  faSubscript,
  faSuperscript,
  faLink,
  faUnlink,
  faParagraph,
  faHeading,
  faListUl,
  faListOl,
  faPaintBrush,
  faQuoteLeft,
  faAlignLeft,
  faAlignRight,
  faAlignJustify,
  faPen,
  faUndo,
  faRedo,
} from "@fortawesome/free-solid-svg-icons"

library.add(
  faCode,
  faBold,
  faItalic,
  faUnderline,
  faStrikethrough,
  faAlignCenter,
  faSubscript,
  faSuperscript,
  faLink,
  faUnlink,
  faParagraph,
  faHeading,
  faListUl,
  faListOl,
  faPaintBrush,
  faQuoteLeft,
  faAlignLeft,
  faAlignRight,
  faAlignJustify,
  faPen,
  faUndo,
  faRedo
)

export default Vue.extend({
  name: "FloatingControls",
  data() {
    // return {
    //   top: 0,
    //   left: 0,
    // }
    return {}
  },
  methods: {
    dragFcn(newRect: any) {
      // this.top = newRect.top
      // this.left = newRect.left
      // if (this.editing && newRect.top && newRect.left) {
      let { top, left } = newRect
      this.$store.commit("editableText/changeCtrlPos", { top, left })
      // }
    },
    setLink() {
      const previousUrl = this.editor.getAttributes("link").href
      const url = window.prompt("URL", previousUrl)

      // cancelled
      if (url === null) {
        return
      }

      // empty
      if (url === "") {
        this.editor.chain().focus().extendMarkRange("link").unsetLink().run()

        return
      }

      // update link
      this.editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run()
    },
  },
  components: {
    VueDragResize,
  },
  computed: {
    top(): number {
      // return 10
      return this.$store.getters["editableText/getEditorPosition"]?.top
    },
    left(): number {
      // return 20
      return this.$store.getters["editableText/getEditorPosition"]?.left
    },
    editor(): any {
      // state.currentEditableID
      return this.$store.getters["editableText/getEditorData"]?.editor
    },
    element(): string {
      return this.$store.getters["editableText/getEditorData"]?.element
    },
  },
})
</script>

<style scoped lang="scss">
#floating-controls {
  font-family: sans-serif;
  z-index: 10000 !important;
  background: white;
  border: 1px solid #ccc;
  padding-left: 1px;
  padding-right: 1px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.25);
  // padding-top: 1em;
  padding-top: 0px;
  font-size: 0.8em;
  cursor: pointer;

  border-radius: 15px;
  &:before {
    outline: none;
  }
  .editor-title {
    border: 1px solid #ccc;
    right: 1px;
    width: calc(100% + 2px);
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    padding-left: 0.5em;
    margin: 0;
    box-sizing: border-box;
    position: relative;
  }
  .editor-title-top {
    border-radius: 15px 15px 0px 0px;
  }
  .button-wrapper {
    display: flex;
    flex-wrap: wrap;
    ::v-deep button {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: 0;
      border: none;
      outline: 1px solid #ccc;
      color: #5a5a5a;

      .heading-h1,
      .list {
        font-size: 1.4em;
      }
      .heading-h2 {
        font-size: 1.2em;
      }
      .heading-h3 {
        font-size: 1em;
      }
      .heading-h4 {
        font-size: 0.85em;
      }
      .heading-h5 {
        font-size: 0.7em;
      }
      .unset-text-align {
        .times-wrapper {
          position: absolute;
          color: #777;
          font-size: 1.1em;
          .fa-times {
            position: relative;
            left: 2px;
          }
        }
        .fa-align-center {
          color: #a8a8a8;
          font-size: 1.2em;
        }
      }
      .button-text {
        font-weight: bold;
        font-size: 0.9em;
      }
      .small-button-text {
        font-size: 0.85em;
        line-height: 0.9em;
        font-weight: bold;
      }

      &:hover {
        background: #eee;
        cursor: pointer;
        color: black;
        box-shadow: inset 0px 0px 0px 1px #888, inset -1px -1px 0px 1px #888;
      }
      &.is-active {
        box-shadow: inset 0px 0px 0px 1px black, inset -1px -1px 0px 1px black;
        font-weight: bold;
        background: #ddd;
      }
    }
  }
}
</style>
