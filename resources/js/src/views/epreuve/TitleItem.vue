<template >
  <div class="vx-col w-full mb-base">
    <vx-card>
      <div class="flex sm:flex-row flex-col-reverse justify-between">
        <div class="vx-col">
          <input
            type="text"
            :placeholder="'Titre de '+ (block.part?'la partie':'l\'exercice')"
            @keyup.enter="edit(block)"
            v-model="block.text"
            v-if="block.edit"
          />
          <h4 @dblclick="edit(block)" v-else>{{block.text}}</h4>
        </div>
        <div class="vx-row justify-end">
          <!-- <div class="vx-col">
                        <vs-button @click="block.edit=!block.edit">toggle</vs-button>
          </div>-->
          <div class="vx-col">
            <div class="vx-row">
              <label class="mr-2">{{block.part?"Partie": "Exercice/Problème"}}</label>
              <vs-switch color="success" v-model="block.part" />
            </div>
          </div>
          <div class="vx-col" v-if="!block.edit" @click="edit(block)">
            <feather-icon icon="EditIcon" svgClasses="h-6 w-4" />
          </div>
          <div class="vx-col" v-if="block.edit" @click="edit(block)">
            <feather-icon icon="SaveIcon" svgClasses="h-6 w-4" />
          </div>
          <div class="vx-col mr-2" @click="deleteblock()">
            <feather-icon icon="XIcon" svgClasses="h-6 w-4" />
          </div>
        </div>
      </div>
    </vx-card>
  </div>
</template>

<script>
import { VueMathjax } from "vue-mathjax";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
export default {
  name: "title-item",
  props: {
    block: Object,
  },
  components: {
    "vue-mathjax": VueMathjax,
    quillEditor,
  },
  data() {
    return {
      options: {
        //   modules: {
        //     toolbar: [
        //       ["bold", "italic", "underline", "strike"],
        //       ["blockquote", "code-block"],
        //       [{ header: 1 }, { header: 2 }],
        //       [{ list: "ordered" }, { list: "bullet" }],
        //       [{ script: "sub" }, { script: "super" }],
        //       [{ indent: "-1" }, { indent: "+1" }],
        //       [{ direction: "rtl" }],
        //       [{ size: ["small", false, "large", "huge"] }],
        //       [{ header: [1, 2, 3, 4, 5, 6, false] }],
        //       [{ font: [] }],
        //       [{ color: [] }, { background: [] }],
        //       [{ align: [] }],
        //       ["clean"],
        //       ["link", "image"], //, "video"]
        //     ],
        //     clipbord: {
        //       matchVisual: false,
        //     },
        //     // syntax: {
        //     //   highlight: text => hljs.highlightAuto(text).value
        //     // }
        //   },
      },
    };
  },
  methods: {
    edit(block) {
      this.$emit("editTitleBlock", block);
    },
    deleteblock() {
      this.$emit("deleteTitleBlock");
    },
  },
};
</script>