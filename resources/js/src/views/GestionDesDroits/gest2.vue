<!-- =========================================================================================
  File Name: DataListListView.vue
  Description: Data List - List View
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div>
    <div id="data-list-list-view" class="data-list-container">
      <data-role-sidebar
        :isSidebarActive="addNewDataSidebar"
        @closeSidebar="toggleDataSidebar"
        @update="refresh()"
        :data="sidebarData"
        :Cmethod="Pmethod"
      />

      <vs-table
        ref="table"
        multiple
        v-model="selected"
        pagination
        :max-items="itemsPerPage"
        search
        :data="roleList"
      >
        <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
          <div class="flex flex-wrap-reverse items-center data-list-btn-container">
            <!-- ACTION - DROPDOWN -->
            <vs-dropdown vs-trigger-click class="dd-actions cursor-pointer mr-4 mb-4">
              <div
                class="p-4 shadow-drop rounded-lg d-theme-dark-bg cursor-pointer flex items-center justify-center text-lg font-medium w-32 w-full"
              >
                <span class="mr-2">Actions</span>
                <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
              </div>

              <vs-dropdown-menu>
                <vs-dropdown-item @click.stop="viewData(selected[0])" v-show="selected.length<=1">
                  <span class="flex items-center">
                    <feather-icon icon="EyeIcon" svgClasses="h-4 w-4" class="mr-2" />
                    <span>Voir</span>
                  </span>
                </vs-dropdown-item>
                <vs-dropdown-item
                  @click.stop="selected.length>0 ? editData(selected[0]): ()=>{}"
                  v-show="selected.length<=1"
                >
                  <span class="flex items-center">
                    <feather-icon icon="EditIcon" svgClasses="h-4 w-4" class="mr-2" />
                    <span>Editer</span>
                  </span>
                </vs-dropdown-item>
                <!-- <vs-dropdown-item
                  @click="selected.length>0? delMiltiPopup=true : delMiltiPopup=false"
                >
                  <span class="flex items-center">
                    <feather-icon icon="TrashIcon" svgClasses="h-4 w-4" class="mr-2" />
                    <vs-popup
                      class="text-center"
                      title="Supprimer Epreuves"
                      :active.sync="delMiltiPopup"
                    >
                      <p
                        class="mb-4 text-center"
                      >Etes vous sur de vouloir supprimer {{ selected.length>1? 'ces':'cette'}} epreuve{{ selected.length>1? 's':''}}?</p>
                      <div class="flex justify-center">
                        <vs-button
                          class="mr-2"
                          @click="deleteData(tr.id), delMiltiPopup=false"
                          color="danger"
                          type="filled"
                        >Oui</vs-button>
                        <vs-button
                          class="ml-2"
                          @click="delMiltiPopup=false"
                          color="warning"
                          type="filled"
                        >Non</vs-button>
                      </div>
                    </vs-popup>
                    <span>Delete</span>
                  </span>
                </vs-dropdown-item>-->

                <vs-dropdown-item>
                  <span class="flex items-center">
                    <feather-icon icon="SaveIcon" svgClasses="h-4 w-4" class="mr-2" />
                    <span>Autre Action</span>
                  </span>
                </vs-dropdown-item>
              </vs-dropdown-menu>
            </vs-dropdown>

            <!-- ADD NEW -->
            <div
              class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
              @click="addNewData"
            >
              <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
              <span class="ml-2 text-base text-primary">Nouveau</span>
            </div>
          </div>

          <!-- ITEMS PER PAGE -->
          <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
            <div
              class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium"
            >
              <span
                class="mr-2"
              >{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ roleList.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : roleList.length }} of {{ queriedItems }}</span>
              <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
            </div>
            <!-- <vs-button class="btn-drop" type="line" color="primary" icon-pack="feather" icon="icon-chevron-down"></vs-button> -->
            <vs-dropdown-menu>
              <vs-dropdown-item @click="itemsPerPage=4">
                <span>4</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="itemsPerPage=10">
                <span>10</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="itemsPerPage=15">
                <span>15</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="itemsPerPage=20">
                <span>20</span>
              </vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown>
        </div>

        <template slot="thead">
          <vs-th sort-key="name">Name</vs-th>
          <vs-th sort-key="popularity">Permissions</vs-th>
          <vs-th sort-key="price">Created At</vs-th>
          <vs-th>Action</vs-th>
        </template>

        <template slot-scope="{data}">
          <tbody>
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                <p class="product-name font-medium truncate">{{ tr.name }}</p>
              </vs-td>

              <vs-td v-if="tr.permission.length>0">
                <div class="flex" @click="tr.show=!tr.show">
                  <p class="product-category fold">
                    - {{ tr.permission[0].name | title }}
                    <i
                      class="text-xs"
                    >({{tr.permission[0].method}})</i>
                  </p>
                  <feather-icon
                    v-show="!tr.show && tr.permission.length>1"
                    class="pl-4"
                    icon="ChevronDownIcon"
                    svgClasses="h-5 w-5"
                  />
                  <feather-icon
                    v-if="tr.show && tr.permission.length>1"
                    class="pl-4"
                    icon="ChevronUpIcon"
                    svgClasses="h-5 w-5"
                  />
                </div>
                <p
                  v-show="tr.show"
                  v-for="(item2,index2) in tr.permission.slice(1, tr.permission.length)"
                  :key="index2"
                  class="product-category fold"
                >
                  - {{ item2.name | title }}
                  <i class="text-xs">({{item2.method}})</i>
                </p>
              </vs-td>
              <vs-td v-else>---</vs-td>

              <vs-td>
                <p class="product-price">{{ tr.created_at }}</p>
              </vs-td>
              <!-- <vs-td>
                <vs-progress
                  :percent="Number(tr.popularity)"
                  :color="getPopularityColor(Number(tr.popularity))"
                  class="shadow-md"
                />
              </vs-td>-->

              <!-- <vs-td>
                <vs-chip
                  :color="getOrderStatusColor(tr.order_status)"
                  class="product-order-status"
                >{{ tr.order_status | title }}</vs-chip>
              </vs-td>-->

              <vs-td class="whitespace-no-wrap">
                <feather-icon
                  icon="EyeIcon"
                  class="mx-1"
                  svgClasses="w-5 h-5 hover:text-primary stroke-current"
                  @click.stop="viewData(tr)"
                />
                <feather-icon
                  icon="EditIcon"
                  class="mx-1"
                  svgClasses="w-5 h-5 hover:text-primary stroke-current"
                  @click.stop="editData(tr)"
                />
                <feather-icon
                  icon="TrashIcon"
                  class="mx-1"
                  svgClasses="w-5 h-5 hover:text-danger stroke-current"
                  @click.stop="delId=tr.id, delSinglePopup=true"
                />
                <!-- Delete Popup -->
              </vs-td>
            </vs-tr>
          </tbody>
        </template>
      </vs-table>
      <vs-popup class="text-center" title="Supprimer Epreuves" :active.sync="delSinglePopup">
        <p class="mb-4 text-center">Etes vous sur de vouloir supprimer ce role ?</p>
        <div class="flex justify-center">
          <vs-button class="mr-2" @click="delSinglePopup=false" color="warning" type="filled">Non</vs-button>
          <vs-button
            class="ml-2"
            @click="deleteData(delId), delSinglePopup=false"
            color="danger"
            type="filled"
          >Oui</vs-button>
        </div>
      </vs-popup>
    </div>
  </div>
</template>

<script>
import DataRoleSidebar from "./components/DataRoleSidebar.vue";
import vSelect from "vue-select";
import moduleUserManagement from "@/store/user-management/moduleUserManagement.js";
import axios from "axios";

export default {
  components: {
    DataRoleSidebar,
    "v-select": vSelect,
  },
  data() {
    return {
      delId: null,
      delSinglePopup: false,
      delMiltiPopup: false,
      Pmethod: "",
      selected: [],
      // products: [],
      itemsPerPage: 4,
      isMounted: false,

      // Data Sidebar
      addNewDataSidebar: false,
      sidebarData: {},
    };
  },
  computed: {
    currentPage() {
      if (this.isMounted) {
        return this.$refs.table.currentx;
      }
      return 0;
    },
    roleList() {
      var role1 = this.$store.state.userManagement.roles;
      role1.forEach((element, index) => {
        element.show = false;
        // element.permission.forEach((element2) => {
        // });
      });
      return role1;
    },

    queriedItems() {
      return this.$refs.table
        ? this.$refs.table.queriedResults.length
        : this.roleList.length;
    },
  },
  methods: {
    addNewData() {
      this.Pmethod = "add";
      this.sidebarData = {};
      this.toggleDataSidebar(true);
    },
    deleteData(id) {
      // this.$vs.loading();

      let self = this;
      self.$store
        .dispatch("userManagement/delRole", id)
        .then((response) => {
          // axios
          //   .delete(`/api/roles/delete/${id}`, id)
          //   .then(function (response) {
          self.$vs.loading.close();

          self.$vs.notify({
            title: "Success",
            text: "Ce Role a ete supprimer avec success",
            color: "primary",
            iconPack: "feather",
            icon: "icon-mail",
          });
          self.$store.state.userManagement.roles_has_set = false;
          self.refresh();
        })
        .catch(function (error) {
          console.log("error ", error);
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
    editData(data) {
      // this.sidebarData = JSON.parse(JSON.stringify(this.blankData))
      this.Pmethod = "edit";
      this.sidebarData = data;
      this.toggleDataSidebar(true);
    },
    viewData(data) {
      // this.sidebarData = JSON.parse(JSON.stringify(this.blankData))
      this.Pmethod = "view";
      this.sidebarData = data;
      this.toggleDataSidebar(true);
    },

    toggleDataSidebar(val = false) {
      this.addNewDataSidebar = val;
      if (val == false) {
        this.Pmethod = "";
      }
    },
    async refresh() {
      if (!this.$store.state.userManagement.roles_has_set) {
        let self = this;
        await this.$store
          .dispatch("userManagement/fetchRoles")
          .then((response) => {
            self.$vs.loading.close();
          })
          .catch((err) => {
            self.$vs.notify({
              title: "Erreur",
              text: err.message,
              color: "warning",
              iconPack: "feather",
              icon: "icon-alert-circle",
            });
            self.$vs.loading.close();
          });
      }
    },
  },

  async created() {
    this.$vs.loading();
    if (!moduleUserManagement.isRegistered) {
      this.$store.registerModule("userManagement", moduleUserManagement);
      moduleUserManagement.isRegistered = true;
    }
    if (!this.$store.state.userManagement.roles_has_set) {
      let self = this;
      await this.$store
        .dispatch("userManagement/fetchRoles")
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
            text: err.data.message,
            color: "danger",
            iconPack: "feather",
            icon: "icon-alert-circle",
          });
        });
    }
  },
  mounted() {
    this.isMounted = true;
  },
};
</script>

<style lang="scss" scoped>
#data-list-list-view {
  .vs-con-table {
    /*
      Below media-queries is fix for responsiveness of action buttons
      Note: If you change action buttons or layout of this page, Please remove below style
    */
    @media (max-width: 689px) {
      .vs-table--search {
        margin-left: 0;
        max-width: unset;
        width: 100%;

        .vs-table--search-input {
          width: 100%;
        }
      }
    }

    @media (max-width: 461px) {
      .items-per-page-handler {
        display: none;
      }
    }

    @media (max-width: 341px) {
      .data-list-btn-container {
        width: 100%;

        .dd-actions,
        .btn-add-new {
          width: 100%;
          margin-right: 0 !important;
        }
      }
    }

    .product-name {
      max-width: 23rem;
    }

    .vs-table--header {
      display: flex;
      flex-wrap: wrap;
      margin-left: 1.5rem;
      margin-right: 1.5rem;
      > span {
        display: flex;
        flex-grow: 1;
      }

      .vs-table--search {
        padding-top: 0;

        .vs-table--search-input {
          padding: 0.9rem 2.5rem;
          font-size: 1rem;

          & + i {
            left: 1rem;
          }

          &:focus + i {
            left: 1rem;
          }
        }
      }
    }

    .vs-table {
      border-collapse: separate;
      border-spacing: 0 1.3rem;
      padding: 0 1rem;

      tr {
        box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
        td {
          padding: 20px;
          &:first-child {
            border-top-left-radius: 0.5rem;
            border-bottom-left-radius: 0.5rem;
          }
          &:last-child {
            border-top-right-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
          }
        }
        td.td-check {
          padding: 20px !important;
        }
      }
    }

    .vs-table--thead {
      th {
        padding-top: 0;
        padding-bottom: 0;

        .vs-table-text {
          text-transform: uppercase;
          font-weight: 600;
        }
      }
      th.td-check {
        padding: 0 15px !important;
      }
      tr {
        background: none;
        box-shadow: none;
      }
    }

    .vs-table--pagination {
      justify-content: center;
    }
  }
}
</style>
