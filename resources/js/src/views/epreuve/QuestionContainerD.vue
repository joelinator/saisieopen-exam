<template >
  <vx-card ref="card" class="mb-base">
    <template v-slot:actions>
      <div class="vx-card__action-buttons">
        <div class="inline-block mr-4">
          <div class="vx-row">
            <label class="mr-2">{{block.part?"Partie": "Exercice/Problème"}}</label>
            <vs-switch color="success" v-model="block.part" />
          </div>
        </div>
        <!-- Dropdown Button 1 -->
        <div class="dropdown-button-container">
          <vs-dropdown>
            <feather-icon class="btn-drop" icon="PlusIcon" svgClasses="h-6 w-4" />
            <vs-dropdown-menu>
              <vs-dropdown-item @click="addblock('text')">Ajouter un titre</vs-dropdown-item>
              <vs-dropdown-item @click="addblock('question')">Ajouter une question</vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown>
        </div>

        <feather-icon icon="EditIcon" svgClasses="h-6 w-4" @click="edit(block)" />
        <feather-icon icon="SaveIcon" svgClasses="h-6 w-4" @click="edit(block)" />
        <feather-icon icon="XIcon" svgClasses="h-6 w-4" @click="deleteblock()" />
        <feather-icon
          @click="toggleContent"
          icon="ChevronUpIcon"
          :class="{rotate180: !isContentCollapsed}"
          class="ml-4"
        />

        <!-- <div class="vx-col" v-if="block.qedit" @click="edit(block,'q', qquillContentMathJax)">
                <feather-icon icon="SaveIcon" svgClasses="h-6 w-4" />
        </div>-->
      </div>
    </template>

    <vs-row class="flex flex-col md:flex-row">
      <vs-col class="w-ful">
        <div>
          <!-- Fab -->
          <!-- <fab-button @addItem="addblock($event)"></fab-button> -->
          <!-- Latex -->
          <!-- <input v-model="latex" />
          <br />
          <div :key="latex">{{latex}}</div>-->
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

          <draggable
            @end="reprocess2"
            v-model="form.blocks"
            :options="{draggable: '.card', handle: '.sortable-dot', dragImage: null,ghostClass:'sortable-placeholder'}"
          >
            <template v-for="(block,idx) in form.blocks">
              <div
                :class="'card shadow-1 radius-3 '+(block.sub===true?'ml-20':'')"
                :data-idx="idx"
                :key="idx"
                style="border-top-left-radius: 3px; border-bottom-right-radius: 3px"
              >
                <div class="card-header bg-lighter sortable-dot">
                  <!-- title -->
                  <!-- <title-item
                    v-if="block.type==='title'"
                    :block="block"
                    @deleteTitleBlock="deleteblock(idx)"
                    @editTitleBlock="edit($event)"
                  ></title-item>-->
                  <!-- text -->
                  <text-item
                    v-if="block.type==='text'"
                    :block="block"
                    @deleteTextBlock="deleteblock(idx)"
                    @editTextBlock="edit($event)"
                  ></text-item>
                  <!-- questions -->
                  <question-item
                    v-if="block.type==='question'"
                    :block="block"
                    @deleteQuestionBlock="deleteblock(idx)"
                    @editQuestionBlock="edit($event[0], $event[1], $event[2])"
                    @editOption="editoption($event[0], $event[1], $event[2])"
                    @editOptionCheck="editoptioncheck($event[0], $event[1], $event[2])"
                    @addOption="addoption($event[0], $event[1])"
                    @deleteOption="deleteoption($event[0], $event[1])"
                  ></question-item>
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
import TitleItem from "./TitleItem";
import TextItem from "./TextItem";
import QuestionItem from "./QuestionItem";
import DataViewSidebar from "../ui-elements/data-list/DataViewSidebar";
import axios from "axios";
import vSelect from "vue-select";
import States from "./States.json";
import helpers from "@/store/helpers.js";
var moment = require("moment");

export default {
  name: "create",
  props: {
    block: Object,
  },
  data() {
    return {
      countries: ["Allemagne", "Cameroun", "France", "Nigeria"],
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
    TitleItem,
    TextItem,
    QuestionItem,
    "v-select": vSelect,
    // VueMathjax
  },
  computed: {
    subjects() {
      return this.$store.state.dataList.subjects;
    },
    classes() {
      return this.$store.state.dataList.classes;
    },
    sessions() {
      return this.$store.state.dataList.sessions;
    },
    schoolyears() {
      return this.$store.state.dataList.schoolyears;
    },
    types() {
      return this.$store.state.dataList.types;
    },
    current_exams() {
      return this.$store.state.dataList.currentExams;
    },
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    },
    getTest() {
      return (id) => this.$store.getters["dataList/getTest"](id);
    },
    // getCurrentExams() {
    //   return (id) => this.$store.getters["dataList/getTest"](id);
    // },
    choicequillContent_computed() {
      return this.choicequillContent
        .replace(/<p>/g, "")
        .replace(/<\/p>/g, " ")
        .replace(/<strong>/g, "")
        .replace(/<\/strong>/g, " ")
        .replace(/<em>/g, "")
        .replace(/<\/em>/g, " ")
        .replace(/<u>/g, "")
        .replace(/<\/u>/g, " ")
        .replace(/"<br>"/g, " ");
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
    toggleContent() {
      this.$refs.card.toggleContent();
    },
    edit(block) {
      this.$emit("editTitleBlock", block);
    },
    deleteblock() {
      this.$emit("deleteTitleBlock");
    },

    initValues() {
      if (this.form.id) return;
      this.dataId = null;
      this.dataName = null;
      this.dataType = null;
      this.dataDescription = null;
      this.dataMatiere = null;
      this.dataClasse = null;
      this.dataSequence = 1;
      this.dataEtablissement = "";
      this.dataSession = null;
      this.dataDuration = 0;
      this.dataSchoolyear = null;
      this.dataDate = null;
    },
    submitData() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          const obj = {
            id: this.$route.params.examsId,
            name: this.dataName,
            type: this.dataType,
            description: this.dataDescription,
            country: this.selectedCountry,
            region: this.selectedState,
            subject: this.dataMatiere,
            classe: this.dataClasse,
            school: this.dataEtablissement,
            sequence: this.dataSequence,
            duration: this.dataDuration, //this.formatDuration(this.dataDuration),
            session: this.dataSession,
            date_of_composition: this.dataDate,
            // != null
            //   ? (
            //       JSON.stringify(this.dataDate).split("T")[0] +
            //       " " +
            //       JSON.stringify(this.dataDate).split("T")[1].split(".")[0]
            //     ).replace('"', "")
            //   : this.dataDate,
            schoolyear: "" + this.dataSchoolyear,
            blocks: [],
            created_at: moment().valueOf(),
            updated_at: moment().valueOf(),
          };
          let self = this;
          axios
            .post("/api/create-exams", obj)
            .then(function (response) {
              self.$store
                .dispatch("dataList/updateExams", response.data.exams)
                .then((response) => {})
                .catch((err) => {
                  console.error(err);
                });
            })
            .catch(function (error) {});

          // if (this.dataId !== null && this.dataId >= 0) {
          //   this.$store
          //     .dispatch("dataList/updateExams", obj)
          //     .then((response) => {
          //
          //     })
          //     .catch((err) => {
          //       console.error(err);
          //     });
          // } else {
          //   // delete obj.id;
          //   // obj.popularity = 0;
          //   this.$store
          //     .dispatch("dataList/addItem", obj)
          //     .then((response) => {
          //
          //     })
          //     .catch((err) => {
          //       console.error(err);
          //     });
          // }

          // this.$emit("closeSidebar");
          // this.initValues();
        }
      });
    },
    reRender() {
      if (window.MathJax) {
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub], () =>
          console.log("rendering done")
        );
      }
    },
    parse() {
      const self = this;
      let blocks = JSON.parse(JSON.stringify(this.form.blocks));
      let tmp1 = [];
      let tmp;
      blocks.forEach(function (block, idx) {
        if (block.type === "question") {
          if (!block.sub) {
            tmp = self.formatQuestion(block);
            tmp.content = [];
            return tmp1.push(tmp);
          } else {
            if (tmp) {
              tmp.content.push(self.formatQuestion(block));
              return;
            }
          }
        }
        if (block.type === "text" && tmp) {
          if (
            idx > 0 &&
            idx < blocks.length - 1 &&
            blocks[idx + 1].type === "question" &&
            blocks[idx + 1].sub
          ) {
            tmp.content.push(self.formatText(block));
            return;
          }
        }
        tmp = null;
        block.formated = false;
        tmp1.push(block);
      });

      blocks = tmp1;
      tmp1 = [];
      tmp = null;

      blocks.forEach(function (block, idx) {
        if (block.type === "title" && !block.part) {
          tmp = self.formatExercise(block);
          tmp.content = [];
          tmp1.push(tmp);
          return;
        }
        if (block.type === "question" && tmp) {
          return tmp.content.push(block);
        }
        if (block.type === "text" && tmp) {
          return tmp.content.push(self.formatText(block));
        }
        tmp = null;
        tmp1.push(block);
      });

      blocks = tmp1;
      tmp1 = [];
      tmp = null;

      blocks.forEach(function (block, idx) {
        if (block.type === "title" && block.part) {
          tmp = self.formatPart(block);
          tmp.content = [];
          tmp1.push(tmp);
          return;
        }
        if (block.type === "exercise" && tmp) {
          return tmp.content.push(block);
        }
        if (block.type === "text" && tmp) {
          return tmp.content.push(self.formatText(block));
        }

        tmp = null;
        tmp1.push(block);
      });

      tmp1 = {
        school: this.form.school,
        sequence: this.form.sequence,
        // subject: "Physiques",
        // class: "Troisième",
        subject: _.find(this.subjects, (s) => s.value === self.form.subject)
          .label,
        class: _.find(this.classes, (c) => c.value === self.form.classe).label,
        duration: this.form.duration,
        created_at: this.form.created_at,
        session: this.form.session,
        date_of_composition: this.form.date_of_composition,
        content: tmp1,
      };

      if (!_.find(tmp1.content, (b) => b.formated === false)) {
      } else {
        const a = $("#export")[0];
        a.href = "data:," + JSON.stringify(tmp1, null, 2);
        // this.exportLink = "data:," + JSON.stringify(tmp1, null, 2);
        a.click();
      }
    },
    saveAll() {
      self = this;
      let val = !!_.find(
        this.form.blocks,
        (b) => b.edit || b.qedit || b.reedit || b.redit || b.qqedit
      );
      if (val) {
        return this.$vs.notify({
          title: "Un bloc est en mode édition",
          text: "Veuillez enregistrer tous les blocks en mode édition.",
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
      }
      // this.submitData();
      axios
        .post("/api/create-exams2", {
          type: "update",
          json: this.form,
        })
        .then(function (response) {
          self.$vs.notify({
            title: "",
            text: "Enregistrement réussi",
            color: "primary",
            iconPack: "feather",
            icon: "icon-alert-circle",
          });
        })
        .catch(function (error) {});
      // axios
      //   .post("/api", {
      //     type: "update",
      //     json: { blocks: this.form.blocks, id: this.form.id },
      //   })
      //   .then((response) => {
      //     this.toast("Enregistrement éffectué");
      //   })
      //   .finally((e) => {
      //
      //   });
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

      setTimeout(function () {
        // const textarea = $(e.target)
        //   .closest(".card-header")
        //   .next(".row")
        //   .find(".text");
        if (block.list) {
          self.reprocess();
        }
        if (block.list && block.redit) {
          textarea.summernote({ focus: true });
        } else {
          textarea.summernote("destroy");
        }
      }, 300);
    },
    // submitform(e) {
    //   const self = this;
    //   const $e = $(e.target);
    //   const $val = $e.data("bs.validator");
    //   $e.find("select").trigger("change");
    //   $val.validate();
    //   if ($val.hasErrors()) return;
    //   this.form.date_of_composition = $("#date_of_composition").val();
    //   this.form.duration = $e.find("[data-format]").val();
    //   if (!moment(this.form.date_of_composition, "dd/mm/yyyy").isValid())
    //     return this.toast("Veuillez insérer la date de composition");
    //   if (!this.form.sequence && !this.form.session)
    //     return this.toast("veuillez insérer le séquence ou la session");
    //   if (this.form.sequence && this.form.session)
    //     return this.toast(
    //       "Une epreuve ne peut pas avoir une sequence et une session"
    //     );
    //   // this.form.subject = $e.find('select').first().val()
    //   // this.form.class = $e.find('select').last().val()
    //   const obj = {
    //     subject: this.form.subject,
    //     class: this.form.class,
    //     school: this.form.school,
    //     sequence: this.form.sequence,
    //     duration: this.form.duration,
    //     schoolyear: this.form.schoolyear,
    //     date_of_composition: this.form.date_of_composition,
    //     session: this.form.session,
    //     id: this.form.id,
    //   };

    //   self.submitting = true;
    //   if (this.newtest) {
    //     axios
    //       .post("/api", {
    //         type: "new",
    //         json: obj,
    //       })
    //       .then(function (resp) {
    //         self.$store.dispatch("global/fetchData", function (err, data) {
    //           self.$router.push({
    //             name: "test",
    //             params: { id: resp.data.id },
    //           });
    //         });
    //       })
    //       .catch(function (err) {
    //         this.toast("error: " + err.message);
    //       })
    //       .finally(function () {
    //         self.submitting = false;
    //       });
    //   } else {
    //     axios
    //       .post("/api", {
    //         type: "update",
    //         json: obj,
    //       })
    //       .then((response) => {
    //         self.$store.dispatch("global/fetchData", (err, data) => {
    //           self.fiview = true;
    //           this.toast("Mise à jour éffectuée");
    //         });
    //       })
    //       .finally(() => {
    //         self.submitting = false;
    //       });
    //   }
    // },
    deleteblock(idx) {
      const self = this;
      self.form.blocks.splice(idx, 1);
    },
    deleteoption(options, idx) {
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
      block.qcmexactresponses = [];
      selected.forEach((elt) => {
        block.qcmexactresponses.push(elt.value);
      });
    },
    editoption(options, option, e) {
      // const textarea = $(e.target)
      //   .closest(".row")
      //   .find(".text");
      if (option.edit) {
        if (this.choicequillContent_computed === "") {
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
            (o) => o !== option && o.value === this.choicequillContent_computed
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

        option.value = this.choicequillContent_computed;
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
        _.find(
          block.options,
          (o) => o.value === this.choicequillContent_computed
        )
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
      block.options.push({
        value: this.choicequillContent_computed,
        edit: true,
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
        this.form.blocks,
        (b) =>
          b !== block && (b.edit || b.qedit || b.reedit || b.redit || b.qqedit)
      );
    },
    edit(block, type, param) {
      let err = "";

      if (block.type === "question") {
        // const $textareas = $($event.target) Dylan
        //   .closest(".card")
        //   .find(".text");
        if (block[type + "edit"]) {
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
              if (!block.list && !block.value)
                err = "Veuillez remplir la réponse au qcm";
              if (block.list) {
                if (block.options.length < 2)
                  err = "Veuillez ajouter au minimum 2 options pour le qcm";
                else if (!_.find(block.options, (o) => o.response))
                  err = "Veuillez selectionner au moins une réponse";
              }
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
          block[type + "edit"] = false;
          switch (type) {
            case "q":
              block.text = param;
              // textarea.summernote("destroy");
              // this.reprocess();
              break;
            case "er":
              block.exactresponse = param;
              // textarea.summernote("destroy");
              // this.reprocess();
              break;
            case "qq":
              block.qcmquestiontext = param;
              // textarea.summernote("destroy");
              // this.reprocess();
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
          if (block.qedit || block.eredit || block.redit || block.qqedit) {
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
            block.notion = param;
            return;
          }
          if (type == "chapter") {
            block.chapter = param;
            return;
          }
          block[type + "edit"] = true;
          // switch (type) {
          //   case "q":
          //     this.qquillContent = block.text;
          //     break;
          //   case "er":
          //     this.rquillContent = block.exactresponse;
          //     break;
          //   case "qq":
          //     this.qqquillContent = block.qcmquestiontext;
          //   case "r":
          //     break;
          // }
        }
      } else if (block.type === "text") {
        if (block.edit) {
          // let text = type;
          // block.text = text;

          if (block.text === "") {
            this.$vs.notify({
              title: "Erreur",
              text: "Veuillez remplir le texte du bloc",
              color: "warning",
              iconPack: "feather",
              icon: "icon-alert-circle",
            });
            return;
          }
          block.edit = false;
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
          block.edit = true;
        }
      } else {
        if (block.edit) {
          if (!block.text) {
            this.$vs.notify({
              title: "Erreur",
              text: "Veuillez remplir le titre",
              color: "warning",
              iconPack: "feather",
              icon: "icon-alert-circle",
            });
            return;
          }

          block.edit = false;
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
          block.edit = true;
        }
      }
    },
    formatQuestion(block) {
      return {
        id: block.id,
        type: "question",
        sub: block.sub,
        question_text: block.text,
        points: block.points,
        exact_response_text: block.exactresponse,
        has_qcm: block.qcm,
        qcm_same_question: block.qcmquestion,
        qcm_question_text: block.qcmquestion ? block.qcmquestiontext : null,
        qcm_list: block.list,
        qcm_response_value: block.list ? null : block.value,
        qcm_options: block.list
          ? block.options.map((o) => {
              return { option_text: o.value, is_solution: o.response };
            })
          : null,
      };
    },
    formatPart(block) {
      return {
        id: block.id,
        type: "part",
        text: block.text,
      };
    },
    formatExercise(block) {
      return {
        id: block.id,
        type: "exercise",
        text: block.text,
      };
    },
    formatText(block) {
      return { id: block.id, type: "text", text: block.text };
    },
    addblock(type, pos) {
      const self = this;
      switch (type) {
        case "question":
          self.form.blocks.push({
            id: uuid(),
            type: "question",
            sub: false,
            text: "",
            points: 1,
            chapter: null,
            notion: null,
            exactresponse: "",
            qcmexactresponses: [],
            qcm: false,
            qcmquestion: true,
            qcmquestiontext: "",
            list: false,
            value: "",
            options: [],
            qedit: true,
            eredit: false,
            qqedit: false,
            redit: false,
          });
          // self.$nextTick(function () {
          //   const block = self.form.blocks[self.form.blocks.length - 1];
          //   const target = $(
          //     '.card[data-idx="' + (self.form.blocks.length - 1) + '"]'
          //   )[0];
          //   self.edit(block, { target }, "q");
          //   // self.edit(block, {target}, 'er')
          // });
          break;
        case "title":
          self.form.blocks.push({
            id: uuid(),
            type: "title",
            part: true,
            text: "",
            edit: true,
          });
          //
          break;
        case "text":
          self.form.blocks.push({
            id: uuid(),
            type: "text",
            text: "",
            edit: true,
          });
          // this.$nextTick(function () {
          //   let val = self.edit(self.form.blocks[self.form.blocks.length - 1], {
          //     target: $(
          //       '.card[data-idx="' + (self.form.blocks.length - 1) + '"]'
          //     )[0],
          //   });
          //   if (!val) {
          //     self.form.blocks.pop();
          //   }
          // });
          break;
      }
    },
  },
  async created() {
    if (!moduleDataList.isRegistered) {
      this.$store.registerModule("dataList", moduleDataList);
      moduleDataList.isRegistered = true;
    }
    if (!this.$store.state.dataList.exams_has_set) {
      await this.$store.dispatch("dataList/fetchExamsListItems");
    }
    await this.$store.dispatch(
      "dataList/fetchExamsItem",
      this.$route.params.examsId
    );
    const test = this.current_exams;
    if (
      !isNaN(this.$route.params.examsId) &&
      test != undefined &&
      test != null
    ) {
      //
      if (test.blocks != undefined && test.blocks != null)
        test.blocks.forEach(function (block) {
          block.edit = false;
          if (block.type === "question") {
            block.redit = false;
            block.qedit = false;
            block.eredit = false;
          }
        });
      this.form = test;

      if (Object.entries(this.form).length === 0) {
        this.initValues();
        this.$validator.reset();
      } else {
        // const {
        //   id,
        //   name,
        //   description,
        //   type,
        //   country,
        //   region,
        //   subject,
        //   classe,
        //   duration,
        //   sequence,
        //   session,
        //   school,
        //   schoolyear,
        //   date_of_composition,
        //   blocks,
        // } = JSON.parse(JSON.stringify(this.form));
        this.dataId = this.form.id;
        this.dataName = this.form.name;
        this.dataDescription = this.form.description;
        this.dataType = this.form.types.title;
        this.selectedCountry = this.form.etablissement.region.pays.name;
        this.selectedState = this.form.etablissement.region.name;
        this.dataMatiere = this.form.matiere.name;
        this.dataClasse =
          this.form.classe != undefined ? this.form.classe : null;
        this.dataSequence =
          this.form.sequence != undefined ? this.form.sequence : null;
        this.dataEtablissement = this.form.etablissement.name;
        this.dataSession = this.form.session;
        this.dataDuration = this.form.duration;
        this.dataSchoolyear = this.form.anne_scolaire.annee;
        this.dataDate = this.form.date_of_composition;
        if (this.form.blocks != null)
          if (this.form.blocks != undefined) this.dataBlocks = this.form.blocks;
          else {
            Object.assign(this.form, { blocks: [] });
            this.dataBlocks = [];
          }
        else {
          Object.assign(this.form, { blocks: [] });
          this.dataBlocks = [];
        }
        //
        //
        // this.initValues();
      }

      // $("#date_of_composition").val(test.date_of_composition);
      // $(this.$el).find("select").trigger("change");
      // $(this.$el).find("[data-format]").val(test.duration);
      // this.reprocess();
    } else {
      this.$router.push({ name: "Catalog" });
    }
  },
  mounted() {
    this.reRender();

    //
    // const id = this.$route.params.examsId;
    //
  },
};
</script>

<style lang="scss">
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