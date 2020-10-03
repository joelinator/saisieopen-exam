<template>
  <div class="flex justify-center w-full">
    <div class="w-4/5">
      <vs-card>
        <div class="flex justify-center p-3">
          <h1>Etablissements</h1>
        </div>

        <div class="demo-alignment">
          <vs-popup class="text-center" title="Nouvel etablissement" :active.sync="popupActive">
            <div class="vx-col flex flex-col text-left justify-center">
              <div class="flex-col justify-center">
                <div class="vx-col mt-4 w-11/12 md:w-1/2 mx-auto">
                  Pays
                  <v-select
                    v-model="selectedCountry"
                    class="h-M w-full justify-end my-2"
                    name="route-name"
                    v-validate="'required'"
                    :options="countriesName"
                  />
                </div>
                <div class="vx-col w-11/12 md:w-1/2 mx-auto">
                  Region
                  <v-select
                    v-model="selectedState"
                    class="h-M w-full my-2"
                    name="route-name"
                    v-validate="'required'"
                    :options="regionsName"
                  />
                </div>
                <div class="vx-col w-11/12 md:w-1/2 mx-auto">
                  Nom de l'etablissement
                  <vs-input
                    v-model="chosenSchool"
                    class="h-M w-full my-2"
                    name="route-name"
                    v-validate="'required'"
                  />
                </div>
              </div>

              <div class="vx-row justify-center mb-6 mt-6">
                <div class="vx-col">
                  <vs-button
                    @click="removeSchool(),popupActive=false"
                    type="border"
                    color="danger"
                  >Annuler</vs-button>
                  <vs-button @click="registerschool()" type="border" color="primary">Enregistrer</vs-button>
                </div>
                <vs-popup title="Supprimer etablissement" :active.sync="popUp">
                  <p class="mb-4 text-center">Etes vous sur de vouloir supprimer c'etablissement?</p>
                  <div class="flex justify-center">
                    <vs-button
                      class="mr-2"
                      @click="popupActive=true, popUp=false"
                      color="warning"
                      type="border"
                    >Non</vs-button>
                    <vs-button
                      class="ml-2"
                      @click="popupActive=false, popUp=false"
                      color="danger"
                      type="border"
                    >Oui</vs-button>
                  </div>
                </vs-popup>
                <vs-popup title="Supprimer etablissement" :active.sync="popUp1">
                  <p class="mb-4 text-center">Etes vous sur de vouloir supprimer cet etablissement?</p>
                  <div class="flex justify-center">
                    <vs-button class="mr-2" @click=" popUp1=false" color="warning" type="border">Non</vs-button>
                    <vs-button
                      class="ml-2"
                      @click="deleteRow(),popUp1=false"
                      color="danger"
                      type="border"
                    >Oui</vs-button>
                  </div>
                </vs-popup>
              </div>
            </div>
          </vs-popup>
          <!-- popup for editing -->
          <vs-popup class="holamundo" title="Modifier etablissement" :active.sync="popupActive1">
            <h1 class="flex justify-center">Modifier etablissement</h1>
            <div class="vx-col flex flex-col text-left justify-center">
              <div class="flex-col justify-center">
                <div class="vx-col mt-4 w-11/12 md:w-1/2 mx-auto">
                  Pays
                  <v-select
                    v-model="selectedCtry"
                    class="h-M w-full justify-end"
                    name="route-name"
                    v-validate="'required'"
                    :options="countriesName"
                  />
                </div>
                <div v-if="selectedCtry" class="vx-col mt-4 w-11/12 md:w-1/2 mx-auto">
                  Region
                  <v-select
                    v-model="selectedRegion1"
                    class="h-M w-full"
                    name="route-name"
                    v-validate="'required'"
                    :options="getRegionsName(selectedCtry)"
                  />
                </div>
                <div v-if="selectedRegion1" class="vx-col mt-4 w-11/12 md:w-1/2 mx-auto">
                  Nom de l'etablissement
                  <v-select
                    taggable
                    v-model="chosenSchl"
                    class="h-M w-full"
                    name="route-name"
                    v-validate="'required'"
                  />
                </div>
              </div>
            </div>
            <div class="vx-row justify-center mb-6 mt-6">
              <div class="vx-col">
                <vs-button @click="popupActive1 = false" type="border" color="danger">Annuler</vs-button>
                <vs-button @click="editSchool" type="border" color="primary">Enregistrer</vs-button>
              </div>
            </div>
          </vs-popup>
        </div>

        <vs-table :data="schoolsName" search max-items="6" pagination>
          <template slot="header">
            <vs-button @click="popupActive=true" type="border" color="primary">Nouveau</vs-button>
          </template>
          <template slot-scope="{data}">
            <vs-th>Etablissements</vs-th>
            <vs-th>Region</vs-th>
            <vs-th>Pays</vs-th>
            <vs-th>Actions</vs-th>
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
              <vs-td :data="tr.name">{{tr.name}}</vs-td>
              <vs-td :data="tr.region.name">{{tr.region.name}}</vs-td>
              <vs-td :data="tr.pays.name">{{tr.pays.name}}</vs-td>

              <vs-td class="whitespace-no-wrap">
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
                  @click="invokeDelete(tr.id)"
                />
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>

        <div class="mb-6 mt-6">
          <div class="ml-6">
            <div class="flex justify-between flex-wrap"></div>
          </div>
        </div>
      </vs-card>
    </div>
  </div>
</template>

<script>
import moduleDataList from "@/store/data-list/moduleDataList.js";
import axios from "axios";
import vSelect from "vue-select";
import countryList from "./countries-FR.json";
import RegionList from "./regions.json";
export default {
  name: "Gerer-les-etablissements",
  components: {
    "v-select": vSelect,
  },
  data() {
    return {
      Cid: "",
      popupActive: false,
      popUp: false,
      popUp1: false,
      popupActive1: false,
      selectedCtry: null,
      selectedRegion1: null,
      chosenSchl: null,
      selectedCountry: "",
      chosenRole: "",
      selectedState: "",
      currentCountry: null,
      chosenRegion: "",
      editInfo: {},
      chosenSchool: [],
      school: [],
      Pmethod: "",
      etablissement: ["uppersixth", "lowersixth"],
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
    selectedCountrie() {
      let self = this;
      let countrie = this.countries.find(function (element) {
        return element.name == self.selectedCountry;
      });
      return countrie;
    },
    regionsName() {
      let regions = [];
      // console.log("regionsName ===.. ", regionsName)
      if (this.selectedCountrie)
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
    schools() {
      return this.$store.state.dataList.etablissement;
    },
    schoolsName() {
      let schoolsf = [];
      //
      if (this.schools !== []) {
        this.schools.forEach((element) => {
          schoolsf.push({
            id: element.id,
            name: element.name,
            region: element.region,
            pays: element.pays,
          });
        });
        return schoolsf;
      }
      return [];
    },
  },
  watch: {
    selectedCountry() {
      this.selectedState = "";
    },
    selectedState() {
      this.chosenSchool = [];
    },
    selectedCtry(newVal) {
      if (newVal && this.selectedRegion1) {
        const regs = this.countries.find((c) => c.name === newVal).regions;

        if (regs && regs.length > 0) this.selectedRegion1 = regs[0].name;
        else {
          this.selectedRegion1 = "  ";
          this.chosenSchl = "";
        }
      }
    },
  },
  methods: {
    editData(tr) {
      this.popupActive1 = true;
      this.selectedCtry = tr.pays.name;

      this.selectedRegion1 = tr.region.name;

      this.chosenSchl = "";

      this.currentCountry = this.countries.find((ctr) => ctr.id === tr.pays.id);
      this.editInfo.id = tr.id;
      this.editInfo.regionId = tr.region.id;
    },
    getRegionsName(country) {
      let regions = [];
      //
      const regs = this.countries.find((c) => c.name === country).regions;

      regs.forEach((region) => regions.push(region.name));
      //
      return regions;
    },

    asSchool() {
      this.school.push({
        pays: this.selectedCountry,
        regions: this.selectedState,
        etablissement: this.chosenSchool,
      });
    },
    removeSchool() {
      this.selectedCountry = null;
      this.selectedState = null;
      this.chosenSchool = null;
      this.popupActive = false;
    },
    registerschool() {
      this.asSchool();
      const obj = {
        name: this.chosenSchool,
        region: this.selectedRegion.id,
      };
      this.$vs.loading();
      let self = this;
      this.$store
        .dispatch("dataList/createEtablissement", obj)
        .then((response) => {
          self.$vs.notify({
            title: "",
            text: "Enregistrement du etablissement reuissit",
            color: "primary",
            iconPack: "feather",
            icon: "icon-alert-circle",
          });
          self.$vs.loading.close();
          this.popupActive = false;
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
        })
        .finally((resp) => {});
    },
    editSchool() {
      let self = this;

      this.$vs.loading();
      this.$store
        .dispatch("dataList/updateEtablissement", {
          id: this.editInfo.id,
          newName: this.chosenSchl,
          newRegion: this.editInfo.regionId,
        })
        .then((response) => {
          self.$vs.notify({
            title: "",
            text: "Miser adjout de etablissement reuissit",
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
        .finally((resp) => {
          this.$vs.loading.close();
          this.popupActive1 = false;
        });
    },

    erase(id) {
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: "Confirmer la Suppression",
        text: `Etes vous sure de vouloir supprimer cette etablissement?`,
        accept: this.delete(id),
        acceptText: "Supprimmer",
      });
    },
    invokeDelete(id) {
      this.Cid = id;
      this.popUp1 = true;
    },
    deleteRow() {
      this.$vs.loading();
      let self = this;
      this.$store
        .dispatch("dataList/removeEtablissement", this.Cid)
        .then((response) => {
          self.$vs.notify({
            title: "",
            text: "Suppression de etablissement reuissit",
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
        .finally((res) => {
          self.$vs.loading.close();
        });
    },
  },

  async created() {
    let self = this;
    this.$vs.loading();
    try {
      if (!moduleDataList.isRegistered) {
        this.$store.registerModule("dataList", moduleDataList);
        moduleDataList.isRegistered = true;
      }
      if (!this.$store.state.dataList.etablissement_has_set) {
        await this.$store.dispatch("dataList/fetchEtablissement");
      }
      if (!this.$store.state.dataList.pays_has_set) {
        await this.$store.dispatch("dataList/fetchPaysList");
      }
    } catch (error) {
      self.$vs.notify({
        title: "Erreur",
        text: error.message,
        color: "danger",
        iconPack: "feather",
        icon: "icon-alert-circle",
      });
    }
    setTimeout(() => {
      this.$vs.loading.close();
    }, 200);
  },
};
</script>

<style scoped>
</style>