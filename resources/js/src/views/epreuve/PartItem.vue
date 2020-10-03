<template >
  <vx-card ref="card" class="mb-base">
    <div class="flex justify-between flex-col-reverse sm:flex-row">
      <div>
        <h4>{{partTitle}}</h4>
      </div>
      <div class="vx-card__action-buttons flex ml-auto">
        <div class="inline-block mr-4">
          <div class="vx-row">
            <label class="mx-2 mt-1">Partie</label>
            <!-- <vs-switch color="success" v-model="block.body.part" @click="part_to_exo(block)" /> -->
          </div>
        </div>
        <!-- Dropdown Button 1 -->
        <div class="dropdown-button-container">
          <vs-dropdown>
            <feather-icon class="btn-drop" icon="PlusIcon" svgClasses="h-6 mx-2 w-4" />
            <vs-dropdown-menu>
              <vs-dropdown-item @click="addblock('text')">Ajouter un texte</vs-dropdown-item>
              <vs-dropdown-item @click="addblock('question')">Ajouter une question</vs-dropdown-item>
              <vs-dropdown-item @click="addblock('exercise')">Ajouter un exercice</vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown>
        </div>

        <feather-icon
          icon="EditIcon"
          v-if="!block.body.edit"
          svgClasses="h-6 mx-2 w-4"
          @click="edit_from_parent(block), isContentCollapsed=false"
        />
        <feather-icon
          icon="SaveIcon"
          v-else
          svgClasses="h-6 mx-2 w-4"
          @click="edit_from_parent(block),addTitle(), isContentCollapsed=true"
        />
        <feather-icon
          @click="toggleC"
          icon="ChevronUpIcon"
          :class="{rotate180: isContentCollapsed}"
          class="mx-2"
        />
        <feather-icon icon="XIcon" svgClasses="h-6 ml-2 w-4" @click="delSinglePopup=true" />

        <!-- pop pop for delete -->

        <vs-popup class="text-center" title="Supprimer La partie" :active.sync="delSinglePopup">
          <p
            class="mb-4 text-center"
          >Etes vous sur de vouloir supprimer cette partie? Tout le contenu sera perdu</p>
          <div class="flex justify-center">
            <vs-button class="mr-2" @click="delSinglePopup=false" color="warning" type="filled">Non</vs-button>
            <vs-button
              class="ml-2"
              @click.stop="deleteblock_from_parent()"
              color="danger"
              type="filled"
            >Oui</vs-button>
          </div>
        </vs-popup>

        <!-- <div class="vx-col" v-if="block.body.qedit" @click="edit(block,'q', qquillContentMathJax)">
                  <feather-icon icon="SaveIcon" svgClasses="h-6 w-4" />
        </div>-->
      </div>
    </div>

    <vs-row v-if="!isContentCollapsed" class="flex flex-col md:flex-row">
      <vs-col>
        <div>
          <!-- Fab -->
          <!-- <fab-button @addItem="addblock($event)"></fab-button> -->
          <!-- Latex -->
          <!-- <input v-model="latex" />
          <br />
          <div :key="latex">{{latex}}</div>-->
          <div class="pt-6 pb-2 vx-col w-full">
            <vs-input
              class="w-full mt-1"
              placeholder="Titre de la partie"
              @keyup.enter="edit(block),addTitle(), isContentCollapsed=true"
              v-model="block.body.text"
              v-if="block.body.edit"
            />
            <!-- <h4
              :class="{'mb-10': block.children.length>0}"
              @dblclick="edit(block)"
              v-else
            >{{block.body.text}}</h4>-->
          </div>
          <draggable
            @end="reprocess2"
            v-model="block.children"
            :options="{draggable: '.card', handle: '.sortable-dot', dragImage: null,ghostClass:'sortable-placeholder'}"
          >
            <template v-for="(block1,idx) in block.children">
              <div
                v-if="block1.type == 'question'"
                :class="'card shadow-1 radius-3 '+(block1.body.sub===true?'ml-20':'')"
                :data-idx="idx"
                :key="idx"
                style="border-top-left-radius: 3px; border-bottom-right-radius: 3px"
              >
                <div class="card-header bg-lighter sortable-dot">
                  <!-- title -->
                  <!-- <title-item
                    v-if="block1.type==='title'"
                    :block="block"
                    @deleteTitleBlock="deleteblock(idx)"
                    @editTitleBlock="edit($event)"
                  ></title-item>-->
                  <!-- questions -->
                  <question-item
                    v-if="block1.type==='question'"
                    :block="block1"
                    @deleteQuestionBlock="deleteblock(idx)"
                    @editQuestionBlock="edit($event[0], $event[1], $event[2])"
                    @editOption="editoption($event[0], $event[1], $event[2])"
                    @editOptionCheck="editoptioncheck($event[0], $event[1], $event[2])"
                    @addOption="addoption($event[0], $event[1])"
                    @deleteOption="deleteoption($event[0], $event[1])"
                    @addMe="addChild($event)"
                  ></question-item>
                </div>
              </div>

              <div
                v-if="block1.type == 'text' || block1.type == 'exercise'"
                class="card shadow-1 radius-3"
                :data-idx="idx"
                :key="idx"
                style="border-top-left-radius: 3px; border-bottom-right-radius: 3px"
              >
                <div class="card-header bg-lighter sortable-dot">
                  <!-- EXERCISE -->
                  <exercise-item
                    v-if="block1.type==='exercise'"
                    :block="block1"
                    @deleteTitleBlock="deleteblock(idx)"
                    @editTitleBlock="edit($event)"
                    @addMe="addChild($event)"
                  ></exercise-item>
                  <!-- TEXT -->
                  <text-item
                    v-if="block1.type==='text'"
                    :block="block1"
                    @deleteTextBlock="deleteblock(idx, true)"
                    @editTextBlock="edit($event, block)"
                  ></text-item>
                </div>
              </div>
            </template>
          </draggable>
        </div>
        <!-- vs-sm="4" vs-xs="12" -->
      </vs-col>
    </vs-row>
  </vx-card>
</template>


<script>
import moduleDataList from "@/store/data-list/moduleDataList.js";
import draggable from "vuedraggable";
import uuid from "uuid/v4";
import _ from "lodash";
// import MathJax from "mathjax/es5/latest.js";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import Datepicker from "vuejs-datepicker";
import { VueMathjax } from "vue-mathjax";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
import FabButton from "./Fab";
import ExerciseItem from "./ExerciseItem";
import TextItem from "./TextItem";
import QuestionItem from "./QuestionItem";
import DataViewSidebar from "../ui-elements/data-list/DataViewSidebar";
import axios from "axios";
import vSelect from "vue-select";
import States from "./States.json";
import helpers from "@/store/helpers.js";
import { mapGetters } from "vuex";
var moment = require("moment");

export default {
  name: "part-item",
  props: {
    block: Object,
  },
  data() {
    return {
      body_builder: 1,
      delSinglePopup: false,
      partTitle: "",
      isContentCollapsed: false,
      // countries: ["Allemagne", "Cameroun", "France", "Nigeria"],
      selectedCountry: "",
      selectedState: "",
      States: States,
      schools: { Centre: ["lycee", "trojan", "dylaneduc", "achInst"] },
      // Data Sidebar
      addNewDataSidebar: false,
      sidebarData: {},
      dataId: null,
      dataName: null,
      dataType: null,
      dataDescription: null,
      dataEtablissement: "",
      dataSession: "",
      dataSequence: 1,
      dataSchoolyear: null,
      dataDuration: null,
      dataClasse: null,
      dataMatiere: null,
      // dataOrder_status: "pending",
      // dataPrice: 0,
      dataDate: null,
      dataBlocks: null,
      currentExams: null,
      configTimePicker: {
        defaultHour: 0,
        defaultMinute: 0,
        enableTime: true,
        enableSeconds: false,
        noCalendar: true,
        time_24hr: true,
      },
      settings: {
        // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
      //
      dataExport: null,
      exportLink: "#",
      choicequillContent: "",
      tquillContent: "...",

      newtest: true,
      fiview: false,
      submitting: false,
      tvuemathdisplay: false,

      formula: "$$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.$$",
      latex:
        "$$\\frac{a}{b}$$ $${\\sqrt{2}^\\sqrt{2}}^\\sqrt{2} = 2 \\\\ \\sqrt{2}^{2\\log_{2}{3}} = 3$$",
      form: {
        id: null,
        name: "",
        description: "",
        type: "",
        country: "",
        region: "",
        subject: "mat",
        class: "3",
        created_at: "",
        updated_at: "",
        school: "",
        sequence: "",
        duration: "",
        session: "",
        date_of_composition: "",
        schoolyear: "2018/2019",
        blocks: [],
      },
      options: {},
      editorOption: {
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
          clipbord: {
            matchVisual: false,
          },
          // syntax: {
          //   highlight: text => hljs.highlightAuto(text).value
          // }
        },
      },
    };
  },
  components: {
    draggable,
    "vue-mathjax": VueMathjax,
    quillEditor,
    flatPickr,
    Datepicker,
    FabButton,
    ExerciseItem,
    TextItem,
    QuestionItem,
    "v-select": vSelect,
    // VueMathjax
  },
  computed: {
    ...mapGetters("dataList", ["chapitres"]),
    ...mapGetters("dataList", ["classes"]),
    ...mapGetters("dataList", ["countries"]),
    ...mapGetters("dataList", ["subjects"]),
    ...mapGetters("dataList", ["sessions"]),
    ...mapGetters("dataList", ["current_exams"]),
    ...mapGetters("dataList", ["schoolyears"]),
    ...mapGetters("dataList", ["types"]),
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    },
    isFormValid() {
      return (
        !this.errors.any() &&
        this.dataName &&
        this.dataType &&
        this.dataDescription &&
        this.dataMatiere &&
        this.dataClasse &&
        (this.dataSequence ||
          this.dataSession ||
          this.dataType === "training" ||
          this.dataType === "flash") &&
        this.dataEtablissement &&
        this.dataDuration &&
        this.dataSchoolyear &&
        this.dataDate
      );
    },

    formatDuration(d) {
      return helpers.formatDuration(d);
    },
  },
  watch: {
    selectedCountry() {
      if (this.selectedState in this.States[this.selectedCountry]) {
        this.selectedState = "";
      }
      // if (this.States[this.selectedCountry] == undefined) {

      // }
    },
    "block.body.text": {
      deep: true,
      handler(newVal, oldVal) {
        this.body_builder++;
        if (oldVal != null && oldVal != undefined && this.body_builder > 1) {
          this.block.body_changed = true;
          this.$emit("addMe", this.block.body.id);
        }
      },
    },
    // fiview: function (newv, oldv) {
    //   this.viewchange();
    // },
    // latex: function () {
    //
    //   this.$nextTick().then(() => {
    //     this.reRender();
    //   });
    // },
    // current_exams: function () {
    //
    // },
  },
  methods: {
    addChild(id) {
      if (this.block.changed_children.length > 0) {
        let search = this.block.changed_children.find((elt) => elt === id);
        if (search === undefined) {
          this.block.changed_children.push(id);
        }
      } else {
        this.block.changed_children.push(id);
      }
    },
    addTitle() {
      if (this.block.body.text.length > 10) {
        this.partTitle = this.block.body.text.slice(0, 10).concat("...");
      } else {
        this.partTitle = this.block.body.text;
      }
      // this.toggleContent();
    },
    toggleC() {
      this.isContentCollapsed = !this.isContentCollapsed;
    },
    edit_from_parent(block) {
      this.$emit("editTitleBlock", block);
    },
    deleteblock_from_parent() {
      new Promise((resolve, reject) => {
        this.delSinglePopup = false;
        resolve();
      }).then(() => {
        this.$emit("deleteTitleBlock");
      });
    },
    reRender() {
      if (window.MathJax) {
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub], () =>
          console.log("rendering done")
        );
      }
    },
    isEditingOption(options) {
      return !!_.find(options, (o) => o.edit);
    },
    // viewchange() {
    //   this.$nextTick(function () {
    //     if (!$.fn.selectpicker) return;
    //     $("select").selectpicker("refresh");
    //   });
    // },
    choice(block, e) {
      const self = this;
    },
    deleteblock(idx, text) {
      const self = this;
      if (!self.delSinglePopup) {
        self.block.children.splice(idx, 1);
        if (text) {
          self.block.body.intitule = "";
        }

        setTimeout(function () {
          self.isContentCollapsed = false;
        }, 100);

        self.isContentCollapsed = true;
      } else {
        this.delSinglePopup = true;
      }

      // this.$emit("editTitleBlock", self.block);
      // this.$emit("updateTitleBlock", [self.block, self.block.children]);
    },
    deleteoption(options, idx) {
      self.block.children[idx].body.id;
      options.splice(idx, 1);
    },
    editoptioncheck(block, options, selected) {
      const self = this;

      options.forEach((option) => {
        if (selected.indexOf(option) != -1) {
          options[options.indexOf(option)].response = true;
        } else {
          options[options.indexOf(option)].response = false;
        }
      });
      if (selected.length > 0) {
        block.body.qcmexactresponses = [];
        selected.forEach((elt) => {
          block.body.qcmexactresponses.push(elt.value);
        });
      }
    },
    editoption(options, option, e) {
      // const textarea = $(e.target)
      //   .closest(".row")
      //   .find(".text");
      if (option.edit) {
        if (this.choicequillContent === "") {
          this.$vs.notify({
            title: "",
            text: "Veillez renseigner le texte correspondant au choix",
            color: "primary",
            iconPack: "feather",
            icon: "icon-mail",
          });
          return;
        }
        if (
          _.find(
            options,
            (o) => o !== option && o.value === this.choicequillContent
          )
        ) {
          this.$vs.notify({
            title: "",
            text: "Une option a déjà cette valeur",
            color: "warning",
            iconPack: "feather",
            icon: "icon-alert-circle",
          });
          return;
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
    },
    addoption(block, choicequillContent) {
      this.choicequillContent = choicequillContent;
      if (this.choicequillContent === "") {
        this.$vs.notify({
          title: "",
          text: "Veillez renseigner le texte correspondant au choix",
          color: "primary",
          iconPack: "feather",
          icon: "icon-mail",
        });
        return;
      }
      if (
        _.find(block.body.options, (o) => o.value === this.choicequillContent)
      ) {
        this.$vs.notify({
          title: "Erreur",
          text: "Une option a déjà cette valeur",
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
        return;
      }
      block.body.options.push({
        value: this.choicequillContent,
        edit: false,
        response: false,
      });
      this.choicequillContent = "";
      // this.reprocess();
    },
    reprocess() {
      setTimeout(function () {
        MathJax.Hub.PreProcess();
        MathJax.Hub.Reprocess();
      }, 200);
    },
    reprocess2() {
      MathJax.Hub.PreProcess();
      MathJax.Hub.Reprocess();
    },
    checkOther(block) {
      return !!_.find(
        this.block.children,
        (b) =>
          b !== block &&
          (b.body.edit ||
            b.body.qedit ||
            b.body.reedit ||
            b.body.redit ||
            b.body.cedit ||
            b.body.qqedit)
      );
    },
    checkOthertext(block) {
      return !!_.find(
        this.block.children,
        (b) => b !== block && b.type == "text"
      );
    },
    edit(block, type, param) {
      let err = "";

      if (block.type === "question") {
        // const $textareas = $($event.target) Dylan
        //   .closest(".card")
        //   .find(".text");
        if (block.body[type + "edit"]) {
          // let textarea;
          switch (type) {
            case "q":
              // textarea = $textareas.first();

              if (param === "")
                err = "Veuillez remplir l'énoncé de la question";
              break;
            case "er":
              // textarea = $($textareas[1]);
              if (param === "") err = "Veuillez remplir la réponse exacte";
              break;
            case "qq":
              //textarea = $($textareas[2]);
              if (param === "")
                err = "Veuillez remplir l'énoncé de la question pour le qcm";
              break;
            case "r":
              if (!block.body.list && !block.body.value)
                err = "Veuillez remplir la réponse au qcm";
              if (block.body.list) {
                if (block.body.options.length < 2)
                  err = "Veuillez ajouter au minimum 2 options pour le qcm";
                else if (!_.find(block.body.options, (o) => o.response))
                  err = "Veuillez selectionner au moins une réponse";
              }
              break;
            case "c":
              if (
                block.body.chapter.title == "" ||
                block.body.chapter.title == null ||
                block.body.notion[0].title == "" ||
                block.body.notion[0].title == null
              )
                err =
                  "Veuiller Remplir les Champs chapitre et notion(s) avant de sauvegarder";
              break;
          }
          if (err) {
            this.$vs.notify({
              title: "",
              text: err,
              color: "warning",
              iconPack: "feather",
              icon: "icon-alert-circle",
            });
            return true;
          }
          block.body[type + "edit"] = false;
          switch (type) {
            case "q":
              block.body.text = param;
              break;
            case "er":
              block.body.exactresponse = param;
              break;
            case "qq":
              block.body.qcmquestiontext = param;
              break;
            case "r":
              break;
          }
          return false;
        } else {
          if (this.checkOther(block)) {
            return this.$vs.notify({
              title: "Erreur",
              text: "Un autre bloc est en mode édition",
              color: "warning",
              iconPack: "feather",
              icon: "icon-alert-circle",
            });
          }
          if (
            block.body.qedit ||
            block.body.eredit ||
            block.body.redit ||
            block.body.cedit ||
            block.body.qqedit
          ) {
            return this.$vs.notify({
              title: "Erreur",
              text: "Une autre section est en cours d'édition",
              color: "warning",
              iconPack: "feather",
              icon: "icon-alert-circle",
            });
            // return;
          }
          if (type == "notion") {
            block.body.notion = param;
            return;
          }
          if (type == "chapter") {
            block.body.chapter = param;
            return;
          }
          block.body[type + "edit"] = true;
          // switch (type) {
          //   case "q":
          //     this.qquillContent = block.body.text;
          //     break;
          //   case "er":
          //     this.rquillContent = block.body.exactresponse;
          //     break;
          //   case "qq":
          //     this.qqquillContent = block.body.qcmquestiontext;
          //   case "r":
          //     break;
          // }
        }
      } else if (block.type === "text") {
        if (block.body.edit) {
          if (block.body.text === "") {
            this.$vs.notify({
              title: "Erreur",
              text: "Veuillez remplir le texte du bloc",
              color: "warning",
              iconPack: "feather",
              icon: "icon-alert-circle",
            });
            return;
          }
          type.body.intitule = block.body.text;
          block.body.edit = false;
        } else {
          if (this.checkOther(block)) {
            this.$vs.notify({
              title: "Erreur",
              text: "Un autre bloc est en mode édition",
              color: "warning",
              iconPack: "feather",
              icon: "icon-alert-circle",
            });
            return false;
          }
          block.body.edit = true;
        }
      } else {
        if (block.body.edit) {
          if (!block.body.text) {
            this.$vs.notify({
              title: "Erreur",
              text: "Veuillez remplir le titre",
              color: "warning",
              iconPack: "feather",
              icon: "icon-alert-circle",
            });
            return;
          }

          block.body.edit = false;
        } else {
          if (this.checkOther(block)) {
            this.$vs.notify({
              title: "Erreur",
              text: "Un autre bloc est en mode édition",
              color: "warning",
              iconPack: "feather",
              icon: "icon-alert-circle",
            });
            return;
          }
          block.body.edit = true;
        }
      }
    },
    formatQuestion(block) {
      return {
        id: block.body.id,
        type: "question",
        sub: block.body.sub,
        question_text: block.body.text,
        points: block.body.points,
        exact_response_text: block.body.exactresponse,
        // has_qcm: block.body.qcm,
        qcm_same_question: block.body.qcmquestion,
        qcm_question_text: block.body.qcmquestion
          ? block.body.qcmquestiontext
          : null,
        qcm_list: block.body.list,
        qcm_response_value: block.body.list ? null : block.body.value,
        qcm_options: block.body.list
          ? block.body.options.map((o) => {
              return { option_text: o.value, is_solution: o.response };
            })
          : null,
      };
    },
    formatPart(block) {
      return {
        id: block.body.id,
        type: "part",
        text: block.body.text,
      };
    },
    formatExercise(block) {
      return {
        id: block.body.id,
        type: "exercise",
        text: block.body.text,
      };
    },
    formatText(block) {
      return { id: block.body.id, type: "text", text: block.body.text };
    },
    addblock(type, pos) {
      const self = this;

      if (self.block.body.text == "") {
        return this.$vs.notify({
          title: "",
          text: "Veuillez remplir le titre du block",
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
      }
      switch (type) {
        case "question":
          self.block.children.push({
            type: "question",
            body: {
              id: uuid(),
              sub: false,
              text: "",
              points: 1,
              chapter: {},
              notion: [],
              exactresponse: "",
              qcmexactresponses: null,
              qcm: false,
              has_qcm: false,
              qcmquestion: false,
              qcmquestiontext: "",
              list: true,
              value: "",
              options: [],
              qedit: true,
              cedit: true,
              eredit: true,
              qqedit: false,
              redit: false,
            },
            children: [],
            body_changed: false,
            changed_children: [],
          });
          break;
        case "exercise":
          self.block.children.push({
            type: "exercise",
            body: {
              id: uuid(),
              text: "",
              intitule: "",
              edit: true,
            },
            children: [],
            body_changed: false,
            changed_children: [],
          });

          break;
        case "text":
          if (self.checkOthertext(self.block)) {
            return this.$vs.notify({
              title: "",
              text: "Cette partie contient deja un block texte",
              color: "warning",
              iconPack: "feather",
              icon: "icon-alert-circle",
            });
          } else {
            self.block.children.push({
              type: "text",
              body: {
                id: uuid(),
                text: "",
                edit: true,
              },
              children: [],
              body_changed: false,
              changed_children: [],
            });
          }
          // this.$nextTick(function () {
          //   let val = self.edit(self.block.children[self.block.children.length - 1], {
          //     target: $(
          //       '.card[data-idx="' + (self.block.children.length - 1) + '"]'
          //     )[0],
          //   });
          //   if (!val) {
          //     self.block.children.pop();
          //   }
          // });
          break;
      }
      self.isContentCollapsed = false;
    },
  },
  mounted() {
    this.reRender();
    this.addTitle();
    //
    // const id = this.$route.params.examsId;
    //
  },
};
</script>

<style lang="scss">
.rotate180 {
  transform: rotate(180deg);
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
.buy-now {
  position: fixed;
  bottom: 5%;
  right: 79px;
  z-index: 51000;
  box-shadow: 0 1px 20px 1px rgb(251, 67, 79);
}
.buy-now1 {
  position: fixed;
  bottom: 5%;
  right: 250px;
  z-index: 51000;
  box-shadow: 0 1px 20px 1px rgb(16, 76, 155);
}
.buy-now2 {
  position: fixed;
  bottom: 5%;
  right: 380px;
  z-index: 51000;
  box-shadow: 0 1px 20px 1px rgb(12, 134, 114);
}
.buy-now3 {
  position: fixed;
  bottom: 5%;
  right: 480px;
  z-index: 51000;
  box-shadow: 0 1px 20px 1px rgb(251, 67, 79);
}
.dropdown-button-container {
  display: flex;
  align-items: center;

  .btnx {
    border-radius: 5px 0px 0px 5px;
  }

  .btn-drop {
    border-radius: 0px 5px 5px 0px;
    border-left: 1px solid rgba(255, 255, 255, 0.2);
  }
}
</style>