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
      <data-perm-sidebar
        :isSidebarActive="addNewDataSidebar"
        @closeSidebar="toggleDataSidebar"
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
        :data="permissionList"
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
              >{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ permissionList.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : permissionList.length }} of {{ queriedItems }}</span>
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
          <vs-th sort-key="category">Method</vs-th>
          <vs-th sort-key="popularity">Description</vs-th>
          <vs-th sort-key="price">Created At</vs-th>
          <vs-th>Action</vs-th>
        </template>

        <template slot-scope="{data}">
          <tbody>
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                <p class="product-name font-medium truncate">{{ tr.name | title }}</p>
              </vs-td>

              <vs-td>
                <p class="product-category">{{ tr.method | title }}</p>
              </vs-td>
              <vs-td>
                <p class="product-category">{{ tr.description | title }}</p>
              </vs-td>

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
        <p class="mb-4 text-center">Etes vous sur de vouloir supprimer cette epreuve?</p>
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
import DataPermSidebar from "./components/DataPermSidebar.vue";
import vSelect from "vue-select";
import moduleUserManagement from "@/store/user-management/moduleUserManagement.js";

export default {
  components: {
    DataPermSidebar,
    "v-select": vSelect,
  },
  data() {
    return {
      delId: null,
      delSinglePopup: false,
      delMiltiPopup: false,
      roleList: [],
      selected: [],
      Pmethod: "",
      // products: [],
      itemsPerPage: 4,
      isMounted: false,

      // Data Sidebar
      addNewDataSidebar: false,
      sidebarData: {},
    };
  },
  computed: {
    permissionList() {
      return this.$store.state.userManagement.permissions;
    },
    currentPage() {
      if (this.isMounted) {
        return this.$refs.table.currentx;
      }
      return 0;
    },
    products() {
      return this.$store.state.dataList.products;
    },
    queriedItems() {
      return this.$refs.table
        ? this.$refs.table.queriedResults.length
        : this.permissionList.length;
    },
  },
  methods: {
    addNewData() {
      this.Pmethod = "add";
      this.sidebarData = {};
      this.toggleDataSidebar(true);
    },
    viewData(data) {
      // this.sidebarData = JSON.parse(JSON.stringify(this.blankData))
      this.Pmethod = "view";
      this.sidebarData = data;
      this.toggleDataSidebar(true);
    },
    deleteData(id) {
      let self = this;

      // console.log("selectid___", this.selected[0].id);
      // console.log("id___", id);
      // return;
      self.$vs.loading();
      self.$store
        .dispatch("userManagement/delPerm", id)
        .then((response) => {
          self.$vs.loading.close();

          self.$vs.notify({
            title: "Success",
            text: "Cette permission a ete supprimee avec success",
            color: "primary",
            iconPack: "feather",
            icon: "icon-mail",
          });
        })
        .catch((err) => {
          self.$vs.loading.close();
          self.$vs.notify({
            title: "Erreur",
            text: err.message,
            color: "danger",
            iconPack: "feather",
            icon: "icon-alert-circle",
          });
        });
    },
    editData(data) {
      // this.sidebarData = JSON.parse(JSON.stringify(this.blankData))
      this.Pmethod = "edit";
      this.sidebarData = data;
      this.toggleDataSidebar(true);
    },

    toggleDataSidebar(val = false) {
      this.addNewDataSidebar = val;
      if (val == false) {
        this.Pmethod = "";
      }
    },
    // refresh(){
    //   let perms = this.permissionList
    // }
  },
  mounted() {
    this.isMounted = true;
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
      .then((response) => {})
      .catch((err) => {
        self.$vs.notify({
          title: "Erreur",
          text: err.message,
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
      });
    setTimeout(() => {
      this.$vs.loading.close();
    }, 200);
  },
};
</script>

<style lang="scss">
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
