<template>
  <div class="flex justify-center w-full">
    <div class="w-4/5">
      <vs-card class="mx-auto">
        <div class="p-3">
          <div class="flex justify-center">
            <h1>Pays</h1>
          </div>
          <div class="vx-row flex justify-center mb-6 mt-6">
            <div class="flex justify-start w-full"></div>
            <vs-popup class="h-full" :active.sync="popupActive" title=" ">
              <h3 class="flex justify-center pb-4">Ajout d'un nouveau pays</h3>
              <div class="vx-col flex flex-col justify-center md:flex-row content-center">
                <div class="w-full justify-center md:w-1/2 flex flex-col overflow-visible">
                  <v-select
                    v-model="chosenRole"
                    class="w-full"
                    taggable
                    name="route-name"
                    v-validate="'required'"
                    :options="countryListFinal"
                  ></v-select>
                </div>
              </div>
              <div v-show="!showEdit" class="vx-row flex justify-center mb-6 mt-6 pt-8">
                <div class="vx-col">
                  <vs-button @click="popupActive=false" type="border" color="danger">Annuler</vs-button>
                  <vs-button
                    @click="registerCountry(), popupActive=false"
                    :disabled="this.chosenRole==null"
                    type="border"
                    color="primary"
                  >Modifier</vs-button>
                </div>
              </div>

              <vs-popup title="Supprimer Pays" :active.sync="popup">
                <p class="mb-4 text-center">Etes vous sur de vouloir supprimer ce pays?</p>
                <div class="flex justify-center">
                  <vs-button class="mr-2" @click="popup=false" color="warning" type="border">Non</vs-button>
                  <vs-button
                    class="ml-2"
                    @click="popupActive=false, popup=false"
                    color="danger"
                    type="border"
                  >Oui</vs-button>
                </div>
              </vs-popup>
            </vs-popup>
            <div class="vx-col"></div>
          </div>

          <vs-table search pagination max-items="10" :data="countries">
            <template slot="header">
              <vs-button
                @click="popupActive=true"
                type="border"
                color="primary"
                icon-after
                class="flex flex-row-reverse"
              >Ajouter</vs-button>
            </template>
            <template slot="thead">
              <vs-th>Name</vs-th>
              <vs-th>Code</vs-th>
              <vs-th>Actions</vs-th>
            </template>

            <template slot-scope="{data}">
              <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td :data="data[indextr].name">{{data[indextr].name}}</vs-td>
                <vs-td :data="data[indextr].code">{{data[indextr].code}}</vs-td>
                <vs-td class="whitespace-no-wrap">
                  <!-- <feather-icon
                    icon="EyeIcon"
                    class="mx-1"
                    svgClasses="w-5 h-5 hover:text-primary stroke-current"
                    @click.stop="viewData(tr)"
                  />-->
                  <!-- <feather-icon
                    icon="EditIcon"
                    class="mx-1"
                    svgClasses="w-5 h-5 hover:text-primary stroke-current"
                    @click.stop="editData(tr)"
                  />-->
                  <feather-icon
                    icon="TrashIcon"
                    class="mx-1"
                    svgClasses="w-5 h-5 hover:text-danger stroke-current"
                    @click="popUp=true, id1=data[indextr].id"
                  />
                </vs-td>
              </vs-tr>
            </template>
          </vs-table>
          <vs-popup class="text-center" title="Supprimer Pays" :active.sync="popUp">
            <p class="mb-4 text-center">Etes vous sur de vouloir supprimer ce pays?</p>
            <div class="flex justify-center">
              <vs-button class="mr-2" @click="popUp=false" color="warning" type="border">Non</vs-button>
              <vs-button
                class="ml-2"
                @click="remove(id1), popUp=false"
                color="danger"
                type="border"
              >Oui</vs-button>
            </div>
          </vs-popup>
        </div>
      </vs-card>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
import moduleDataList from "@/store/data-list/moduleDataList.js";
import axios from "axios";
import countryList from "./countries-FR.json";

export default {
  name: "gestion-pays",
  components: {
    "v-select": vSelect,
  },
  data() {
    return {
      popupActive: false,
      id1: null,
      popUp: false,
      popup: false,
      showEdit: false,
      filter: "",
      roleList: [],
      chosenRole: null,
      chosenId: null,
      updatedPer: [],
      defaultPer: [],
      newPays: [],
      permissionList: [],
      roleList_computed: [],
    };
  },
  computed: {
    countries() {
      return this.$store.state.dataList.pays;
    },
    countriesName() {
      let pays = [];
      this.countries.forEach((element) => {
        pays.push(element.name);
      });
      return pays;
    },
    countryListFinal() {
      return Object.values(countryList);
    },
  },

  watch: {},
  methods: {
    remove(id) {
      this.$vs.loading();
      let self = this;
      this.$store
        .dispatch("dataList/removePays", id)
        .then((response) => {
          self.$vs.notify({
            title: "",
            text: "Suppression du pays reuissit",
            color: "primary",
            iconPack: "feather",
            icon: "icon-alert-circle",
          });
        })
        .catch((error) => {
          self.$vs.notify({
            title: "Erreur",
            text: error.message,
            color: "warning",
            iconPack: "feather",
            icon: "icon-alert-circle",
          });
        })
        .finally(() => {
          self.$vs.loading.close();
        });
    },

    async registerCountry() {
      const obj = {
        name: this.chosenRole,
        code: 237,
      };
      this.$vs.loading();
      let self = this;
      await this.$store
        // helps to get ctry from countryList and save it on the table
        .dispatch("dataList/createPays", obj)
        .then((response) => {
          self.$vs.loading.close();
          self.$vs.notify({
            title: "",
            text: "Enregistrement du pays reuissit",
            color: "primary",
            iconPack: "feather",
            icon: "icon-alert-circle",
          });
        })
        .catch((err) => {
          self.$vs.loading.close();
          self.$vs.notify({
            title: "Erreur",
            text: err.data.message,
            color: "danger",
            iconPack: "feather",
            icon: "icon-alert-circle",
          });
          self.$vs.loading.close();
        });
      this.chosenRole = null;
    },
    reinitialise() {
      this.updatedPer = this.defaultPer;
    },
    updateRole() {
      if (this.roleList_computed.length > 0) {
        this.newPays.push(this.roleList_computed[0]);
      }
      this.roleList_computed.shift();
      this.$vs.loading();
      const obj = {
        id: this.chosenId,
        name: this.chosenRole,
        permission: this.updatedPer,
      };
      let self = this;
      axios
        .post(`/api/roles/update/${obj.id}`, obj)
        .then(function (response) {
          self.$vs.notify({
            title: "Success",
            text: "Ce Role a ete changee avec success",
            color: "primary",
            iconPack: "feather",
            icon: "icon-mail",
          });
          self.$vs.loading.close();
          this.showEdit = false;
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
  },
  async created() {
    this.$vs.loading();
    if (!moduleDataList.isRegistered) {
      this.$store.registerModule("dataList", moduleDataList);
      moduleDataList.isRegistered = true;
    }
    let self = this;
    await this.$store
      .dispatch("dataList/fetchPaysList")
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
  mounted() {},
};
</script>

<style lang="scss" scoped>
.popping {
  height: 100%;
  overflow: visible;
}
</style>
