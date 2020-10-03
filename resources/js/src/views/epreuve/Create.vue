<template>
  <div class="flex justify-center">
    <div class="w-full sm:w-3/5 lg:3/5 xl:2/5 bg-grid-color-secondary">
      <div class="flex content-center">
        <vs-card class>
          <div>
            <!-- TYPE -->
            <div class="vs-holder">
              <div class="label">
                Type
                <span class="required">*</span>
              </div>
              <v-select
                v-model="dataType"
                class="w-full"
                name="item-type"
                v-validate="'required'"
                :options="typesName"
              ></v-select>
            </div>
            <span
              class="text-danger text-sm"
              v-show="errors.has('item-type')"
            >{{ errors.first('item-type') }}</span>
            <!-- MATIERE -->
            <div class="vs-holder">
              <div class="label">
                Matière
                <span class="required">*</span>
              </div>
              <v-select
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
            <!-- NAME -->
            <vs-input
              label="Nom"
              @click="autofillName()"
              v-model="dataName"
              class="mt-5 w-full"
              name="item-name"
              v-validate="'required'"
            />
            <span
              class="text-danger text-sm"
              v-show="errors.has('item-name')"
            >{{ errors.first('item-name') }}</span>
            <!-- this is the section for country bellow -->
            <div class="vs-holder">
              <div class="label">
                Pays
                <span class="required">*</span>
              </div>
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
            <div v-if="selectedCountry!='' && selectedCountry!=null" class="vs-holder">
              <div class="label">
                Region
                <span class="required">*</span>
              </div>
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
              <div class="label">
                Classe
                <span class="required">*</span>
              </div>
              <v-select
                v-model="dataClasse"
                :dir="$vs.rtl ? 'rtl' : 'ltr'"
                :options="classesName"
                class="w-full"
                name="item-classe"
                v-validate="'required'"
              ></v-select>
            </div>
            <span
              class="text-danger text-sm"
              v-show="errors.has('item-classe')"
            >{{ errors.first('item-classe') }}</span>

            <!-- DUREE -->

            <div class="mt-5 w-full">
              <label class="pl-1">
                Durée
                <span class="required">*</span>
              </label>
              <small>hh:mn</small>
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
                <label class="pl-4">
                  Séquence
                  <span class="required">*</span>
                </label>
              </div>
              <div class="centerx">
                <vs-input-number
                  min="1"
                  max="6"
                  v-model="dataSequence"
                  name="item-sequence"
                  v-validate="'required'"
                />
              </div>
            </div>

            <span
              class="text-danger text-sm"
              v-show="errors.has('item-sequence')"
            >{{ errors.first('item-sequence') }}</span>

            <!-- SESSION -->
            <div v-if="dataType === 'exams' || dataType === 'concours'" class="vs-holder">
              <div class="label">
                Session
                <span class="required">*</span>
              </div>
              <v-select
                :dir="$vs.rtl ? 'rtl' : 'ltr'"
                v-model="dataSession"
                :options="sessions"
                class="w-full"
                name="item-session"
                v-validate="'required'"
              ></v-select>
            </div>
            <span
              class="text-danger text-sm"
              v-show="errors.has('item-session')"
            >{{ errors.first('item-session') }}</span>

            <!-- Etablissement -->

            <div v-if="selectedState!='' && selectedState!=null" class="vs-holder">
              <div class="label">
                Etablissement
                <span class="required">*</span>
              </div>
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

            <!-- Année scolaire -->
            <div v-if="dataType == 'entrance'" class="vs-holder">
              <div class="label">
                Année scolaire
                <span class="required">*</span>
              </div>
              <v-select
                :dir="$vs.rtl ? 'rtl' : 'ltr'"
                v-model="dataSchoolyear"
                :options="schoolyears"
                class="w-full"
                name="item-schoolyear"
                v-validate="dataType == 'entrance'? 'required': ''"
              ></v-select>
            </div>
            <span
              class="text-danger text-sm"
              v-show="errors.has('item-schoolyear')"
            >{{ errors.first('item-schoolyear') }}</span>

            <!-- Date -->
            <div class="mt-5 w-full">
              <label class="pl-1">
                Date de passage
                <span class="required">*</span>
              </label>
            </div>
            <datepicker
              class="mb-6 w-full"
              placeholder="Select Date"
              name="item-date"
              v-model="dataDate"
            ></datepicker>
            <span
              class="text-danger text-sm"
              keyboard_arrow_down
              v-show="errors.has('item-date')"
            >{{ errors.first('item-date') }}</span>

            <!-- DESCRIPTION -->
            <vs-input
              label="Description"
              v-model="dataDescription"
              class="mb-6 mt-5 w-full"
              name="item-description"
            />
            <!-- <span
              class="text-danger text-sm"
              v-show="errors.has('item-description')"
            >{{ errors.first('item-description') }}</span>-->
          </div>
          <div class="flex justify-end">
            <vs-button class="mr-4" type="border" color="danger" @click="initValues()">Annuler</vs-button>
            <vs-button
              class="justify-right"
              color="primary"
              type="border"
              :disabled="!isFormValid"
              @click="submitData"
            >Creer</vs-button>
          </div>
        </vs-card>
      </div>
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
// import States from "./States.json";
import { mapGetters } from "vuex";
var moment = require("moment");

export default {
  name: "create",
  data() {
    return {
      //v-select data
      // countries: ["Allemagne", "Cameroun", "France", "Nigeria"],
      selectedCountry: "",
      selectedState: "",
      // States: States,
      // schools: { Centre: ["lycee", "trojan", "dylaneduc", "achInst"] },
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
      dataSchoolyear: "",
      dataDuration: "02:00",
      dataClasse: null,
      dataMatiere: null,
      // dataOrder_status: "pending",
      // dataPrice: 0,
      dataDate: null,
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
      return region;
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
      return types; //dataType
    },

    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    },
    isFormValid() {
      return (
        !this.errors.any() &&
        this.dataName &&
        this.dataType &&
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
        // this.dataSchoolyear &&
        this.dataDate
      );
    },
  },
  watch: {
    selectedCountry() {
      this.selectedState = "";
    },
  },
  methods: {
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
    autofillName() {
      if (this.dataType != null && this.dataMatiere != null) {
        this.dataName = this.dataType + " de " + this.dataMatiere;
      }
    },
    async submitData() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$vs.loading();
          const obj = {
            type: "exams",
            body: {
              name: this.dataName,
              type: this.selectedTypeId(),
              content: null,
              intitule: "",
              description: this.dataDescription,
              country: this.selectedCountry,
              region: this.selectedState,
              subject: this.selectedSubjectId(),
              classe: this.selectedClasseId(),
              school: this.selectedSchoolsId(),
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
              schoolyear: this.selectedSchoolyearId(),
            },
            children: [],
            body_changed: false,
            changed_children: [],

            // created_at: moment().valueOf(),
            // updated_at: moment().valueOf(),
          };
          let self = this;
          this.$store
            .dispatch("dataList/addItem", obj)
            .then((response) => {
              self.$router.push({
                name: "catalogue",
              });
            })
            .catch(function (error) {
              self.$vs.loading.close();
              self.$vs.notify({
                title: "",
                text: error.message,
                color: "danger",
                iconPack: "feather",
                icon: "icon-alert-circle",
              });
            })
            .finally(() => {
              self.$vs.loading.close();
            });

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
      this.dataSchoolyear = "";
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
//styling for star
.required {
  color: red;
}
//styling for v-select
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
</style>
