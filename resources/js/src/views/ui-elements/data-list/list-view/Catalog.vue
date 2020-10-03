<!-- =========================================================================================
  File Name: DataListListView.vue
  Description: Data List - List View
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="data-list-list-view" class="data-list-container">
    <data-view-sidebar
      :isSidebarActive="addNewDataSidebar"
      @closeSidebar="toggleDataSidebar"
      :data="sidebarData"
    />

    <vs-table
      ref="table"
      multiple
      v-model="selected"
      pagination
      :max-items="itemsPerPage"
      search
      :data="epreuves"
    >
      <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
        <div class="flex flex-wrap-reverse items-center data-list-btn-container">
          <!-- ACTION - DROPDOWN -->
          <vs-dropdown
            v-if="epreuves.length>0"
            vs-trigger-click
            class="dd-actions cursor-pointer mr-4 mb-4"
          >
            <div
              class="p-4 shadow-drop rounded-lg d-theme-dark-bg cursor-pointer flex items-center justify-center text-lg font-medium w-32 w-full"
            >
              <span class="mr-2">Actions</span>
              <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
            </div>

            <vs-dropdown-menu>
              <router-link :to="'/exams/'+ newId">
                <vs-dropdown-item v-if="selected.length<=1">
                  <span class="flex items-center">
                    <feather-icon icon="EditIcon" svgClasses="h-4 w-4" class="mr-2" />
                    <span>Editer</span>
                  </span>
                </vs-dropdown-item>
              </router-link>
              <vs-dropdown-item @click="delExams()">
                <!-- @click down here to be brought up to vs drop item -->
                <vs-popup
                  @click="selected.length!=0 ? popup2Active=true : popup2Active=false"
                  class="text-center"
                  title="Supprimer Epreuves"
                  :active.sync="popup2Active"
                >
                  <p class="mb-4 text-center">Etes vous sur de vouloir supprimer ces epreuves?</p>
                  <div class="flex justify-center">
                    <vs-button
                      class="mr-2"
                      @click="popup2Active=false"
                      color="warning"
                      type="border"
                    >Non</vs-button>
                    <vs-button class="ml-2" @click="delExams()" color="danger" type="border">Oui</vs-button>
                  </div>
                </vs-popup>
                <span class="flex items-center">
                  <feather-icon icon="TrashIcon" svgClasses="h-4 w-4" class="mr-2" />
                  <span>Supprimer</span>
                </span>
              </vs-dropdown-item>

              <vs-dropdown-item>
                <span class="flex items-center">
                  <feather-icon icon="ArchiveIcon" svgClasses="h-4 w-4" class="mr-2" />
                  <span>Archiver</span>
                </span>
              </vs-dropdown-item>

              <vs-dropdown-item>
                <span class="flex items-center">
                  <feather-icon icon="FileIcon" svgClasses="h-4 w-4" class="mr-2" />
                  <span>Imprimer</span>
                </span>
              </vs-dropdown-item>

              <vs-dropdown-item>
                <span class="flex items-center">
                  <feather-icon icon="SaveIcon" svgClasses="h-4 w-4" class="mr-2" />
                  <span>Autre Action</span>
                </span>
              </vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown>

          <!-- ADD NEW -->
          <router-link :to="'/createExams'" @click.stop.prevent>
            <div
              class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
            >
              <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
              <span class="ml-2 text-base text-primary">Nouveau</span>
            </div>
          </router-link>
        </div>

        <!-- ITEMS PER PAGE -->
        <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
          <div
            class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium"
          >
            <span
              class="mr-2"
            >{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ products.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : products.length }} of {{ queriedItems }}</span>
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
        <vs-th sort-key="matierre">Matière</vs-th>
        <vs-th sort-key="classe">Classe</vs-th>
        <!-- <vs-th sort-key="school_year">Année scolaire</vs-th> -->
        <vs-th sort-key="sequence">Séquence/Session</vs-th>
        <vs-th sort-key="etablissement">Etablissement</vs-th>
        <!-- <vs-th sort-key="duree">Durée</vs-th> -->
        <!-- <vs-th sort-key="created_at">Créé le</vs-th> -->
        <vs-th sort-key="updated_at">Dernière MAJ</vs-th>
        <vs-th>Action</vs-th>
      </template>

      <template slot-scope="{data}">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              <router-link
                :to="'/exams/'+tr.body.id"
                @click.stop.prevent
                class="text-inherit hover:text-primary"
              >
                <p class="product-name font-medium truncate">{{ tr.body.matiere.name }}</p>
              </router-link>
            </vs-td>

            <vs-td>
              <p class="product-category">{{ tr.body.classe | title }}</p>
            </vs-td>

            <!-- <vs-td>
              <p
                class="product-price"
              >{{ tr.body.anne_scolaire != null ? tr.body.anne_scolaire.annee : "---" }}</p>
            </vs-td>-->

            <vs-td>
              <p
                class="product-price"
              >{{ tr.body.sequence != null ? tr.body.sequence : tr.body.session }}</p>
              <!-- <vs-chip
                :color="getOrderStatusColor(tr.body.order_status)"
                class="product-order-status"
              >{{ tr.body.order_status | title }}</vs-chip>-->
            </vs-td>

            <vs-td>
              <p class="product-price">{{ tr.body.etablissement.name }}</p>
            </vs-td>
            <!-- <vs-td>
              <p class="product-price">{{ tr.body.duration }}</p>
            </vs-td>-->
            <!-- <vs-td>
              <p class="product-price">{{ formatDate(tr.body.created_at) }}</p>
            </vs-td>-->
            <vs-td>
              <p class="product-price">{{ formatDate(tr.body.updated_at) }}</p>
            </vs-td>

            <vs-td class="whitespace-no-wrap">
              <router-link :to="'/exams/'+tr.body.id">
                <feather-icon
                  icon="EditIcon"
                  svgClasses="w-5 h-5 hover:text-primary stroke-current"
                />
              </router-link>
              <feather-icon
                icon="TrashIcon"
                svgClasses="w-5 h-5 hover:text-danger stroke-current"
                class="ml-2"
                @click.stop="popupActive=true"
              />
              <vs-popup class="text-center" title="Supprimer Epreuve" :active.sync="popupActive">
                <p class="mb-4 text-center">Etes vous sur de vouloir supprimer cette epreuve?</p>
                <div class="flex justify-center">
                  <vs-button
                    class="mr-2"
                    @click="popupActive=false"
                    color="warning"
                    type="border"
                  >Non</vs-button>
                  <vs-button
                    class="ml-2"
                    @click.stop="deleteData(tr.body.id),popupActive=false"
                    color="danger"
                    type="border"
                  >Oui</vs-button>
                </div>
              </vs-popup>
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>
  </div>
</template>

<script>
import DataViewSidebar from "../DataViewSidebar.vue";
import moduleDataList from "@/store/data-list/moduleDataList.js";
import axios from "axios";
import helpers from "@/store/helpers.js";
var moment = require("moment");

export default {
  name: "catalog",
  components: {
    DataViewSidebar,
  },
  data() {
    return {
      newId: null,
      popupActive: false,
      popup2Active: false,
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
    products() {
      return this.$store.state.dataList.products;
    },
    subjects() {
      return this.$store.state.dataList.subjects;
    },
    epreuves() {
      return this.$store.state.dataList.epreuves;
    },
    queriedItems() {
      return this.$refs.table
        ? this.$refs.table.queriedResults.length
        : this.epreuves.length;
    },
  },
  methods: {
    delExams() {
      var i;
      for (i in this.selected) {
        this.deleteData(this.selected[i].id);
      }
    },
    formatDate(date) {
      return helpers.formatDate(date);
    },
    formatDuration(d) {
      return helpers.formatDuration(d);
    },
    addNewData() {
      this.sidebarData = {};
      this.toggleDataSidebar(true);
    },
    deleteData(id) {
      let self = this;
      axios
        .delete(`/api/deleteExams/${id}`)
        .then(function (response) {
          self.$vs.notify({
            title: "",
            text: "Suppression réuissie",
            color: "primary",
            iconPack: "feather",
            icon: "icon-mail",
          });
          self.$store.dispatch("dataList/removeExams", id).catch((err) => {
            console.error(err);
          });
        })
        .catch(function (error) {
          self.$vs.loading.close();
          self.$vs.notify({
            title: "",
            text: "Echec de Suppression",
            color: "danger",
            iconPack: "feather",
            icon: "icon-alert-circle",
          });
        });
    },
    editData(data) {
      // this.sidebarData = JSON.parse(JSON.stringify(this.blankData))
      this.sidebarData = data;
      this.toggleDataSidebar(true);
    },
    getOrderStatusColor(status) {
      if (status === "on_hold") return "warning";
      if (status === "delivered") return "success";
      if (status === "canceled") return "danger";
      return "primary";
    },
    getPopularityColor(num) {
      if (num > 90) return "success";
      if (num > 70) return "primary";
      if (num >= 50) return "warning";
      if (num < 50) return "danger";
      return "primary";
    },
    toggleDataSidebar(val = false) {
      this.addNewDataSidebar = val;
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
    setTimeout(() => {
      this.$vs.loading.close();
    }, 200);
  },
  mounted() {
    this.isMounted = true;
  },
  watch: {
    selected() {
      if (this.selected.length == 1) {
        this.newId = this.selected[0].id;
      }
    },
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
