<template >
  <div id="wholeSec">
    <vs-row class="flex flex-col md:flex-row">
      <vs-col class="w-full md:w-1/4 pr-4">
        <vs-card>
          <component
            :is="scrollbarTag"
            class="scroll-area--data-list-add-new"
            :settings="settings"
            :key="$vs.rtl"
            name="info"
          >
            <div>
              <!-- NAME -->
              <vs-input
                label="Nom"
                v-model="dataName"
                class="mt-5 w-full"
                name="item-name"
                v-validate="'required'"
                @input="bodyChange"
              />
              <span
                class="text-danger text-sm"
                v-show="errors.has('item-name')"
              >{{ errors.first('item-name') }}</span>

              <!-- TYPE -->
              <div class="vs-holder">
                <div class="label">Type</div>
                <v-select
                  v-model="dataType"
                  class="w-full"
                  name="item-type"
                  v-validate="'required'"
                  :options="typesName"
                  @input="bodyChange"
                ></v-select>
              </div>
              <span
                class="text-danger text-sm"
                v-show="errors.has('item-type')"
              >{{ errors.first('item-type') }}</span>

              <!-- MATIERE -->
              <div class="vs-holder">
                <div class="label">Matière</div>
                <v-select
                  :dir="$vs.rtl ? 'rtl' : 'ltr'"
                  :options="subjectsName"
                  v-model="dataMatiere"
                  class="w-full"
                  name="item-matiere"
                  v-validate="'required'"
                  @input="bodyChange"
                ></v-select>
              </div>
              <span
                class="text-danger text-sm"
                v-show="errors.has('item-matiere')"
              >{{ errors.first('item-matiere') }}</span>

              <!-- this is the section for country bellow -->
              <div class="vs-holder">
                <div class="label">pays</div>
                <v-select
                  name="pays"
                  v-validate="'required'"
                  :options="countriesName"
                  :dir="$vs.rtl ? 'rtl' : 'ltr'"
                  v-model="selectedCountry"
                />
                <span
                  class="text-danger text-sm"
                  v-show="errors.has('pays')"
                >{{ errors.first('pays') }}</span>
              </div>
              <!-- this is the section for state bellow -->
              <div class="vs-holder" v-if="selectedCountry!='' && selectedCountry!=null">
                <div class="label">Region</div>
                <v-select
                  name="state"
                  v-validate="'required'"
                  v-model="selectedState"
                  :options="regionsName"
                  :dir="$vs.rtl ? 'rtl' : 'ltr'"
                />
                <span
                  class="text-danger text-sm"
                  v-show="errors.has('state')"
                >{{ errors.first('state') }}</span>
              </div>

              <!-- CLASSE -->
              <div class="vs-holder">
                <div class="label">Classe</div>
                <v-select
                  v-model="dataClasse"
                  :dir="$vs.rtl ? 'rtl' : 'ltr'"
                  :options="classesName"
                  class="w-full"
                  name="item-classe"
                  v-validate="'required'"
                  @input="bodyChange"
                ></v-select>
              </div>
              <span
                class="text-danger text-sm"
                v-show="errors.has('item-classe')"
              >{{ errors.first('item-classe') }}</span>

              <!-- DUREE -->

              <div class="mt-5 w-full">
                <label class="pl-1">Durée</label>
                <small>hh:mm</small>
              </div>
              <flat-pickr
                :config="configTimePicker"
                v-model="dataDuration"
                class="w-full"
                placeholder="Durée"
                name="item-duration"
                v-validate="'required'"
              />

              <span
                class="text-danger text-sm"
                v-show="errors.has('item-duration')"
              >{{ errors.first('item-duration') }}</span>

              <!-- SEQUENCE -->

              <div v-if="dataType === 'entrance'">
                <div class="mt-5 w-full">
                  <label class="pl-4">Séquence</label>
                </div>
                <div class="centerx">
                  <vs-input-number
                    min="1"
                    max="6"
                    v-model="dataSequence"
                    name="item-sequence"
                    v-validate="'required'"
                    @input="bodyChange"
                  />
                </div>
              </div>

              <span
                class="text-danger text-sm"
                v-show="errors.has('item-sequence')"
              >{{ errors.first('item-sequence') }}</span>

              <!-- SESSION -->
              <div v-if="dataType === 'exams' || dataType === 'concours'" class="vs-holder">
                <div class="label">Session</div>
                <v-select
                  :dir="$vs.rtl ? 'rtl' : 'ltr'"
                  v-model="dataSession"
                  :options="sessions"
                  class="w-full"
                  name="item-session"
                  v-validate="'required'"
                  @input="bodyChange"
                ></v-select>
              </div>
              <span
                class="text-danger text-sm"
                v-show="errors.has('item-session')"
              >{{ errors.first('item-session') }}</span>

              <!-- etablissement temp -->
              <div v-if="selectedState!='' && selectedState!=null" class="vs-holder">
                <div class="label">Etablissement</div>
                <v-select
                  name="item-etablissement"
                  :v-validate="(selectedState!='' && selectedState!=null)?'required': ''"
                  v-model="dataEtablissement"
                  :options="schoolsName"
                  :dir="$vs.rtl ? 'rtl' : 'ltr'"
                  @input="bodyChange"
                />
                <span
                  class="text-danger text-sm"
                  v-show="errors.has('item-etablissement')"
                >{{ errors.first('item-etablissement') }}</span>
              </div>

              <!-- Etablissement
              <vs-input
                label="Etablissement"
                class="mt-5 w-full"
                placeholder="Etablissement"
                name="item-etablissement"
                v-model="dataEtablissement"
                v-validate="'required'"
              />
              <span
                class="text-danger text-sm"
                v-show="errors.has('item-etablissement')"
              >{{ errors.first('item-etablissement') }}</span>-->

              <!-- Année scolaire -->
              <div v-if="dataType == 'entrance' " class="vs-holder">
                <div class="label">Année scolaire</div>
                <v-select
                  :dir="$vs.rtl ? 'rtl' : 'ltr'"
                  v-model="dataSchoolyear"
                  :options="schoolyears"
                  class="w-full"
                  name="item-schoolyear"
                  v-validate="dataType == 'entrance'? 'required': ''"
                  @input="bodyChange"
                ></v-select>
              </div>
              <span
                class="text-danger text-sm"
                v-show="errors.has('item-schoolyear')"
              >{{ errors.first('item-schoolyear') }}</span>

              <!-- Date -->
              <div class="mt-5 w-full">
                <label class="pl-1">Date</label>
              </div>
              <datepicker
                class="mb-6 w-full"
                placeholder="Select Date"
                name="item-date"
                v-model="dataDate"
                @input="bodyChange"
              ></datepicker>
              <span
                class="text-danger text-sm"
                v-show="errors.has('item-date')"
              >{{ errors.first('item-date') }}</span>
              <!-- DESCRIPTION keyboard_arrow_down -->
              <vs-input
                label="Description"
                v-model="dataDescription"
                class="mb-6 mt-5 w-full"
                name="item-description"
                v-validate="'required'"
                @input="bodyChange"
              />
              <span
                class="text-danger text-sm"
                v-show="errors.has('item-description')"
              >{{ errors.first('item-description') }}</span>
              <!-- Upload -->
              <!-- <vs-upload text="Upload Image" class="img-upload" ref="fileUpload" /> -->

              <!-- <div class="upload-img mt-5" v-if="!dataImg">
            <input
              type="file"
              class="hidden"
              ref="uploadImgInput"
              @change="updateCurrImg"
              accept="image/*"
            />
            <vs-button @click="$refs.uploadImgInput.click()">Upload Image</vs-button>
              </div>-->
            </div>
          </component>
          <!-- <div class="flex justify-end">
            <vs-button @click="submitData" :disabled="!isFormValid">Submit</vs-button>
          </div>-->
          <!-- <vs-button type="border" color="danger" @click="isSidebarActiveLocal = false">Cancel</vs-button> -->
        </vs-card>
        <!-- vs-sm="4" vs-xs="12" -->
      </vs-col>
      <vs-col class="w-ful md:w-3/4">
        <div v-if="show_content" id="div-with-loading" class="vs-con-loading__container">
          <!-- Fab -->
          <fab-button @addItem="addblock($event)"></fab-button>
          <!-- Latex -->
          <!-- <input v-model="latex" />
          <br />
          <div :key="latex">{{latex}}</div>-->

          <vs-card v-if="block.children.length===0" class="shadow-2" style="border-radius: 10px">
            <p
              class="card-body text-center text-base sm:text-2xl font-semibold"
            >Aucun block disponible</p>
            <!-- <textarea v-model="formula" cols="30" rows="10"></textarea>
        <br />
            <vue-mathjax :formula="formula"></vue-mathjax>-->
          </vs-card>
          <draggable
            @end="reprocess2"
            v-model="block.children"
            :options="{draggable: '.card', handle: '.sortable-dot', dragImage: null,ghostClass:'sortable-placeholder'}"
          >
            <template v-for="(block,idx) in block.children">
              <div
                :class="'card shadow-1 radius-3 '+(block.sub===true?'ml-20':'')"
                :data-idx="idx"
                :key="idx"
                style="border-top-left-radius: 3px; border-bottom-right-radius: 3px"
              >
                <div class="card-header bg-lighter sortable-dot">
                  <!-- title -->
                  <part-item
                    id="part"
                    v-if="block.type==='part'"
                    :block="block"
                    @deleteTitleBlock="deleteblock(idx)"
                    @editTitleBlock="edit($event)"
                    @addMe="addChild($event)"
                  ></part-item>
                  <!-- EXERCISE -->
                  <exercise-item
                    id="exercise"
                    v-if="block.type==='exercise'"
                    :block="block"
                    @deleteTitleBlock="deleteblock(idx)"
                    @editTitleBlock="edit($event)"
                    @addMe="addChild($event)"
                  ></exercise-item>
                  <!-- text -->
                  <text-item
                    id="text"
                    v-if="block.type==='text'"
                    :block="block"
                    @deleteTextBlock="deleteblock(idx, true)"
                    @editTextBlock="edit($event, block)"
                  ></text-item>
                  <!-- questions -->
                  <question-item
                    id="question"
                    v-if="block.type==='question'"
                    :block="block"
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
            </template>
          </draggable>
          <div class="text-center flex justify-end" v-if="block.children.length>0">
            <a
              href="#"
              :download="'Epreuve '+block.body.id+'.json'"
              id="export"
              v-text="dataExport"
            ></a>
            <div class="dropdown-button-container">
          <vs-dropdown>
            <feather-icon class="btn-drop" icon="PlusIcon" svgClasses="h-6 mx-2 w-4" />
            <vs-dropdown-menu>
              <vs-dropdown-item @click="preview(mode='normal')">Previsualiser l'epreuve</vs-dropdown-item>
              <vs-dropdown-item @click="preview(mode='qcm')">Previsualiser l'epreuve en QCM</vs-dropdown-item>
              <vs-dropdown-item @click="preview(mode='correction')">Previsualiser la corection de l'epreuve</vs-dropdown-item>
              <vs-dropdown-item @click="preview(mode='correctionQCM')">Previsualiser la correction de l'epreuve en QCM</vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown>
        </div>
            <vs-button @click="parse" color="primary" type="border" class="mr-4 sm:mr-20">Exporter</vs-button>
            <vx-tooltip
              v-if="!isFormValid"
              color="success"
              text="Veuiller remplir Tous les champs du formulaire"
            >
              <vs-button
                @click="saveAll"
                :disabled="!isFormValid"
                color="success"
                type="border"
              >Enregistrer</vs-button>
            </vx-tooltip>
            <vs-button @click="saveAll" v-else color="success" type="border">Enregistrer</vs-button>
          </div>
        </div>
        <!-- vs-sm="4" vs-xs="12" -->
      </vs-col>
    </vs-row>
    <iframe v-show= "show" ref="preview"></iframe>
  </div>
  
</template>


<script>
import jsPDF from 'jsPDF'
import html2canvas from 'html2canvas'
import jsonToHTML from './u.js';
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
// import TitleItem from "./TitleItem";
import PartItem from "./PartItem";
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
  name: "exams",
  data() {
    return {
      show: false, 
      body_builder: 0,
      show_content: true,
      divLoader: false,
      selectedCountry: "",
      selectedState: "",
      States: States,
      schools: { Centre: ["lycee", "trojan", "dylaneduc", "achInst"] },
      // Data Sidebar
      addNewDataSidebar: false,
      sidebarData: {},
      my_exams: {},
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
      block: {
        type: "exams",
        body: {
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
        },
        children: [],
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
    PartItem,
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
    block1() {
      if (block.children.length > 0) {
        document.getElementById(block.children.body.type).scrollIntoView();
      }
      return;
    },
    dataListState: {
      get() {
        return this.$store.state.dataList;
      },
    },
    countriesName() {
      let pays = [];
      this.countries.forEach((element) => {
        pays.push(element.name);
      });
      return pays;
    },
    selectedCountrie() {
      let self = this;
      let countrie = this.countries.find(function (element) {
        return element.name == self.selectedCountry;
      });
      return countrie;
    },
    regionsName() {
      let regions = [];
      this.selectedCountrie.regions.forEach((element) => {
        regions.push(element.name);
      });
      return regions;
    },
    selectedRegion() {
      let self = this;
      let region = this.selectedCountrie.regions.find(function (element) {
        return element.name == self.selectedState;
      });
      if (region != undefined) {
        return region;
      } else {
        self.selectedState = this.selectedCountrie.regions[0].name;
        return this.selectedCountrie.regions[0];
      }
    },
    schoolsName() {
      let schools = [];
      this.selectedRegion.etablissements.forEach((element) => {
        schools.push(element.name);
      });
      return schools;
    },
    subjectsName() {
      let subjects = [];
      this.subjects.forEach((element) => {
        subjects.push(element.name);
      });
      return subjects;
    },
    classesName() {
      let classes = [];
      this.classes.forEach((element) => {
        classes.push(element.name);
      });
      return classes;
    },
    typesName() {
      let types = [];
      this.types.forEach((element) => {
        types.push(element.title);
      });
      return types;
    },
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    },
    // getTest() {
    //   return (id) => this.$store.getters["dataList/getTest"](id);
    // },

    // getCurrentExams() {
    //   return (id) => this.$store.getters["dataList/getTest"](id);
    // },
    isFormValid() {
      return (
        !this.errors.any() &&
        this.dataName &&
        this.dataType &&
        this.dataDescription &&
        this.dataMatiere &&
        this.dataClasse &&
        this.selectedCountry &&
        this.selectedState &&
        (this.dataSequence ||
          this.dataSession ||
          this.dataSchoolyear ||
          this.dataType === "training" ||
          this.dataType === "flash") &&
        (this.dataSchoolyear || this.dataType !== "entrance") &&
        this.dataEtablissement &&
        this.dataDuration &&
        this.dataDate
      );
    },

    formatDuration(d) {
      return helpers.formatDuration(d);
    },
  },
  watch: {
    selectedState() {
      if (this.schoolsName.includes(this.block.body.etablissement.name)) {
        this.dataEtablissement = this.block.body.etablissement.name;
      } else {
        this.dataEtablissement = "";
      }
    },
    async dataClasse(newVal, oldVal) {
      if (oldVal != null && oldVal != "") {
        if (this.dataClasse != null && this.dataClasse != "") {
          this.$vs.loading({
            container: "#div-with-loading",
            scale: 0.6,
          });
          await this.$store.dispatch(
            "dataList/fetchClasseChapters",
            this.dataClasse
          );
          setTimeout(() => {
            this.$vs.loading.close("#div-with-loading > .con-vs-loading");
          }, 100);
        }
      }
    },
    // "block.body": {
    //   deep: true,
    //   handler(newVal, oldVal) {
    //     this.body_builder++;
    //     if (oldVal != null && oldVal != undefined && this.body_builder > 1) {
    //       console.log("oldVal === ", oldVal);
    //       console.log("block.body has change !!!!!!!!!!!!!!");
    //       this.block.body_changed = true;
    //     }
    //   },
    // },

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
    preview(mode='normal'){
      this.show=true
      let html='' 
      let examObject={}
      html= jsonToHTML(examObject, mode)
      let iframe=this.$refs.preview
      setTimeout(function(){
        iframe.srcdoc=String.raw `${html}`
        var iframedoc=iframe.contentDocument || iframe.contentWindow.document
        html2canvas(iframedoc.body,{scale: 1}).then(canvas =>{
          this.show=false
          let pdf = new jsPDF('p', 'mm', 'a4')
			    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 298)
			    pdf.output('dataurlnewwindow')
        })
     }, 10)

    },
    bodyChange(val) {
      this.block.body_changed = true;
    },
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
    selectedClasseId() {
      let self = this;
      let classe = this.classes.find((element) => {
        return element.name == self.dataClasse;
      });
      return classe.id;
    },
    selectedSchoolsId() {
      let self = this;
      let school = this.selectedRegion.etablissements.find((element) => {
        return element.name == self.dataEtablissement;
      });
      return school.id;
    },
    selectedSchoolyearId() {
      let self = this;
      let schoolyear = this.schoolyears.find((element) => {
        return element.annee == self.dataSchoolyear;
      });
      if (schoolyear != undefined) {
        return schoolyear.id;
      }
      return null;
    },
    selectedSubjectId() {
      let self = this;
      let subject = this.subjects.find((element) => {
        return element.name == self.dataMatiere;
      });
      return subject.id;
    },
    selectedTypeId() {
      let self = this;
      let types = this.types.find(function (element) {
        return element.title == self.dataType;
      });
      return types.id;
    },
    initValues() {
      if (this.block.body.id) return;
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
      let self = this;
      // console.log(this.$validator
      // );
      this.$validator.validateAll().then((result) => {
        if (result) {
          self.$vs.loading();
          //   {
          //   container: "#wholeSec",
          //   scale: 0.6,
          // }

          this.block.body.name = this.dataName;
          this.block.body.type = this.selectedTypeId();
          this.block.body.description = this.dataDescription;
          if (this.block.body.intitule == undefined) {
            Object.assign(this.block.body, { intitule: "" });
          }
          this.block.body.country = this.selectedCountry;
          this.block.body.region = this.selectedState;
          this.block.body.subject = this.selectedSubjectId();
          this.block.body.classe = this.selectedClasseId();
          this.block.body.school = this.selectedSchoolsId();
          this.block.body.sequence = this.dataSequence;
          this.block.body.duration = this.dataDuration; //this.block.bodyatDuration(this.dataDuration);
          this.block.body.session = this.dataSession;
          if (
            JSON.stringify(this.dataDate).match(/t/gi) != null &&
            JSON.stringify(this.dataDate).match(/t/gi).length > 0
          ) {
            this.block.body.date_of_composition =
              this.dataDate != null
                ? (
                    JSON.stringify(this.dataDate).split("T")[0] +
                    " " +
                    JSON.stringify(this.dataDate).split("T")[1].split(".")[0]
                  ).replace('"', "")
                : this.dataDate;
          } else {
            this.block.body.date_of_composition = this.dataDate;
          }

          this.block.body.schoolyear = this.selectedSchoolyearId();
          console.log(
            "this.block.body.children onSubmit ===>> ",
            this.block.children
          );
          this.$store
            .dispatch("dataList/updateExams", this.block)
            .then((response) => {
              self.$vs.notify({
                title: "",
                text: "Enregistrement réuissie",
                color: "primary",
                iconPack: "feather",
                icon: "icon-mail",
              });
              self.$router.push({
                name: "catalogue",
              });
            })
            .catch(function (error) {
              console.log("error == ", error);
              self.$vs.loading.close();
              self.$vs.notify({
                title: "Erreur",
                text: error.message,
                color: "danger",
                iconPack: "feather",
                icon: "icon-alert-circle",
              });
            })
            .finally(() => {
              self.$vs.loading.close();
            });
        } else {
          self.$vs.notify({
            title: "Erreur",
            text: "Veuiller remplir Tous les champs du formulaire",
            color: "danger",
            iconPack: "feather",
            icon: "icon-alert-circle",
          });
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
      // const self = this;
      // let blocks = JSON.parse(JSON.stringify(this.block.children));
      // let tmp1 = [];
      // let tmp;
      // blocks.forEach(function (block, idx) {
      //   if (block.body.type === "question") {
      //     if (!block.sub) {
      //       tmp = self.formatQuestion(block);
      //       tmp.content = [];
      //       return tmp1.push(tmp);
      //     } else {
      //       if (tmp) {
      //         tmp.content.push(self.formatQuestion(block));
      //         return;
      //       }
      //     }
      //   }
      //   if (block.type === "text" && tmp) {
      //     if (
      //       idx > 0 &&
      //       idx < blocks.length - 1 &&
      //       blocks[idx + 1].type === "question" &&
      //       blocks[idx + 1].sub
      //     ) {
      //       tmp.content.push(self.formatText(block));
      //       return;
      //     }
      //   }
      //   tmp = null;
      //   block.formated = false;
      //   tmp1.push(block);
      // });

      // blocks = tmp1;
      // tmp1 = [];
      // tmp = null;

      // blocks.forEach(function (block, idx) {
      //   if (block.type === "title" && !block.part) {
      //     tmp = self.formatExercise(block);
      //     tmp.content = [];
      //     tmp1.push(tmp);
      //     return;
      //   }
      //   if (block.type === "question" && tmp) {
      //     return tmp.content.push(block);
      //   }
      //   if (block.type === "text" && tmp) {
      //     return tmp.content.push(self.formatText(block));
      //   }
      //   tmp = null;
      //   tmp1.push(block);
      // });

      // blocks = tmp1;
      // tmp1 = [];
      // tmp = null;

      // blocks.forEach(function (block, idx) {
      //   if (block.type === "title" && block.part) {
      //     tmp = self.formatPart(block);
      //     tmp.content = [];
      //     tmp1.push(tmp);
      //     return;
      //   }
      //   if (block.type === "exercise" && tmp) {
      //     return tmp.content.push(block);
      //   }
      //   if (block.type === "text" && tmp) {
      //     return tmp.content.push(self.formatText(block));
      //   }

      //   tmp = null;
      //   tmp1.push(block);
      // });
      //
      // tmp1 = {
      //   school: this.block.body.school,
      //   sequence: this.block.body.sequence,
      //   // subject: "Physiques",
      //   // class: "Troisième",
      //   subject: _.find(
      //     this.subjects,
      //     (s) => s.value === self.block.body.subject
      //   ).label,
      //   class: _.find(this.classes, (c) => c.value === self.block.body.classe)
      //     .label,
      //   duration: this.block.body.duration,
      //   created_at: this.block.body.created_at,
      //   session: this.block.body.session,
      //   date_of_composition: this.block.body.date_of_composition,
      //   content: tmp1,
      // };
      //
      //

      //###########
      // if (!!_.find(tmp1.content, (b) => b.formated === false)) {
      //
      // } else {
      //   const a = $("#export")[0];
      //   a.href = "data:," + JSON.stringify(tmp1, null, 2);
      //   // this.exportLink = "data:," + JSON.stringify(tmp1, null, 2);
      //   a.click();
      // }
      this.block.body.name = this.dataName;
      this.block.body.type = this.selectedTypeId();
      this.block.body.description = this.dataDescription;
      if (this.block.body.intitule == undefined) {
        Object.assign(this.block.body, { intitule: "" });
      }
      this.block.body.country = this.selectedCountry;
      this.block.body.region = this.selectedState;
      this.block.body.subject = this.selectedSubjectId();
      this.block.body.classe = this.selectedClasseId();
      this.block.body.school = this.selectedSchoolsId();
      this.block.body.sequence = this.dataSequence;
      this.block.body.duration = this.dataDuration; //this.block.bodyatDuration(this.dataDuration);
      this.block.body.session = this.dataSession;
      if (
        JSON.stringify(this.dataDate).match(/t/gi) != null &&
        JSON.stringify(this.dataDate).match(/t/gi).length > 0
      ) {
        this.block.body.date_of_composition =
          this.dataDate != null
            ? (
                JSON.stringify(this.dataDate).split("T")[0] +
                " " +
                JSON.stringify(this.dataDate).split("T")[1].split(".")[0]
              ).replace('"', "")
            : this.dataDate;
      } else {
        this.block.body.date_of_composition = this.dataDate;
      }

      this.block.body.schoolyear = this.selectedSchoolyearId();
      const a = $("#export")[0];
      a.href = "data:," + JSON.stringify(this.block, null, 2);
      // this.exportLink = "data:," + JSON.stringify(tmp1, null, 2);
      a.click();
    },
    saveAll() {
      self = this;
      self.checkOther(self.block);

      if (self.val) {
        return this.$vs.notify({
          title: "Un bloc est en mode édition",
          text: "Veuillez enregistrer tous les blocks en mode édition.",
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
      }

      this.submitData();
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

      // setTimeout(function () {
      //   // const textarea = $(e.target)
      //   //   .closest(".card-header")
      //   //   .next(".row")
      //   //   .find(".text");
      //   if (block.list) {
      //     self.reprocess();
      //   }
      //   if (block.list && block.redit) {
      //     textarea.summernote({ focus: true });
      //   } else {
      //     textarea.summernote("destroy");
      //   }
      // }, 300);
    },
    deleteblock(idx, text) {
      const self = this;
      self.block.children.splice(idx, 1);
      this.$vs.loading({
        container: "#div-with-loading",
        scale: 0.6,
      });
      this.show_content = false;
      setTimeout(() => {
        this.show_content = true;
        this.$vs.loading.close("#div-with-loading > .con-vs-loading");
      }, 100);
      if (text) {
        self.block.body.intitule = "";
      }
    },
    deleteoption(options, idx) {
      options.splice(idx, 1);
    },
    editoptioncheck(block, options, selected) {
      const self = this;
      console.log("block.body.options before ===>> ", block.body.options);
      block.body.options.forEach((option) => {
        if (selected.indexOf(option) != -1) {
          console.log("test ");
          console.log(
            "block.body.options[block.body.options.indexOf(option)]",
            block.body.options[block.body.options.indexOf(option)]
          );
          block.body.options[
            block.body.options.indexOf(option)
          ].response = true;
        } else {
          block.body.options[
            block.body.options.indexOf(option)
          ].response = false;
        }
      });
      if (selected.length > 0) {
        block.body.qcmexactresponses = [];
        selected.forEach((elt) => {
          block.body.qcmexactresponses.push(elt.value);
        });
      }
      console.log("block.body.options after ===>> ", block.body.options);
      console.log("this.block.body.children after ===>> ", this.block.children);
      return selected;
    },
    editoption(options, option, e) {
      // const textarea = $(e.target)
      //   .closest(".row")
      //   .find(".text");
      this.choicequillContent = e;
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
      let child = block.children;

      this.val = !!_.find(
        child,
        (b) =>
          b !== block &&
          (b.body.edit ||
            b.body.qedit ||
            b.body.reedit ||
            b.body.redit ||
            b.body.qqedit ||
            b.body.cedit ||
            b.body.eredit)
      );

      if (this.val) {
        return this.val;
      }
      if (child.length > 0 && !this.val) {
        var c;
        child.forEach((c) => {
          //
          // if (this.val) {
          //
          //   return this.val;
          // }
          this.checkOther(c);
          // if (c.length > 0) {
          //   this.checkOther(c);
          //
          // } else {
          //   return false;
          // }
        });
      } else {
        return true;
      }
      // return this.val;
    },
    checkOthertext(block) {
      return !!_.find(
        this.block.children,
        (b) => b !== block && b.type == "text"
      );
    },
    // updateTitleBlock(block, children, idx) {
    //
    //   Object.assign((this.block.children[idx].children = children));
    // },
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
              if (param === "")
                err = "Veuillez remplir l'énoncé de la question";
              break;
            case "er":
              if (param === "") err = "Veuillez remplir la réponse exacte";
              break;
            case "qq":
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
              console.log("edit block.body.chapter == ", block.body.chapter);
              console.log(
                "edit block.body.notion[0] == ",
                block.body.notion[0]
              );
              if (
                block.body.chapter == undefined ||
                block.body.notion[0] == undefined ||
                block.body.chapter.title == "" ||
                block.body.chapter.title == null ||
                block.body.notion[0].title == "" ||
                block.body.notion[0].title == null
              )
                err =
                  "Veuiller Remplir les Champs chapitre et notion avant de sauvegarder";
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
              // textarea.summernote("destroy");
              // this.reprocess();
              break;
            case "er":
              block.body.exactresponse = param;
              // textarea.summernote("destroy");
              // this.reprocess();
              break;
            case "qq":
              block.body.qcmquestiontext = param;
              // textarea.summernote("destroy");
              // this.reprocess();
              break;
            case "r":
              break;
          }
          return false;
        } else {
          if (this.checkOther(this.block)) {
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

          this.block.body.intitule = type.body.text;
          block.body.edit = false;
        } else {
          if (this.checkOther(this.block)) {
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
          if (this.checkOther(this.block)) {
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
        id: block.id,
        type: "question",
        sub: block.sub,
        question_text: block.text,
        points: block.points,
        exact_response_text: block.exactresponse,
        // has_qcm: block.qcm,
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

      // self.$refs.type.scrollIntoView();
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
        case "part":
          self.block.children.push({
            type: "part",
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
          //
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
          //
          break;
        case "text":
          if (self.checkOthertext(self.block)) {
            return this.$vs.notify({
              title: "",
              text: "Cette epreuve contient deja un block texte",
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
    },
  },
  updated() {
    //
  },
  async created() {
    // this.body_builder = 0;
    this.$vs.loading();
    if (!moduleDataList.isRegistered) {
      this.$store.registerModule("dataList", moduleDataList);
      moduleDataList.isRegistered = true;
    }
    if (!this.dataListState.exams_has_set) {
      await this.$store.dispatch("dataList/fetchExamsListItems");
    }
    //
    await this.$store.dispatch(
      "dataList/fetchExamsItem",
      this.$route.params.examsId
    );

    if (!this.dataListState.pays_has_set) {
      await this.$store.dispatch("dataList/fetchPaysList");
    }
    await this.$store.dispatch(
      "dataList/fetchClasseChapters",
      this.current_exams.body.classe
    );
    if (!this.dataListState.types_has_set) {
      await this.$store.dispatch("dataList/fetchTypesList");
    }
    if (!this.dataListState.subjects_has_set) {
      await this.$store.dispatch("dataList/fetchMatieresList");
    }
    if (!this.dataListState.classes_has_set) {
      await this.$store.dispatch("dataList/fetchClassesList");
    }
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
      this.block = test;

      if (Object.entries(this.block.body).length === 0) {
        //
        this.initValues();
        this.$validator.reset();
      } else {
        //
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
        // } = JSON.parse(JSON.stringify(this.block.body));
        this.dataId = this.block.body.id;
        this.dataName = this.block.body.name;
        this.dataDescription = this.block.body.description;
        this.dataType = this.block.body.types.title;
        this.selectedCountry = this.block.body.etablissement.region.pays.name;
        this.selectedState = this.block.body.etablissement.region.name;
        this.dataMatiere = this.block.body.matiere.name;
        this.dataClasse =
          this.block.body.classe != undefined ? this.block.body.classe : null;
        this.dataSequence =
          this.block.body.sequence != undefined
            ? this.block.body.sequence
            : null;
        this.dataEtablissement = this.block.body.etablissement.name;
        this.dataSession = this.block.body.session;
        this.dataDuration = this.block.body.duration;
        this.dataSchoolyear =
          this.block.body.anne_scolaire != null &&
          this.block.body.anne_scolaire != undefined
            ? this.block.body.anne_scolaire.annee
            : "";
        this.dataDate = this.block.body.date_of_composition;
        if (this.block.children != null)
          if (this.block.children != undefined)
            this.dataBlocks = this.block.children;
          else {
            Object.assign(this.block.body, { blocks: [] });
            this.dataBlocks = [];
          }
        else {
          Object.assign(this.block.body, { blocks: [] });
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
    setTimeout(() => {
      this.$vs.loading.close();
    }, 200);

    console.log("this.block.body === ", this.block.body);
    // this.body_builder = true;
  },
  mounted() {
    this.reRender();

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