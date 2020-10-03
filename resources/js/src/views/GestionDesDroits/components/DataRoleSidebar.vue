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
      <h4>{{ Cmethod=='add' ?"AJOUTER": ''}}{{ Cmethod=='edit' ? "MODIFIER": '' }} {{ Cmethod=='view' ?"VISUALISER": ''}} UN ROLE</h4>
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
        <div class="vx-row mb-6">
          <div class="vx-col w-full">
            <div class="label mb-1 text-base pl-2">Nom Du Role</div>
            <vs-input
              :disabled="Cmethod=='view'"
              class="w-full"
              name="name"
              v-validate="'required'"
              v-model="roleName"
            />
          </div>
          <span
            class="text-danger text-sm ml-6"
            v-show="errors.has('name')"
          >{{ errors.first('name') }}</span>
        </div>
        <div class="vx-row mb-6 mt-6">
          <div class="vx-col w-full">
            <div class="label mb-1 text-base pl-2">Permissions</div>
            <v-select
              :disabled="Cmethod=='view'"
              multiple
              :closeOnSelect="false"
              v-model="dataPermissions"
              class="h-M w-full"
              name="Premission"
              :options="permissionNameList"
            >/></v-select>
          </div>
          <!-- <span
            class="text-danger text-sm ml-6"
            v-show="errors.has('Premission')"
          >{{ errors.first('Premission') }}</span>-->
        </div>

        <div class="vx-row">
          <div class="vx-col w-full">
            <div class="flex justify-end">
              <vs-button v-if="Cmethod=='add'" @click="submit()" class="mr-3 mb-2">Creer</vs-button>
              <vs-button v-if="Cmethod=='edit'" @click="update()" class="mr-3 mb-2">Enregistrer</vs-button>
              <!-- :disabled="!enableRegister" -->
              <vs-button
                v-if="Cmethod!='view'"
                @click.prevent="erase()"
                color="warning"
                type="border"
                class="mb-2"
              >Annuler</vs-button>
            </div>
          </div>
        </div>
      </div>
    </component>
  </vs-sidebar>
</template>

<script>
import vSelect from "vue-select";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

import moduleUserManagement from "@/store/user-management/moduleUserManagement.js";
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
    Cmethod: {
      type: String,
      default: "add",
    },
  },
  components: {
    VuePerfectScrollbar,
    "v-select": vSelect,
  },
  data() {
    return {
      dataPermissions: [],
      roleName: null,
      permissionList: [],
      chosenPermissionList: [],
      permissionIdList: [],
      newData: null,
      settings: {
        // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
    };
  },
  computed: {
    enableRegister() {
      return (
        this.roleName != this.data.name ||
        this.dataPermissions.length != this.data.permission.length
      );
    },
    permissionNameList() {
      var final = [];
      this.permissionList.forEach((element, index) => {
        final.push(element.name + " (" + element.method + ")");
        // this.permName.push(element.name)
        this.permissionIdList.push(element.id);
      });
      return final;
    },
    permissionIds() {
      var index = [];
      var newData = [];
      this.dataPermissions.forEach((element, ind) => {
        // newData.push(element.replace("(", "").replace(")", "").split(" "));
        index.push(
          this.permissionNameList.findIndex((curval) => {
            return element == curval;
          })
        );
      });

      var final = [];
      index.forEach((element, ind) => {
        final.push(this.permissionIdList[element]);
      });
      return final;
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
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$vs.loading();
          const obj = {
            name: this.roleName,
            permission: this.permissionIds,
          };
          let self = this;
          self.$store
            .dispatch("userManagement/addRole", obj)
            .then((response) => {
              // axios
              //   .post("/api/roles/add", obj)
              //   .then(function (response) {
              self.$vs.loading.close();
              self.erase();
              self.$vs.notify({
                title: "Success",
                text: "Ce Role a ete cree avec success",
                color: "primary",
                iconPack: "feather",
                icon: "icon-mail",
              });
              self.$store.state.userManagement.roles_has_set = false;
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
    update() {
      this.$vs.loading();
      const obj = {
        id: this.data.id,
        name: this.roleName,
        permission: this.permissionIds,
      };
      let self = this;
      self.$store
        .dispatch("userManagement/updateRole", obj)
        .then((response) => {
          // axios
          // .put(`/api/roles/update/${obj.id}`, obj)
          // .then(function (response) {
          self.$vs.loading.close();
          self.erase();
          self.$vs.notify({
            title: "Success",
            text: "Ce Role a ete changee avec success",
            color: "primary",
            iconPack: "feather",
            icon: "icon-mail",
          });
        })
        .catch(function (error) {
          self.$vs.notify({
            title: "Erreur",
            text: error.message,
            color: "danger",
            iconPack: "feather",
            icon: "icon-alert-circle",
          });
          self.$vs.loading.close();
        });
    },
    erase() {
      this.dataPermissions = [];
      this.roleName = null;
      this.$emit("closeSidebar", false);
    },
  },
  // UPDATED
  watch: {
    Cmethod: {
      handler() {
        if (this.Cmethod != "add") {
          var final = [];
          if (this.data.permission != undefined) {
            this.data.permission.forEach((element, index) => {
              final.push(element.name + " (" + element.method + ")");
            });
            this.dataPermissions = final;
            this.roleName = this.data.name;
          }
        } else {
          this.dataPermissions = [];
          this.roleName = null;
        }
        // if (this.Cmethod == "add") {
        //   this.dataPermissions = [];
        //   this.roleName = null;
        // }
      },
    },
  },
  mounted() {
    //
    // if (this.Cmethod == "edit") {
    //   this.dataPermissions = this.data.permission;
    //   this.roleName = this.data.name;
    // }
  },

  async created() {
    this.$vs.loading();
    if (!moduleUserManagement.isRegistered) {
      this.$store.registerModule("userManagement", moduleUserManagement);
      moduleUserManagement.isRegistered = true;
    }
    let self = this;
    await this.$store
      .dispatch("userManagement/fetchPermissions")
      .then((response) => {
        setTimeout(() => {
          this.$vs.loading.close();
        }, 200);
      })
      .catch((err) => {
        setTimeout(() => {
          this.$vs.loading.close();
        }, 200);
        self.$vs.notify({
          title: "Erreur",
          text: err.message,
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
      });
    this.permissionList = this.$store.state.userManagement.permissions;
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
