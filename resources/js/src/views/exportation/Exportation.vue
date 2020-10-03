<template>
  <div class="flex justify-center w-full">
    <div class="mainholder w-3/5 flex-grow">
      <div>Vueillez preciser les contraintes</div>
      <!-- <div class="flex flex-col sm:flex-row w-full">
        <div class="w-full sm:w-1/4 text-left">classe(s)</div>
        <div class="w-full sm:w-4/5">
          <v-select
            v-model="dataType"
            class="w-full"
            name="item-type"
            v-validate="'required'"
            :options="typesName"
          >
            />
          </v-select>
        </div>
      </div>-->

      <transition name="slide-fade">
        <div v-if="true">
          <div class="flex">
            <vs-card>
              <div>
                <!-- this is the section for country bellow -->
                <div class="vs-holder">
                  <div class="label">Pays</div>
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

                <!-- this is the section for Region bellow -->
                <div v-if="selectedCountry!='' && selectedCountry!=null" class="vs-holder">
                  <div class="label">Region(s)</div>
                  <v-select
                    multiple
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
                <!-- fake input? -->
                <!-- this is a fake input that just serves as a place holder for region -->
                <div v-if="selectedCountry=='' || selectedCountry==null" class="vs-holder">
                  <div class="label">Region(s)</div>
                  <v-select disabled />
                </div>

                <!-- etablissement temp -->
                <div v-if="selectedState!='' && selectedState!=null" class="vs-holder">
                  <div class="label">Etablissement</div>
                  <v-select
                    name="item-etablissement"
                    v-validate="'required'"
                    v-model="dataEtablissement"
                    :options="schoolsName"
                    :dir="$vs.rtl ? 'rtl' : 'ltr'"
                  />
                  <span
                    class="text-danger text-sm"
                    v-show="errors.has('item-etablissement')"
                  >{{ errors.first('item-etablissement') }}</span>
                </div>

                <!-- fake input for establissement -->
                <div v-if="selectedState=='' || selectedState==null" class="vs-holder">
                  <div class="label">Etablissement</div>
                  <v-select disabled v-model="dataEtablissement" />
                </div>

                <!-- Classe -->
                <div class="vs-holder" v-if="dataEtablissement!='' && dataEtablissement!=null">
                  <div class="label">Classe(s)</div>
                  <v-select
                    multiple
                    v-model="dataClasse"
                    class="w-full"
                    name="item-classe"
                    v-validate="'required'"
                    :options="classesName"
                  >/></v-select>
                </div>
                <span
                  class="text-danger text-sm"
                  v-show="errors.has('item-classe')"
                >{{ errors.first('item-classe') }}</span>
                <!-- fake input for classe -->
                <div v-if="dataEtablissement=='' || dataEtablissement==null" class="vs-holder">
                  <div class="label">Classe(s))</div>
                  <v-select disabled v-model="dataClasse" />
                </div>
                <!-- MATIERE -->
                <div class="vs-holder" v-if="dataClasse!='' && dataClasse!=null">
                  <div class="label">Matière(s)</div>
                  <v-select
                    multiple
                    :dir="$vs.rtl ? 'rtl' : 'ltr'"
                    :options="subjectsName"
                    v-model="dataMatiere"
                    class="w-full"
                    name="item-matiere"
                    v-validate="'required'"
                  ></v-select>
                </div>
                <span
                  class="text-danger text-sm"
                  v-show="errors.has('item-matiere')"
                >{{ errors.first('item-matiere') }}</span>

                <!-- fake input for matiere -->
                <div v-if="dataClasse=='' || dataClasse==null" class="vs-holder">
                  <div class="label">Matière(s)</div>
                  <v-select disabled v-model="dataMatiere" />
                </div>

                <!-- Type -->
                <div class="vs-holder" v-if="dataMatiere!='' && dataMatiere!=null">
                  <div class="label">Type(s)</div>
                  <v-select
                    multiple
                    :dir="$vs.rtl ? 'rtl' : 'ltr'"
                    :options="typesName"
                    v-model="dataType"
                    class="w-full"
                    name="item-type"
                    v-validate="'required'"
                  ></v-select>
                </div>
                <span
                  class="text-danger text-sm"
                  v-show="errors.has('item-type')"
                >{{ errors.first('item-type') }}</span>

                <!-- fake input for type -->
                <div v-if="dataMatiere=='' || dataMatiere==null" class="vs-holder">
                  <div class="label">Type(s)</div>
                  <v-select disabled v-model="dataType" />
                </div>

                <!-- SESSION -->
                <div
                  class="vs-holder"
                  v-if="dataType!=null && (dataType.includes('concour') || dataType.includes('exams'))"
                >
                  <div class="label">Session</div>
                  <v-select
                    :dir="$vs.rtl ? 'rtl' : 'ltr'"
                    :options="sessionsList"
                    v-model="dataSession"
                    class="w-full"
                    name="item-session"
                    v-validate="'required'"
                  ></v-select>
                </div>
                <span
                  class="text-danger text-sm"
                  v-show="errors.has('item-session')"
                >{{ errors.first('item-session') }}</span>

                <!-- Sequences -->
                <div class="vs-holder" v-if="dataType!=null && dataType.includes('entrance')">
                  <div class="label">Sequence(s)</div>
                  <v-select
                    multiple
                    :dir="$vs.rtl ? 'rtl' : 'ltr'"
                    :options="sequencesList"
                    v-model="dataSequence"
                    class="w-full"
                    name="item-sequence"
                    v-validate="'required'"
                  ></v-select>
                </div>
                <span
                  class="text-danger text-sm"
                  v-show="errors.has('item-sequence')"
                >{{ errors.first('item-sequence') }}</span>
              </div>
              <div class="flex justify-end mt-2">
                <vs-button @click.prevent="tempSubmit">Suivant</vs-button>
                <vs-button
                  class="justify-right mr-4"
                  type="border"
                  color="danger"
                  @click="initValues()"
                >Annuler</vs-button>
              </div>
            </vs-card>
          </div>
        </div>
      </transition>
      <transition name="slide-fade">
        <div v-if="true" class="w-full">
          <organisation-of-doc></organisation-of-doc>
        </div>
      </transition>
      <div>
        <UploadImage></UploadImage>
      </div>
      <pre>{{types}}</pre>
    </div>
  </div>
</template>


<script>
import moduleDataList from "@/store/data-list/moduleDataList.js";
// import draggable from "vuedraggable";
import uuid from "uuid/v4";
import _ from "lodash";
// import MathJax from "mathjax/es5/latest.js";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import Datepicker from "vuejs-datepicker";
import axios from "axios";
import helpers from "@/store/helpers.js";
import vSelect from "vue-select";
import States from "../epreuve/States.json";
import OrganisationOfDoc from "./OrganisationOfDoc";
import UploadImage from "./uploadImage";
var moment = require("moment");

export default {
  name: "Exportation",
  data() {
    return {
      showOrg: false,
      showfinal: false,
      //v-select data
      // countries: ["Allemagne", "Cameroun", "France", "Nigeria"],
      selectedCountry: null,
      selectedState: null,
      States: States,
      // schools: { Centre: ["lycee", "trojan", "dylaneduc", "achInst"] },
      // Data Sidebar
      addNewDataSidebar: false,
      sidebarData: {},
      dataId: null,
      dataName: null,
      dataType: null,
      dataMatiere: null,
      dataClasse: null,
      dataDescription: null,
      dataEtablissement: "",
      dataSession: null,
      dataSequence: null,
      dataSchoolyear: "2018/2019",
      dataDuration: "02:00",
      dataClasse: null,
      dataCountry: null,
      // dataOrder_status: "pending",
      // dataPrice: 0,
      dataDate: null,
      sessionsList: ["2016", "2017", "2018", "2019", "2020"],
      sequencesList: ["1", "2", "3", "4", "5", "6"],
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

      form: {
        name: "",
        description: "",
        type: "",
        subject: "mat",
        country: "Cameroun",
        region: "Centre",
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
    };
  },
  components: {
    flatPickr,
    Datepicker,
    "v-select": vSelect,
    OrganisationOfDoc,
    UploadImage,
  },
  computed: {
    // this returns an  object of all countries
    countries() {
      return this.$store.state.dataList.pays;
    },
    // this computed returns a list of country names
    countriesName() {
      let pays = [];
      this.countries.forEach((element) => {
        pays.push(element.name);
      });
      return pays;
    },

    // this returns the object of the country selected
    selectedCountrie() {
      let self = this;
      let countrie = this.countries.find(function (element) {
        return element.name == self.selectedCountry;
      });
      return countrie;
    },
    // this returns a list of region names
    regionsName() {
      let regions = [];
      this.selectedCountrie.regions.forEach((element) => {
        regions.push(element.name);
      });
      if (regions.length > 0) {
        regions.push("all");
      }
      return regions;
    },
    // this returns the object of the selected country
    selectedRegion() {
      let self = this;
      let region = [];
      // let region = this.selectedCountrie.regions.find(function (element) {
      //   return element.name == self.selectedState;
      // });
      this.selectedCountrie.regions.forEach(function (element) {
        if (self.selectedState.includes(element.name)) {
          region.push(element);
        }
      });
      return region;
    },
    // this returns a list containing the ids of selected regions
    selectedRegionIds() {
      let ids = [];
      let self = this;
      this.selectedCountrie.regions.forEach(function (element) {
        if (self.selectedState.includes(element.name)) {
          ids.push(element.id);
        }
      });
      return ids;
    },
    // this returns a list of all schools object
    schools() {
      let schools = [];
      this.selectedRegion.forEach((region) => {
        region.etablissements.forEach((element) => {
          schools.push(element);
        });
      });
      return schools;
    },
    schoolsName() {
      let schools = [];
      this.selectedRegion.forEach((region) => {
        region.etablissements.forEach((element) => {
          schools.push(element.name);
        });
      });
      if (schools.length > 0) {
        schools.push("all");
      }
      return schools;
    },
    selectedSchoolIds() {
      let schools = [];
      let self = this;
      this.schools.forEach((etab) => {
        if (self.dataEtablissement.includes(etab.name)) {
          schools.push(etab.id);
        }
      });
      return schools;
    },
    subjects() {
      return this.$store.state.dataList.subjects;
    },
    subjectsName() {
      let subjects = [];
      this.subjects.forEach((element) => {
        subjects.push(element.name);
      });
      if (subjects.length > 0) {
        subjects.push("all");
      }
      return subjects;
    },
    classes() {
      return this.$store.state.dataList.classes;
    },
    classesName() {
      let classes = [];
      this.classes.forEach((element) => {
        classes.push(element.name);
      });
      if (classes.length > 0) {
        classes.push("all");
      }
      return classes;
    },
    selectedclassesId() {
      let ids = [];
      let self = this;
      this.classes.forEach(function (element) {
        if (self.dataClasse.includes(element.name)) {
          ids.push(element.id);
        }
      });
      return ids;
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
    typesName() {
      let types = [];
      this.types.forEach((element) => {
        types.push(element.title);
      });
      if (types.length > 0) {
        types.push("all");
      }
      return types;
    },
    selectedtypesId() {
      let ids = [];
      let self = this;
      this.types.forEach(function (element) {
        if (self.dataType.includes(element.title)) {
          ids.push(element.id);
        }
      });
      return ids;
    },
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
        this.selectedCountry &&
        this.selectedState &&
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
  },
  watch: {
    selectedCountry() {
      this.selectedState = "";
    },
    selectedState(val) {
      if (this.selectedState.length > 1 && this.selectedState.includes("all")) {
        this.selectedState = ["all"];
      }
    },
    dataEtablissement(val) {
      if (
        this.dataEtablissement.length > 1 &&
        this.dataEtablissement.includes("all")
      ) {
        this.dataEtablissement = ["all"];
      }
    },
    dataClasse(val) {
      if (this.dataClasse.length > 1 && this.dataClasse.includes("all")) {
        this.dataClasse = ["all"];
      }
    },
    dataMatiere(val) {
      if (this.dataMatiere.length > 1 && this.dataMatiere.includes("all")) {
        this.dataMatiere = ["all"];
      }
    },
  },
  methods: {
    autofillName() {
      if (this.dataType != null && this.dataMatiere != null) {
        this.dataName = this.dataType + " de " + this.dataMatiere;
      }
    },

    tempSubmit() {
      const data = {
        types:
          this.dataType[0] === "all"
            ? this.dataClasse[0]
            : this.selectedtypesId,
        pays: this.selectedCountry,
        classes:
          this.dataClasse[0] === "all"
            ? this.dataClasse[0]
            : this.selectedclassesId,
        subjects: this.dataMatiere,
        sessions: this.dataSession,
        schools:
          this.dataEtablissement[0] === "all"
            ? this.dataEtablissement[0]
            : this.selectedSchoolIds,
        regions:
          this.selectedState[0] === "all"
            ? this.selectedState[0]
            : this.selectedSchoolIds,
        sequences: this.dataSequence,
      };

      // this.showOrg = true;
    },
    async submitData() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$vs.loading();
          const obj = {
            type: "exams",
            body: {
              id: this.dataId,
              name: this.dataName,
              type: this.dataType,
              content: null,
              intitule: "",
              description: this.dataDescription,
              country: this.selectedCountry,
              region: this.selectedState,
              subject: this.dataMatiere,
              classe: this.dataClasse,
              school: this.dataEtablissement,
              sequence: this.dataSequence,
              duration: this.formatDuration(this.dataDuration),
              session: this.dataSession,
              date_of_composition:
                this.dataDate != null
                  ? (
                      JSON.stringify(this.dataDate).split("T")[0] +
                      " " +
                      JSON.stringify(this.dataDate).split("T")[1].split(".")[0]
                    ).replace('"', "")
                  : this.dataDate,
              schoolyear: this.dataSchoolyear,
            },
            children: [],

            // created_at: moment().valueOf(),
            // updated_at: moment().valueOf(),
          };

          let self = this;
          axios
            .post("/api/create-exams", obj)
            .then(function (response) {
              //
              // Object.assign(obj, { id: response.data.exams.id });
              let res = response;
              self.$store
                .dispatch("dataList/addItem", response.data.exams)
                .then((response) => {
                  //
                  //
                  //   "Form response 2 +++>>> ",
                  //   res.data.exams.body.id
                  // );
                  self.$router.push({
                    name: "examsId",
                    params: { examsId: res.data.exams.body.id },
                  });
                })
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
          setTimeout(() => {
            this.$vs.loading.close();
          }, 1);
        }
      });
    },
    initValues() {
      this.dataId = null;
      this.dataName = null;
      this.dataType = null;
      this.dataDescription = null;
      this.dataMatiere = null;
      this.dataClasse = null;
      this.dataSequence = 1;
      this.dataEtablissement = "";
      this.dataSession = null;
      this.dataDuration = "02:00";
      this.dataSchoolyear = "2018/2019";
      this.dataDate = null;
    },
    formatDuration(d) {
      return helpers.formatDuration(d);
    },
  },
  async created() {
    this.$vs.loading();
    if (!moduleDataList.isRegistered) {
      this.$store.registerModule("dataList", moduleDataList);
      moduleDataList.isRegistered = true;
    }
    if (!this.$store.state.dataList.exams_has_set) {
      await this.$store.dispatch("dataList/fetchExamsListItems");
    }
    if (!this.$store.state.dataList.pays_has_set) {
      await this.$store.dispatch("dataList/fetchPaysList");
    }
    if (!this.$store.state.dataList.types_has_set) {
      await this.$store.dispatch("dataList/fetchTypesList");
    }
    if (!this.$store.state.dataList.subjects_has_set) {
      await this.$store.dispatch("dataList/fetchMatieresList");
    }
    if (!this.$store.state.dataList.classes_has_set) {
      await this.$store.dispatch("dataList/fetchClassesList");
    }
    setTimeout(() => {
      this.$vs.loading.close();
    }, 200);
  },
  mounted() {},
};
</script>

<style lang="scss">
//styling for v-select

@media (max-width: 600px) {
  .mainholder {
    width: 90% !important;
  }
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
//
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
// section bellow is for animations
/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>