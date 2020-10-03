<template >
  <div class="vx-col w-full mb-base">
    <vx-card>
      <div class="vx-row justify-between">
        <div class="vx-col">
          <h4>Texte</h4>
        </div>
        <div class="vx-row">
          <div class="vx-col" v-if="!block.body.edit" @click="edit(block)">
            <feather-icon icon="EditIcon" svgClasses="h-6 w-4" />
          </div>
          <div class="vx-col" v-if="block.body.edit" @click="edit(block),reRender()">
            <feather-icon icon="SaveIcon" svgClasses="h-6 w-4" />
          </div>
          <div
            class="vx-col mr-2"
            v-if="tvuemathdisplay"
            @click="()=>{block.body.edit=false;tvuemathdisplay=false}"
          >
            <feather-icon icon="ChevronUpIcon" svgClasses="h-6 w-4" />
          </div>
          <div
            class="vx-col mr-2"
            v-if="!tvuemathdisplay"
            @click="()=>{tvuemathdisplay=!block.body.edit?true:false}"
          >
            <feather-icon icon="ChevronDownIcon" svgClasses="h-6 w-4" />
          </div>
          <div class="vx-col mr-2" @click="delSinglePopup=true">
            <feather-icon icon="XIcon" svgClasses="h-6 w-4" />

              <!-- delete popup -->

             <vs-popup
                  class="text-center"
                  title="Supprimer Le texte"
                  :active.sync="delSinglePopup"
                >
                  <p
                    class="mb-4 text-center"
                  >Etes vous sur de vouloir supprimer cet element ? Tout le contenu sera perdu</p>
                  <div class="flex justify-center">
                    <vs-button
                      class="mr-2"
                      @click="delSinglePopup=false"
                      color="warning"
                      type="filled"
                    >Non</vs-button>
                    <vs-button
                      class="ml-2"
                      @click.stop="deleteblock()"
                      color="danger"
                      type="filled"
                    >Oui</vs-button>
                  </div>
                </vs-popup>
            
          </div>
        </div>
      </div>
      <quill-editor v-if="block.body.edit" :options="options" v-model="block.body.text"></quill-editor>
      <div v-if="tvuemathdisplay && !block.body.edit">
        <!-- <vue-mathjax :formula="tquillContentMathJax(block.body.text)" @dblclick="edit(block)"></vue-mathjax> -->
        <div slot="media" class="wrp" v-html="text"></div>
        <!-- <div :key="content">div1{{content}}</div> -->
        <!-- Latex -->
        <!-- <input v-model="latex" />
        <br />
        <div :key="latex">div2{{latex}}</div>-->
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
  name: "text-item",
  props: {
    block: Object,
  },
  components: {
    "vue-mathjax": VueMathjax,
    quillEditor,
  },
  // created() {
  //   this.block.body.edit = true;
  // },
  data() {
    return {
      delSinglePopup : false,
      tquillContent: "",
      tvuemathdisplay: true,
      content: "",
      latex:
        "$$\\frac{a}{b}$$ $${\\sqrt{2}^\\sqrt{2}}^\\sqrt{2} = 2 \\\\ \\sqrt{2}^{2\\log_{2}{3}} = 3$$",
      options: {
        // modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          [{ header: 1 }, { header: 2 }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ direction: "rtl" }],
          [{ size: ["small", false, "large", "huge"] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ["clean"],
          ["link", "image"], //, "video"]
        ],
        //   clipbord: {
        //     matchVisual: false,
        //   },
        //   // syntax: {
        //   //   highlight: text => hljs.highlightAuto(text).value
        //   // }
        // },
      },
    };
  },
  methods: {
    edit(block) {
      this.content = this.block.body.text;
      this.$emit("editTextBlock", block);
      this.reRender();
    },
    deleteblock() {

       new Promise((resolve, reject) => {
        this.delSinglePopup = false;
        resolve();
      }).then(() => {
         this.$emit("deleteTextBlock");
      });
    },
    // tquillContentMathJax(s) {
    //   return s
    //     .replace(/<p>/g, "")
    //     .replace(/<\/p>/g, " ")
    //     .replace(/<strong>/g, "")
    //     .replace(/<\/strong>/g, " ")
    //     .replace(/<em>/g, "")
    //     .replace(/<\/em>/g, " ")
    //     .replace(/<u>/g, "")
    //     .replace(/<\/u>/g, " ")
    //     .replace(/"<br>"/g, " ");
    // },
    reRender() {
      if (window.MathJax) {
        //
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub], () =>
          console.log("rendering done")
        );
      }
    },
  },
  watch: {
    latex: function () {
      this.$nextTick().then(() => {
        this.reRender();
      });
    },
    content: function () {
      this.$nextTick().then(() => {
        this.reRender();
      });
    },
  },
  computed: {
    text() {
      return this.block.body.text.replaceAll(
        "<img",
        "<img style='width:100%' "
      );
    },
  },
  created() {
    this.content = this.block.body.text;
  },
  mounted() {
    this.reRender();
  },
};
</script>
<style scoped lang="scss">
div.wrp {
  word-wrap: break-word;
  width: 100% !important;
}
// .wrp  {
//   width: 100% !important; /* Or whatever */
//   height: 50px !important; /* Or whatever */
//   max-width: 100%;
// }
</style>
