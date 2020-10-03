<template>
  <div class="vx-col w-full mb-base">
    <vx-card>
      <div class="mb-2">
        <div class="flex justify-between">
          <h3>Question</h3>
          <div class="flex">
            <div class="vx-row pr-8">
              <div class="vx-col">
                <div class="vx-row">
                  <label class="mr-2">{{ block.body.qcm ?"QCM":"QRO"}}</label>
                  <vs-switch
                    class="mr-1"
                    @click="enableQcm(block), block.body.has_qcm=false"
                    color="success"
                    v-model="block.body.qcm"
                  />
                  <vs-popup
                    :button-close-hidden="true"
                    title
                    :active.sync="popAppear"
                    class="text-center"
                  >
                    <p
                      class="mb-4"
                    >Vouler vous changer le Type de la question a QRO ? Toutes les champs enregistrer vont etre supprimer</p>
                    <vs-button
                      class="mr-2"
                      @click="popAppear=false, block.body.qcm = true;"
                      color="warning"
                      type="filled"
                    >Non</vs-button>
                    <vs-button
                      class="ml-2"
                      @click="resetData(), popAppear=false"
                      color="danger"
                      type="filled"
                    >Oui</vs-button>
                  </vs-popup>
                </div>
              </div>
              <div class="vx-col">
                <div class="vx-row">
                  <div v-if="!block.body.qcm " class="dropdown-button-container">
                    <vs-dropdown>
                      <feather-icon class="btn-drop" icon="PlusIcon" svgClasses="h-6 mx-2 w-4" />
                      <vs-dropdown-menu>
                        <vs-dropdown-item
                          v-if="!block.body.has_qcm"
                          @click="block.body.has_qcm=true, enableQcm(block), block.body.qcm=false"
                        >Ajouter le QCM</vs-dropdown-item>
                        <vs-dropdown-item v-else @click="block.body.has_qcm=false">Enlever le QCM</vs-dropdown-item>
                      </vs-dropdown-menu>
                    </vs-dropdown>
                  </div>
                </div>
              </div>
            </div>

            <div class="vx-row flex-no-wrap justify-end">
              <div
                class="vx-col"
                v-if="qvuemathdisplay"
                @click="()=>{qvuemathdisplay=false; rvuemathdisplay=false}"
              >
                <feather-icon icon="ChevronUpIcon" svgClasses="h-6 w-4" />
              </div>
              <div
                class="vx-col"
                v-if="!qvuemathdisplay"
                @click="()=>{qvuemathdisplay = true; rvuemathdisplay = true; }"
              >
                <feather-icon icon="ChevronDownIcon" svgClasses="h-6 w-4" />
              </div>
              <div class="vx-col" @click="delSinglePopup=true">
                <feather-icon icon="XIcon" svgClasses="h-6 w-4" />

                <!-- pop pop for delete -->

                <vs-popup
                  class="text-center"
                  title="Supprimer La Question"
                  :active.sync="delSinglePopup"
                >
                  <p
                    class="mb-4 text-center"
                  >Etes vous sur de vouloir supprimer cette question? Tout le contenu sera perdu</p>
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
        </div>
      </div>
      <!-- QRO section -->
      <div v-if="qvuemathdisplay && !block.body.qcm">
        <div class="flex justify-between">
          <div class="vx-col">
            <h4 class="mt-2 md:mt-0">Intitulé de la question</h4>
          </div>

          <div class="flex">
            <div class="vx-col" v-if="block.body.qedit" @click="edit(block,'q', qquillContent)">
              <feather-icon icon="SaveIcon" svgClasses="h-6 w-4" />
            </div>
            <div class="vx-col" v-else @click="()=>{edit(block,'q', qquillContent)}">
              <feather-icon icon="EditIcon" svgClasses="h-6 w-4" />
            </div>
          </div>
        </div>
        <quill-editor
          class="mt-4 lg:mt-0"
          v-if="qvuemathdisplay && block.body.qedit"
          :options="options"
          v-model="qquillContent"
        ></quill-editor>
        <div
          class="mt-3"
          v-if="qvuemathdisplay && !block.body.qedit"
          @dblclick="edit(block,'q', qquillContent)"
        >
          <div class="wrp" v-html="qquillContent_html"></div>
          <!-- <vue-mathjax :formula="qquillContentMathJax"></vue-mathjax> -->
        </div>
      </div>
      <div v-if="qvuemathdisplay">
        <!-- response -->
        <div v-if="qvuemathdisplay && !block.body.qcm" class="mb-4 mt-4">
          <div class="vx-row justify-between" v-if="qvuemathdisplay">
            <div class="vx-col">
              <h4>Réponse détaillée</h4>
            </div>
            <div class="vx-row m-0 justify-end flex-1 align-center">
              <!-- <vs-dropdown> -->

              <vs-input-number
                class="m-0 text-xs font-bold"
                v-if="block.body.eredit"
                v-model="block.body.points"
                label="points:"
                size="mini"
                min="1"
                icon-inc="expand_less"
                icon-dec="expand_more"
              />
              <!-- <vs-dropdown-menu>
                  <div>Vous pouvez clicker pour editer</div>
              </vs-dropdown-menu>-->
              <!-- </vs-dropdown> -->
              <span
                v-if="!block.body.eredit"
              >{{block.body.points+(block.body.points>1?' pts':' pt')}}</span>
              <!-- this is the container of actions when we are on edit mode -->

              <div
                class="vx-col mr-2"
                v-if="block.body.eredit"
                @click="edit(block,'er', rquillContent)"
              >
                <feather-icon icon="SaveIcon" svgClasses="h-6 w-4" />
              </div>
              <div class="vx-col mr-2" v-else @click="()=>{edit(block,'er', rquillContent)}">
                <feather-icon icon="EditIcon" svgClasses="h-6 w-4" />
              </div>
            </div>
          </div>
          <quill-editor
            class="mt-3"
            v-if="block.body.eredit"
            :options="options"
            v-model="rquillContent"
          ></quill-editor>
          <div
            class="mt-2"
            v-if="rvuemathdisplay && !block.body.eredit"
            @dblclick="edit(block,'er', rquillContent)"
          >
            <div class="wrp" v-html="rquillContent_html"></div>
            <!-- ?block.body.eredit=block.body.eredit:block.body.eredit=!block.body.eredit -->
            <!-- <vue-mathjax :formula="rquillContentMathJax"></vue-mathjax> -->
          </div>
        </div>
        <!-- QCM -->
        <div class="mb-2" v-if="qvuemathdisplay && (block.body.qcm || block.body.has_qcm )">
          <div class="vx-row justify-between">
            <template>
              <div class="flex flex-col md:flex-row justify-between w-full px-4 my-4">
                <div class="vx-col">
                  <h4>Intitulé de la question(QCM)</h4>
                </div>
                <div class="ml-auto vx-col justify-end">
                  <div class="vx-row">
                    <div v-if="!block.body.qcm && block.body.has_qcm" class="vx-col">
                      <div class="vx-row mr-2">
                        <label
                          class="mr-2"
                        >{{!block.body.qcmquestion?'Même intitulé': 'Intitulé différent'}}</label>
                        <vs-switch color="success" v-model="block.body.qcmquestion" />
                      </div>
                    </div>
                    <div class="mr-2" v-if="block.body.qcmquestion || block.body.qcm">
                      <div
                        class="vx-col"
                        v-if="block.body.qqedit"
                        @click="()=>{ choice(block); edit(block, 'qq', block.body.qcmquestiontext); qqvuemathdisplay = true;}"
                      >
                        <feather-icon icon="SaveIcon" svgClasses="h-6 w-4" />
                      </div>
                      <div
                        class="vx-col"
                        v-else
                        @click="()=>{choice(block);edit(block, 'qq', block.body.qcmquestiontext); }"
                      >
                        <feather-icon icon="EditIcon" svgClasses="h-6 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <quill-editor
            class="mt-3"
            v-if="block.body.qqedit"
            :options="options"
            v-model="block.body.qcmquestiontext"
          ></quill-editor>
          <div
            v-if="qqvuemathdisplay && !block.body.qqedit"
            @dblclick="choice(block);edit(block,'qq', block.body.qcmquestiontext)"
          >
            <div class="wrp" v-html="qqquillContent_html"></div>
            <!-- <vue-mathjax :formula="qqquillContentMathJax"></vue-mathjax> -->
          </div>
        </div>
        <!-- Réponse au QCM -->
        <div class="mt-4 mb-2" v-if="qvuemathdisplay && (block.body.qcm || block.body.has_qcm) ">
          <div class="vx-row justify-between">
            <template>
              <div class="flex flex-col-reverse sm:flex-row justify-between w-full px-4">
                <div class="vx-col">
                  <h4>Réponse au QCM (Choix)</h4>
                </div>
                <div class="vx-col">
                  <div class="vx-row justify-end">
                    <div class="vx-col">
                      <div class="vx-row mr-2">
                        <!-- <label class="mr-2">Choix</label> -->
                        <!-- <vs-switch color="success" v-model="block.body.list" /> -->
                      </div>
                    </div>
                    <div class="mr-2" @click="()=>{choice(block);edit(block, 'r', null);}">
                      <!-- ?block.body.redit=block.body.redit:block.body.redit=!block.body.redit; -->
                      <div
                        class="vx-col"
                        v-if="block.body.redit"
                        @click="()=>{ rvuemathdisplay = true;}"
                      >
                        <feather-icon icon="SaveIcon" svgClasses="h-6 w-4" />
                      </div>
                      <div class="vx-col" v-else @click="()=>{ rvuemathdisplay = false }">
                        <feather-icon icon="EditIcon" svgClasses="h-6 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <!-- <div v-if="!block.body.list">
            <vs-input
              class="w-full"
              v-if="block.body.redit"
              label-placeholder="Réponse du qcm"
              v-model="block.body.value"
            />
            <div v-if="rvuemathdisplay && !block.body.redit" @dblclick="edit(block, 'r', null)">
              <vue-mathjax :formula="block.body.value"></vue-mathjax>
            </div>
          </div>-->
        </div>
        <!-- Choix -->
        <div v-if="block.body.redit">
          <template v-if="qvuemathdisplay && (block.body.qcm || block.body.has_qcm )">
            <vs-table
              multiple
              v-model="selected"
              @selected="editoptioncheck(block, block.body.options)"
              :pagination="pagination"
              max-items="3"
              :data="block.body.options"
            >
              <template slot="thead">
                <vs-th sort-key="choix">Choix</vs-th>
                <vs-th sort-key="action">Actions</vs-th>
                <!-- <vs-th sort-key="website">Website</vs-th>
                <vs-th sort-key="id">Nro</vs-th>-->
              </template>

              <template v-if="block.body.options.length > 0" slot-scope="{data}">
                <vs-tr :data="option" :key="indextr" v-for="(option, indextr) in data">
                  <vs-td
                    :data="data[indextr].value"
                    @dblclick="block.body.redit?_editoption(block,option):''"
                    v-html="setImageSize(data[indextr].value)"
                  ></vs-td>
                  <vs-td class="whitespace-no-wrap">
                    <feather-icon
                      v-if="!option.edit"
                      icon="EditIcon"
                      @click="_editoption(block,option)"
                      svgClasses="w-5 h-5 hover:text-primary stroke-current"
                    />
                    <feather-icon
                      v-else
                      icon="SaveIcon"
                      @click="_editoption(block,option)"
                      svgClasses="w-5 h-5 hover:text-primary stroke-current"
                    />
                    <feather-icon
                      icon="TrashIcon"
                      svgClasses="w-5 h-5 hover:text-danger stroke-current"
                      class="ml-2"
                      v-if="!option.edit"
                      @click.stop="deleteoption(block.body.options, indextr)"
                    />
                  </vs-td>
                  <!-- <vs-td :data="data[indextr].username">{{ data[indextr].username }}</vs-td>
    
                              <vs-td :data="data[indextr].id">{{ data[indextr].website }}</vs-td>
    
                  <vs-td :data="data[indextr].id">{{ data[indextr].id }}</vs-td>-->
                </vs-tr>
              </template>
              <template v-else>
                <vs-tr>
                  <vs-td>Aucune option disponible</vs-td>

                  <!-- <vs-td :data="data[indextr].username">{{ data[indextr].username }}</vs-td>
    
                              <vs-td :data="data[indextr].id">{{ data[indextr].website }}</vs-td>
    
                  <vs-td :data="data[indextr].id">{{ data[indextr].id }}</vs-td>-->
                </vs-tr>
              </template>
            </vs-table>
            <template>
              <vs-tr class="relative">
                <div v-if="block.body.options.length>=5" @click="notifyMax()" class="absolute abv"></div>
                <quill-editor :options="options" v-model="choicequillContent"></quill-editor>
                <vs-button
                  class="success float-right mt-1"
                  v-if="!isEditingOption(block.body.options)"
                  @click.stop="addoption(block)"
                >Ajouter un choix</vs-button>
              </vs-tr>
            </template>
            <!-- <pre>{{choicequillContent}}</pre>
            <pre> {{ selected }} test {{block.body.options.length === 0}} </pre>-->
          </template>
        </div>
        <!-- list of questions after edit -->
        <div v-if="(block.body.qcm || block.body.has_qcm)  && !block.body.redit" class="ans mb-5">
          <ul class>
            <li
              class="font-bold text-black p-1 w-full overflow-hidden"
              :class="item.response==true ? 'Green' : 'bg-transparent' "
              v-for="(item,itemIndex) in block.body.options"
              :key="itemIndex"
            >
              <vs-checkbox disabled="true" v-model="item.response">
                <div class="ml-2" v-html="item.value"></div>
                <!-- <span v-if="item.response==true" class="ml-3">(Reponse)</span> -->
              </vs-checkbox>
            </li>
          </ul>
        </div>
        <!-- chapter -->
        <div>
          <div class="flex justify-between">
            <h4>Chapitre et Notion</h4>
            <feather-icon
              class
              v-if="!block.body.cedit"
              icon="EditIcon"
              @click="edit(block, 'c', null)"
              svgClasses="w-4 h-4 hover:text-primary stroke-current"
            />
            <feather-icon
              class
              v-else
              icon="SaveIcon"
              @click="edit(block, 'c', null)"
              svgClasses="w-4 h-4 hover:text-primary stroke-current"
            />
          </div>
          <div v-if="!block.body.cedit">
            <div class="flex flex-wrap">
              <p class="my-1 mr-3">
                <strong>Chapitre:</strong>
                {{block.body.chapter.title}}
              </p>
              <p class="my-1 mr-3">
                <strong>Notion(s):</strong>
                {{notions_label}}
              </p>
            </div>
          </div>
          <div v-if="block.body.cedit" class="flex flex-wrap justify-center">
            <div class="vs-holder w-full sm:w-1/2 px-2">
              <div class="label">Chapitre</div>
              <v-select
                name="chapter"
                v-validate="'required'"
                @input="handle_chapter"
                :options="chapters"
                :label="'title'"
                :value="chapter"
                :dir="$vs.rtl ? 'rtl' : 'ltr'"
                v-model="block.body.chapter"
              />
            </div>
            <!--  @input="handle_chapter" -->
            <!-- Notion -->
            <div class="vs-holder w-full sm:w-1/2 px-2">
              <div class="label">Notion(s)</div>
              <v-select
                name="notion"
                v-validate="'required'"
                v-model="block.body.notion"
                :label="'title'"
                multiple
                :options="notions"
                :dir="$vs.rtl ? 'rtl' : 'ltr'"
              />
              <!-- @input="handle_tag" -->
            </div>
          </div>
        </div>
      </div>
    </vx-card>
  </div>
</template>

<script>
import moduleDataList from "@/store/data-list/moduleDataList.js";
import { VueMathjax } from "vue-mathjax";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
import vSelect from "vue-select";
import { mapGetters } from "vuex";
import uuid from "uuid/v4";

export default {
  name: "question-item",
  props: {
    block: Object,
  },
  components: {
    "vue-mathjax": VueMathjax,
    quillEditor,
    "v-select": vSelect,
  },
  data() {
    return {
      old_block: {},
      body_builder: 0,
      delSinglePopup: false,
      latex: false,
      pagination: false,
      popAppear: false,
      chapter: {},
      chapters: [],
      notion: "",
      notions: [],
      selected: [],
      qquillContent: "",
      qqquillContent: "",
      rquillContent: "",
      qvuemathdisplay: true,
      qqvuemathdisplay: true,
      rvuemathdisplay: true,
      choicequillContent: "",
      tableList: [
        "vs-th: Component",
        "vs-tr: Component",
        "vs-td: Component",
        "thread: Slot",
        "tbody: Slot",
        "header: Slot",
      ],
      options: {
        modules: {
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
        },
      },
    };
  },
  methods: {
    handle_chapter(newVal) {
      //notions
      let chap = this.notionschap.find((elt) => elt.id == newVal.id);
      if (chap) this.notions = chap.notions;
    },
    handle_tag(newVal) {
      if (newVal.length > 0) {
        if (
          !newVal[newVal.length - 1].id &&
          newVal[newVal.length - 1].title != ""
        ) {
          let not = this.notions.find(
            (elt1) => elt1.title == newVal[newVal.length - 1].title
          );
          if (!not) {
            Object.assign(newVal[newVal.length - 1], { id: uuid() });
            let idx = this.notionschap.findIndex((elt1) => {
              return elt1.id == this.block.body.chapter.id;
            });
            this.notionschap[idx].notions.push(newVal[newVal.length - 1]);
          } else {
            this.$vs.notify({
              title: "Cette notion existe deja",
              time: 4000,
              text: "Veuillez choisir dans la liste ou entrer un nom different",
              color: "warning",
              iconPack: "feather",
              icon: "icon-alert-circle",
            });
            this.block.body.notion.pop();
          }
        }
      }
    },

    setImageSize(content) {
      return content.replaceAll("<img", "<img style='width:50px height:50px' ");
    },
    resetData() {
      this.qqedit = false;
      this.redit = false;
      this.qqedit = false;
      this.block.body.qcmquestiontext = "";
      this.block.body.options = [];
    },
    reRender() {
      if (window.MathJax) {
        //
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub], () =>
          console.log("rendering done")
        );
      }
    },
    notifyMax() {
      this.$vs.notify({
        title: "",
        text: "5 choix pour les QCM au maximum",
        color: "warning",
        iconPack: "feather",
        icon: "icon-alert-circle",
      });
    },
    enableQcm(block) {
      // if (block.body.qedit || block.body.redit || block.body.qqedit) {
      //   return this.$vs.notify({
      //     title: "Erreur",
      //     text: "Un autre bloc est en mode édition",
      //     color: "warning",
      //     iconPack: "feather",
      //     icon: "icon-alert-circle",
      //   });
      // }
      block.body.redit = true;
      if (
        (this.block.body.qcmquestiontext != null &&
          this.block.body.qcmquestiontext != "") ||
        this.block.body.options.length > 0
      ) {
        if (block.body.qcm) {
          this.popAppear = true;
        }
      }
      if (
        (!block.body.qcm || !block.body.has_qcm) &&
        block.body.options.length > 0
      )
        block.body.redit = false;
    },
    edit(block, type, param) {
      this.$emit("editQuestionBlock", [block, type, param]);
      switch (type) {
        case "q":
          this.qquillContent = block.body.text;
          break;
        case "er":
          this.rquillContent = block.body.exactresponse;
          break;
        case "qq":
          this.qqquillContent = block.body.qcmquestiontext;
        case "r":
          break;
      }
      this.latex = !this.latex;
    },
    deleteblock() {
      new Promise((resolve, reject) => {
        this.delSinglePopup = false;
        resolve();
      }).then(() => {
        this.$emit("deleteQuestionBlock");
      });
    },
    _editoption(block, option) {
      // this.$emit("editOption", [options, option, text]);
      if (_.find(block.body.options, (o) => o !== option && o.edit)) {
        return this.$vs.notify({
          title: "Une autre option est mode edition",
          text: "Veuillez sauvegarder avant d'en éditer une autre",
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
      }
      if (option.edit) {
        if (this.choicequillContent === "") {
          this.$vs.notify({
            title: "",
            text: "Veillez renseigner le texte correspondant au choix",
            color: "warning",
            iconPack: "feather",
            icon: "icon-mail",
          });
          return;
        }
        if (
          _.find(
            block.body.options,
            (o) => o !== option && o.value === this.choicequillContent
          )
        ) {
          return this.$vs.notify({
            title: "",
            text: "Une option a déjà cette valeur",
            color: "warning",
            iconPack: "feather",
            icon: "icon-alert-circle",
          });
        }

        option.value = this.choicequillContent;
        this.choicequillContent = "";
        option.edit = false;
        // this.reprocess();
      } else {
        if (_.find(option, (o) => o.edit === true)) {
          this.$vs.notify({
            title: "",
            text: "Une option est déjà en mode édition",
            color: "warning",
            iconPack: "feather",
            icon: "icon-alert-circle",
          });
          return;
        }
        this.choicequillContent = option.value;
        option.edit = true;
      }
      // this.editoptioncheck(this.block, block.body.options);
      // this.$emit("editOption", [options, option, this.choicequillContent]);
      // if(option.edit){
      //   this.choicequillContent = option.value;
      // }else{
      //   this.choicequillContent = "";
      // }
    },
    editoption1(value, option) {
      console.log("value == ", value);
      console.log("option before == ", option);
      this.choicequillContent = value;
      console.log("this.choicequillContent == ", this.choicequillContent);
      console.log("option after == ", option);
    },
    editoption2(value, option) {
      console.log("value 2 == ", value);
      console.log("option before 2 == ", option);
      console.log("this.choicequillContent 2 1 == ", this.choicequillContent);
      if (
        this.choicequillContent != "" &&
        this.choicequillContent != null &&
        this.choicequillContent != undefined
      ) {
        console.log("verify");
        option.value = this.choicequillContent;
        console.log("option.value before 2 == ", option.value);
        this.choicequillContent = "";
      }
      console.log("this.choicequillContent 2 == ", this.choicequillContent);
      console.log("option after 2 == ", option);
    },
    editoptioncheck(block, options) {
      // this.$emit("editOptionCheck", [block, options, this.selected]);
      // console.log("this.selected change ===>> ", this.selected);
      options.forEach((option) => {
        if (this.selected.indexOf(option) != -1) {
          options[options.indexOf(option)].response = true;
        } else {
          options[options.indexOf(option)].response = false;
        }
      });
      if (this.selected.length > 0) {
        block.body.qcmexactresponses = [];
        this.selected.forEach((elt) => {
          block.body.qcmexactresponses.push(elt.value);
        });
      }
      // console.log("this.selected change after ===>> ", this.selected);
    },
    deleteoption(options, indextr) {
      this.$emit("deleteOption", [options, indextr]);
    },
    addoption(block) {
      // this.$emit("addOption", [block, this.choicequillContent]);
      // this.choicequillContent = "";
      if (this.choicequillContent === "") {
        return this.$vs.notify({
          title: "",
          text: "Veillez renseigner le texte correspondant au choix",
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
      }
      if (
        _.find(block.body.options, (o) => o.value === this.choicequillContent)
      ) {
        return this.$vs.notify({
          title: "Erreur",
          text: "Une option a déjà cette valeur",
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
      }
      block.body.options.push({
        value: this.choicequillContent,
        edit: false,
        response: false,
      });
      this.choicequillContent = "";
      if (this.block.body.options.length > 3) {
        this.pagination = true;
      } else {
        this.pagination = false;
      }
    },
    isEditingOption(options) {
      return !!_.find(options, (o) => o.edit);
    },
    // isEditingOption(options) {
    //   this.$emit("addOption", options);
    // },
    choice(block) {
      const self = this;

      // setTimeout(function () {
      //   // const textarea = $(e.target)
      //   //   .closest(".card-header")
      //   //   .next(".row")
      //   //   .find(".text");
      //   if (block.body.list) {
      //     self.reprocess();
      //   }
      //   if (block.body.list && block.body.redit) {
      //     textarea.summernote({ focus: true });
      //   } else {
      //     textarea.summernote("destroy");
      //   }
      // }, 300);
    },
  },
  updated() {},
  computed: {
    ...mapGetters("dataList", ["notionschap"]),

    notions_label() {
      let val = "";
      this.block.body.notion.forEach((elt) => {
        val += " | " + elt.title;
      });
      return val;
    },
    qquillContent_html() {
      if (this.qquillContent != undefined) {
        return this.qquillContent.replaceAll(
          "<img",
          "<img style='width:100%' "
        );
      } else {
        return "";
      }
    },
    rquillContent_html() {
      if (this.rquillContent != undefined) {
        return this.rquillContent.replaceAll(
          "<img",
          "<img style='width:100%' "
        );
      } else {
        return "";
      }
    },
    qqquillContent_html() {
      if (this.block.body.qcmquestiontext != undefined) {
        return this.block.body.qcmquestiontext.replaceAll(
          "<img",
          "<img style='width:100%' "
        );
      } else {
        return "";
      }
    },
    notionsName() {
      let chap = this.notionschap.find((elt) => elt.id == this.chapter.id);
      let notions_tab = [];
      if (chap != undefined) {
        let notions = chap.notions;
        notions.forEach((elt) => {
          notions_tab.push({ label: elt.title, value: elt.title, id: elt.id });
        });
      }
      return notions_tab;
    },
  },
  watch: {
    block: {
      deep: true,
      handler() {
        let self = this.block.body;
        if (self.qcm) {
          self.eredit = false;
          self.qedit = false;
          if (self.qcmquestiontext == "") {
            self.qqedit = true;
          }
        }
        if (!self.qcm) {
          if (self.text == "") {
            self.qedit = true;
          }
          if (self.exactresponse == "") {
            self.eredit = true;
          }
        }
        // if (self.options.length > 0) {
        //   self.redit = false;
        // }
      },
    },
    "block.body": {
      deep: true,
      handler(newVal, oldVal) {
        this.body_builder++;
        if (oldVal != null && oldVal != undefined && this.body_builder > 1) {
          if (
            !this.block.body.cedit &&
            !this.block.body.edit &&
            !this.block.body.qedit &&
            !this.block.body.eredit &&
            !this.block.body.reedit &&
            !this.block.body.redit &&
            !this.block.body.qqedit
          ) {
            if (
              JSON.stringify(newVal) !== JSON.stringify(this.old_block.body)
            ) {
              this.block.body_changed = true;
              this.$emit("addMe", this.block.body.id);
            }
          }
        }
      },
    },
    latex: function () {
      this.$nextTick().then(() => {
        this.reRender();
      });
    },
    chapter(newVal, oldVal) {
      if (oldVal != undefined && oldVal != "" && oldVal != null) {
        let chap = this.notionschap.find((elt) => elt.id == newVal.id);
        if (chap) {
          this.notions = chap.notions;
        } else {
          this.notions = [];
        }
        this.block.body.notion = [];
      }
      console.log("chapter oldVal === ", oldVal);
    },
    notionschap() {
      this.chapters = [];
      this.notionschap.forEach((element) => {
        this.chapters.push(element);
      });
      //
      //
      this.block.body.cedit = true;
      this.block.body.chapter = {};
      this.block.body.notion = [];
      this.notions = [];
      // let sch = this.chapters.find((elt) => {
      //   return elt.id == this.block.body.chapter.id;
      // });
      // if (!(sch != undefined && sch != null && sch != "")) {

      // }
    },
  },
  created() {
    this.notionschap.forEach((element) => {
      this.chapters.push(element);
    });
    if (this.block.body.text != undefined) {
      this.qquillContent = this.block.body.text;
    }
    if (this.block.body.exactresponse != undefined) {
      this.rquillContent = this.block.body.exactresponse;
    }
    if (this.block.body.qcmquestiontext != undefined) {
      this.qqquillContent = this.block.body.qcmquestiontext;
    }

    if (this.block.body.qcm) {
      // console.log("this.selected == ", this.selected);
      this.block.body.options.forEach((elt) => {
        if (elt.response) {
          this.selected.push(elt);
        }
      });
      // console.log("this.selected == ", this.selected);
    }
    let chap = this.notionschap.find(
      (elt) => elt.id == this.block.body.chapter.id
    );
    if (chap) this.notions = chap.notions;
  },
  mounted() {
    this.reRender();
    this.old_block = JSON.parse(JSON.stringify(this.block));
  },
};
</script>
<style scoped lang="scss">
.wrp {
  word-wrap: break-word;
}
.ans {
  .Green {
    background: rgb(236, 236, 236) !important;
  }

  // ul {
  //   list-style-type: circle !important;
  // }
}
// .ans {
//   .vs-list--item {
//     border: none !important;
//   }

//   .vuesax-app-is-ltr .vs-list--slot {
//     margin-left: 0 !important;
//   }
// }
.abv {
  z-index: 1;
  width: 94%;
  height: 25%;
}
.vs-holder {
  margin-top: 17px;
  div {
    padding: 3px 0;
  }
  .label {
    padding-left: 5px;
    font-size: 0.85rem;
    color: rgba(0, 0, 0, 0.7);
  }
}
@media (max-width: 450px) {
  * {
    font-size: 13px;
  }
  h3 {
    font-size: 15px;
  }
}
</style>