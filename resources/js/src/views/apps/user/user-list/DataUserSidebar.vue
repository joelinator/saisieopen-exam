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
    <div class="mt-6 flex items-center justify-between text-center px-6">
      <h4>"AJOUTER UN UTILISATEUR</h4>
      <feather-icon icon="XIcon" @click.prevent="erase()" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-6"></vs-divider>

    <component
      :is="scrollbarTag"
      class="scroll-area--data-list-add-new"
      :settings="settings"
      :key="$vs.rtl"
    >
      <div class="px-3">
        <!-- ACCOUNT NAME -->
        <div class="pb-2">
          <div class="pl-1">Nom du compte</div>
          <vs-input
            class="w-full"
            name="accountName"
            v-validate="'required'"
            v-model="dataAccountName"
          />
          <span
            class="text-danger text-sm ml-6"
            v-show="errors.has('accountName')"
          >{{ errors.first('accountName') }}</span>
        </div>
        <!-- NAME OF USER -->
        <div class="pb-2">
          <div class="pl-1">Nom du l'utilisatuer</div>
          <vs-input class="w-full" name="userName" v-validate="'required'" v-model="dataUserName" />
          <span
            class="text-danger text-sm ml-6"
            v-show="errors.has('userName')"
          >{{ errors.first('userName') }}</span>
        </div>
        <!-- TELEPHONE -->
        <div class="pb-2">
          <div class="pl-1">Telephone</div>
          <vs-input
            class="w-full"
            name="telephone"
            v-validate="'required'"
            v-model="dataTelephone"
          />
          <span
            class="text-danger text-sm ml-6"
            v-show="errors.has('telephone')"
          >{{ errors.first('telephone') }}</span>
        </div>
        <!-- EMAIL -->
        <div class="pb-2">
          <div class="pl-1">Adresse Email</div>
          <vs-input
            class="w-full"
            name="email"
            type="email"
            v-validate="'required'"
            v-model="dataEmail"
          />
          <span
            class="text-danger text-sm ml-6"
            v-show="errors.has('email')"
          >{{ errors.first('email') }}</span>
        </div>
        <!-- DATE OF BIRTH -->
        <div class="pb-2">
          <div class="pl-1">Date de Naissance</div>
          <vs-input
            class="w-full"
            name="DOB"
            type="date"
            v-validate="'required'"
            v-model="dataDOB"
          />
          <span
            class="text-danger text-sm ml-6"
            v-show="errors.has('DOB')"
          >{{ errors.first('DOB') }}</span>
        </div>
        <!-- COUNTRY -->
        <div class="pb-2">
          <div class="pl-1">Pays</div>
          <v-select
            :dir="$vs.rtl ? 'rtl' : 'ltr'"
            v-model="dataCountry"
            class="h-M w-full"
            name="Country"
            :options="paysNameList"
          >/></v-select>
          <!-- <span
            class="text-danger text-sm ml-6"
            v-show="errors.has('Country')"
          >{{ errors.first('Country') }}</span>-->
        </div>
        <!-- SCHOOL -->
        <div class="pb-2">
          <div class="pl-1">Etablissement</div>
          <v-select
            :dir="$vs.rtl ? 'rtl' : 'ltr'"
            v-model="dataSchool"
            class="h-M w-full"
            name="school"
            :options="schoolNameList"
          >/></v-select>
          <!-- <span
            class="text-danger text-sm ml-6"
            v-show="errors.has('school')"
          >{{ errors.first('school') }}</span>-->
        </div>

        <!-- CLASS -->
        <div class="pb-2" v-show="dataSchool!=null && dataSchool!=''">
          <div class="pl-1">Classe</div>
          <v-select
            :dir="$vs.rtl ? 'rtl' : 'ltr'"
            v-model="dataClass"
            class="h-M w-full"
            name="school"
            :options="classNameList"
          ></v-select>
        </div>

        <!-- PASSWORD -->
        <div class="pb-2">
          <div class="pl-1">Mot de passe</div>
          <vs-input
            class="w-full"
            name="password"
            type="password"
            v-validate="'required'"
            v-model="dataPassword"
          />
          <span
            class="text-danger text-sm ml-6"
            v-show="errors.has('password')"
          >{{ errors.first('password') }}</span>
        </div>
        <!-- CONFIRM PASSWORD -->
        <div class="pb-2">
          <div class="pl-1">Confirmer le mot de passe</div>
          <vs-input
            class="w-full"
            name="cPassword"
            type="password"
            v-validate="'required'"
            v-model="dataCPassword"
          />
          <span
            class="text-danger text-sm ml-6"
            v-show="errors.has('cPassword')"
          >{{ errors.first('cPassword') }}</span>
        </div>
        <!-- IS STAFF -->
        <div class="pb-2">
          <vs-checkbox class="inline-flex" v-model="isStaff">
            <span class="pl-2">Is a staff</span>
          </vs-checkbox>
        </div>
        <div class="pb-2 flex flex-wrap justify-end">
          <div>
            <vs-button @click="submit()" class="mr-3 mb-2">Creer</vs-button>
            <vs-button color="warning" type="border" class="mb-2" @click="erase()">Annuler</vs-button>
          </div>
        </div>
      </div>
    </component>
  </vs-sidebar>
</template>

<script>
import vSelect from "vue-select";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

import moduleDataList from "@/store/data-list/moduleDataList.js";
import moduleUserManagement from "@/store/user-management/moduleUserManagement.js";
import axios from "axios";
var moment = require("moment");

export default {
  props: {
    isSidebarActive: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    VuePerfectScrollbar,
    "v-select": vSelect,
  },
  data() {
    return {
      dataAccountName: null,
      dataUserName: null,
      dataTelephone: null,
      dataEmail: null,
      dataDOB: null,
      dataCountry: null,
      dataClass: null,
      dataPassword: null,
      dataCPassword: null,
      dataSchool: null,
      dataDOB: null,
      dataDOB: null,
      isStaff: false,
      settings: {
        // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
      ETids: [],
    };
  },
  computed: {
    enableRegister() {
      return (
        this.dataRouteName != this.data.name ||
        this.dataMethod != this.data.method ||
        this.dataDescription != this.data.description
      );
    },
    classList() {
      return this.$store.state.dataList.classes;
    },
    classNameList() {
      var final = [];

      if (this.classList != undefined && this.classList != []) {
        this.classList.forEach((element) => {
          final.push(element.name);
        });
        return final;
      }
      return [];
    },
    paysList() {
      return this.$store.state.dataList.pays;
    },
    paysNameList() {
      var final = [];

      if (this.paysList != undefined && this.paysList != []) {
        this.paysList.forEach((element) => {
          final.push(element.name);
        });
        return final;
      }
      return [];
    },
    schoolNameList() {
      var final = [];
      var index;
      if (this.dataCountry != null) {
        index = this.paysList.findIndex((element) => {
          return element.name == this.dataCountry;
        });
        var regions = [];
        this.paysList[index].regions.forEach((element) => {
          element.etablissements.forEach((element1) => {
            final.push(element1.name);
            this.ETids.push(element1.id);
          });
        });
        return final;
      }
      return [];
    },

    isSidebarActiveLocal: {
      get() {
        return this.isSidebarActive;
      },
      set(val) {
        if (!val) {
          this.$emit("closeSidebar", false);
          // this.$validator.reset()
          // this.initValues()
        }
      },
    },

    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    },
  },
  methods: {
    submit() {
      let self = this;
      this.$validator.validateAll().then((result) => {
        if (result) {
          if (this.dataPassword != this.dataCPassword) {
            self.$vs.notify({
              title: "Les Mot de passes ne correspondent pas",
              text: "Veuiller re-ecrire votre mot de passe",
              color: "warning",
              iconPack: "feather",
              icon: "icon-alert-circle",
            });
            this.dataPassword = null;
            this.dataCPassword = null;
            return;
          }
          this.$vs.loading();
          const obj = {
            account_name: this.dataAccountName,
            name: this.dataUserName,
            tel: this.dataTelephone,
            email: this.dataEmail,
            date_naissance: this.dataDOB,
            password: this.dataPassword,
            is_staff: this.isStaff,
          };
          if (this.dataCountry != null) {
            var pIndex = this.paysList.findIndex((element) => {
              return element.name == this.dataCountry;
            });
            obj.pays = this.paysList[pIndex].id;
          }
          if (this.dataSchool != null) {
            var sIndex = this.schoolNameList.findIndex((name) => {
              return name == this.dataSchool;
            });
            obj.etablissement = this.ETids[sIndex];
          }
          if (this.dataClass != null) {
            var cIndex = this.classList.findIndex((element) => {
              return element.name == this.dataClass;
            });
            obj.classe = this.classList[cIndex].id;
          }
          self.$store
            .dispatch("userManagement/addUser", obj)
            .then((response) => {
              // axios
              //   .post("/api/permissions/add", obj)
              //   .then(function (response) {
              self.$vs.loading.close();
              self.erase();
              self.$vs.notify({
                title: "Success",
                text: "Cette Utilisateur a ete cree avec success",
                color: "primary",
                iconPack: "feather",
                icon: "icon-mail",
              });
              self.$store.state.dataList.roles_has_set = false;
              self.$emit("update");
            })
            .catch(function (error) {
              self.$vs.loading.close();
              self.$vs.notify({
                title: "Erreur",
                text: error.message,
                color: "warning",
                iconPack: "feather",
                icon: "icon-alert-circle",
              });
            });
        }
      });
    },

    erase() {
      this.dataAccountName = null;
      this.UserName = null;
      this.dataTelephone = null;
      this.dataEmail = null;
      this.dataDOB = null;
      this.dataSchool = null;
      this.dataClass = null;
      this.dataCountry = null;
      this.dataPassword = null;
      this.isStaff = false;
      this.$emit("closeSidebar", false);
    },
  },
  // UPDATED

  async created() {
    this.$vs.loading();
    if (!moduleDataList.isRegistered) {
      this.$store.registerModule("dataList", moduleDataList);
      moduleDataList.isRegistered = true;
    }
    if (!moduleUserManagement.isRegistered) {
      this.$store.registerModule("userManagament", moduleUserManagement);
      moduleUserManagement.isRegistered = true;
    }
    let self = this;
    // if (!this.$store.state.dataList.pays_has_set) {
    await this.$store
      .dispatch("dataList/fetchPaysList")
      .then((response) => {
        self.$vs.loading.close();
      })
      .catch((err) => {
        self.$vs.loading.close();
        self.$vs.notify({
          title: "Erreur",
          text: err.message,
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
      });
    await this.$store
      .dispatch("dataList/fetchClassesList")
      .then((response) => {
        self.$vs.loading.close();
      })
      .catch((err) => {
        self.$vs.loading.close();
        self.$vs.notify({
          title: "Erreur",
          text: err.message,
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
      });
    // }
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
