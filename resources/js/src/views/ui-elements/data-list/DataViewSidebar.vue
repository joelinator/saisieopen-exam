<!-- =========================================================================================
  File Name: AddNewDataSidebar.vue
  Description: Add New Data - Sidebar component
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <vs-sidebar
    click-not-close
    position-right
    parent="body"
    default-index="1"
    color="primary"
    class="add-new-data-sidebar items-no-padding"
    spacer
    v-model="isSidebarActiveLocal"
  >
    <div class="mt-6 flex items-center justify-between px-6">
      <h4>{{ Object.entries(this.data).length === 0 ? "AJOUTER" : "MODIFIER" }} EPREUVE</h4>
      <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>

    <component
      :is="scrollbarTag"
      class="scroll-area--data-list-add-new"
      :settings="settings"
      :key="$vs.rtl"
    >
      <div class="p-6">
        <!-- Product Image -->
        <template v-if="false">
          <!-- Image Container -->
          <div class="img-container w-64 mx-auto flex items-center justify-center">
            <img :src="dataImg" alt="img" class="responsive" />
          </div>

          <!-- Image upload Buttons -->
          <div class="modify-img flex justify-between mt-5">
            <input
              type="file"
              class="hidden"
              ref="updateImgInput"
              @change="updateCurrImg"
              accept="image/*"
            />
            <vs-button class="mr-4" type="flat" @click="$refs.updateImgInput.click()">Update Image</vs-button>
            <vs-button type="flat" color="#999" @click="dataImg = null">Remove Image</vs-button>
          </div>
        </template>

        <!-- NAME -->
        <!-- <vs-input
          label="Name"
          v-model="dataName"
          class="mt-5 w-full"
          name="item-name"
          v-validate="'required'"
        />
        <span
          class="text-danger text-sm"
          v-show="errors.has('item-name')"
        >{{ errors.first('item-name') }}</span>-->

        <!-- MATIERE -->
        <vs-select
          v-model="dataMatiere"
          label="Matière"
          class="mt-5 w-full"
          name="item-matiere"
          v-validate="'required'"
        >
          <vs-select-item
            :key="item.value"
            :value="item.value"
            :text="item.label"
            v-for="item in subjects"
          />
        </vs-select>
        <span
          class="text-danger text-sm"
          v-show="errors.has('item-matiere')"
        >{{ errors.first('item-matiere') }}</span>
        <!-- CLASSE -->
        <vs-select
          v-model="dataClasse"
          label="Classe"
          class="mt-5 w-full"
          name="item-classe"
          v-validate="'required'"
        >
          <vs-select-item
            :key="item.value"
            :value="item.value"
            :text="item.label"
            v-for="item in classes"
          />
        </vs-select>
        <span
          class="text-danger text-sm"
          v-show="errors.has('item-classe')"
        >{{ errors.first('item-classe') }}</span>

        <!-- DUREE -->

        <div class="mt-5 w-full">
          <label>Durée</label>
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

        <div class="mt-5 w-full">
          <label>Séquence</label>
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

        <span
          class="text-danger text-sm"
          v-show="errors.has('item-sequence')"
        >{{ errors.first('item-sequence') }}</span>

        <!-- SESSION -->
        <vs-select
          v-model="dataSession"
          label="Session"
          class="mt-5 w-full"
          name="item-session"
          v-validate="'required'"
        >
          <vs-select-item
            :key="item.value"
            :value="item.value"
            :text="item.label"
            v-for="item in sessions"
          />
        </vs-select>
        <span
          class="text-danger text-sm"
          v-show="errors.has('item-classe')"
        >{{ errors.first('item-classe') }}</span>

        <!-- Etablissement -->
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
        >{{ errors.first('item-etablissement') }}</span>

        <!-- Année scolaire -->
        <vs-select
          v-model="dataSchoolyear"
          label="Année scolaire"
          class="mt-5 w-full"
          name="item-schoolyear"
          v-validate="'required'"
        >
          <vs-select-item
            :key="item.value"
            :value="item.value"
            :text="item.label"
            v-for="item in schoolyears"
          />
        </vs-select>
        <span
          class="text-danger text-sm"
          v-show="errors.has('item-schoolyear')"
        >{{ errors.first('item-schoolyear') }}</span>

        <!-- Date -->
        <div class="mt-5 w-full">
          <label>Date</label>
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

    <div class="flex flex-wrap items-center p-6" slot="footer">
      <vs-button class="mr-6" @click="submitData" :disabled="!isFormValid">Submit</vs-button>
      <vs-button type="border" color="danger" @click="isSidebarActiveLocal = false">Cancel</vs-button>
    </div>
  </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import Datepicker from "vuejs-datepicker";
import axios from "axios";
var moment = require("moment");

export default {
  props: {
    isSidebarActive: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    VuePerfectScrollbar,
    flatPickr,
    Datepicker,
  },
  data() {
    return {
      dataId: null,
      dataName: "",
      dataEtablissement: "",
      dataSession: "",
      dataSequence: 1,
      dataSchoolyear: null,
      dataDuration: null,
      dataClasse: null,
      dataMatiere: null,
      // dataOrder_status: "pending",
      // dataPrice: 0,
      dataSequence: 1,
      dataDate: null,
      configTimePicker: {
        defaultHour: 0,
        defaultMinute: 0,
        enableTime: true,
        enableSeconds: false,
        noCalendar: true,
        time_24hr: true,
      },

      category_choices: [
        { text: "Audio", value: "audio" },
        { text: "Computers", value: "computers" },
        { text: "Fitness", value: "fitness" },
        { text: "Appliance", value: "appliance" },
      ],

      order_status_choices: [
        { text: "Pending", value: "pending" },
        { text: "Canceled", value: "canceled" },
        { text: "Delivered", value: "delivered" },
        { text: "On Hold", value: "on_hold" },
      ],
      settings: {
        // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
    };
  },
  watch: {
    isSidebarActive(val) {
      if (!val) return;
      if (Object.entries(this.data).length === 0) {
        this.initValues();
        this.$validator.reset();
      } else {
        const {
          id,
          subject,
          classe,
          duration,
          sequence,
          session,
          school,
          schoolyear,
          date_of_composition,
        } = JSON.parse(JSON.stringify(this.data));
        this.dataId = id;
        this.dataMatiere = subject;
        this.dataClasse = classe;
        this.dataSequence = sequence;
        this.dataEtablissement = school;
        this.dataSession = session;
        this.dataDuration = duration;
        this.dataSchoolyear = schoolyear;
        this.dataDate = date_of_composition;
        //
        // this.dataId = id;
        // this.dataCategory = category;
        // this.dataImg = img;
        // this.dataName = name;
        // this.dataOrder_status = order_status;
        // this.dataPrice = price;
        this.initValues();
      }
      // Object.entries(this.data).length === 0 ? this.initValues() : { this.dataId, this.dataName, this.dataCategory, this.dataOrder_status, this.dataPrice } = JSON.parse(JSON.stringify(this.data))
    },
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
    isSidebarActiveLocal: {
      get() {
        return this.isSidebarActive;
      },
      set(val) {
        if (!val) {
          this.$emit("closeSidebar");
          // this.$validator.reset()
          // this.initValues()
        }
      },
    },
    isFormValid() {
      return (
        !this.errors.any() &&
        this.dataMatiere &&
        this.dataClasse &&
        this.dataSequence &&
        this.dataEtablissement &&
        this.dataSession &&
        this.dataDuration &&
        this.dataSchoolyear &&
        this.dataDate
      );
    },
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    },
  },
  methods: {
    initValues() {
      if (this.data.id) return;
      this.dataId = null;
      this.dataMatiere = null;
      this.dataClasse = null;
      this.dataSequence = 1;
      this.dataEtablissement = "";
      this.dataSession = null;
      this.dataDuration = 0;
      this.dataSchoolyear = null;
      this.dataDate = null;
      // this.dataName = "";
      // this.dataDescription = "";
    },
    submitData() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          const obj = {
            id: this.dataId,
            subject: this.dataMatiere,
            classe: this.dataClasse,
            school: this.dataEtablissement,
            sequence: this.dataSequence,
            duration: this.dataDuration,
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
            blocks: [],
            created_at: moment().valueOf(),
            updated_at: moment().valueOf(),
            /////
            // id: this.dataId,
            // name: this.dataName,
            // img: this.dataImg,
            // category: this.dataCategory,
            // order_status: this.dataOrder_status,
            // price: this.dataPrice,
          };

          axios
            .post("/api/create-exams", obj)
            .then(function (response) {})

            .catch(function (error) {});

          if (this.dataId !== null && this.dataId >= 0) {
            this.$store.dispatch("dataList/updateExams", obj).catch((err) => {
              console.error(err);
            });
          } else {
            // delete obj.id;
            // obj.popularity = 0;
            this.$store.dispatch("dataList/addItem", obj).catch((err) => {
              console.error(err);
            });
          }

          this.$emit("closeSidebar");
          this.initValues();
        }
      });
    },
    updateCurrImg(input) {
      if (input.target.files && input.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.dataImg = e.target.result;
        };
        reader.readAsDataURL(input.target.files[0]);
      }
    },
  },
  // UPDATED
  updated() {
    //
  },
};
</script>

<style lang="scss" scoped>
.add-new-data-sidebar {
  ::v-deep .vs-sidebar--background {
    z-index: 52010;
  }

  ::v-deep .vs-sidebar {
    z-index: 52010;
    width: 400px;
    max-width: 90vw;

    .img-upload {
      margin-top: 2rem;

      .con-img-upload {
        padding: 0;
      }

      .con-input-upload {
        width: 100%;
        margin: 0;
      }
    }
  }
}

.scroll-area--data-list-add-new {
  // height: calc(var(--vh, 1vh) * 100 - 4.3rem);
  height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 82px);

  &:not(.ps) {
    overflow-y: auto;
  }
}
</style>
