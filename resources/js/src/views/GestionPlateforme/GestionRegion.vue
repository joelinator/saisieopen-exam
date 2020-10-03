<template>
  <div class="flex justify-center w-full">
    <!--Edit Region popup -->
    <vs-popup classContent="popup" title="Modifier La region" :active.sync="showEdit">
      Pays
      <span class="required">*</span>

      <v-select
        v-model="edited_data.id_pays"
        class="h-M w-full"
        name="Country"
        :label="'name'"
        v-validate="'required'"
        :options="countries"
      ></v-select>

      <div class="pt-8">
        Nom de la region
        <span class="required">*</span>
        <vs-input type="text" v-model="edited_data.name" class="h-M w-full mb-8"></vs-input>
      </div>

      <div v-show="!showAdd" class="vx-row justify-end mb-6 mt-6">
        <div class="vx-col">
          <vs-button @click="editRegion" type="border" color="primary">Enregistrer</vs-button>
        </div>
      </div>
    </vs-popup>
    <!--Delete Region popup -->
    <vs-popup classContent="popup" title="Supprimer Region" :active.sync="showDelete">
      <div
        class="delete-message text-center mb-4"
      >Voulez vraiment supprimer Cette Region ({{shouldDeleteRegion ?shouldDeleteRegion.region:''}}) ?</div>
      <div class="delete-actions flex justify-center">
        <vs-button type="border" class="mr-2" @click="showDelete=false , shouldDeleteRegion=null">Non</vs-button>
        <vs-button type="border" class="ml-2" color="danger" @click="deleteRegion(shouldDeleteRegion)">Oui</vs-button>
      </div>
    </vs-popup>

    <!--Add Region popup -->
    <vs-popup classContent="popup" title="Ajouter une Region" :active.sync="showAdd">
      Pays
      <span class="required">*</span>

      <v-select
        v-model="new_data.id_pays"
        class="h-M w-full"
        name="Country"
        :label="'name'"
        v-validate="'required'"
        :options="countries"
      ></v-select>

      <div class="pt-8">
        Nom de la region
        <span class="required">*</span>
        <vs-input type="text" v-model="new_data.name" class="h-M w-full mb-8"></vs-input>
      </div>

      <div v-show="!showEdit" class="vx-row justify-end mb-6 mt-6">
        <div class="vx-col">
          <vs-button @click="addRegion" color="primary" type="border">Enregistrer</vs-button>
        </div>
      </div>
    </vs-popup>

    <vs-card>
      <div class="p-3">
        <h3 class="text-center mb-3">Regions</h3>
        <vs-table v-model="selected" pagination max-items="6" search :data="regions_c">
          <template slot="header">
            <vs-row>
              <vs-col vs-type="flex" vs-justify="left" vs-align="center" vs-w="6" vs-xs="12">
                <vs-button @click="toogleAdd()" color="primary" type="border">Ajouter</vs-button>
              </vs-col>

              <vs-col vs-type="flex" vs-justify="left" vs-align="center" vs-w="6" vs-xs="12">
                <div class="w-2/3 flex flex-wrap">
                  <p class="pr-2 text-lg">Pays</p>
                  <v-select
                    class="pl-2 w-full md:w-48"
                    :dir="$vs.rtl ? 'rtl' : 'ltr'"
                    v-model="chosenCountry"
                    :options="countries"
                    :label="'name'"
                  ></v-select>
                </div>
              </vs-col>
            </vs-row>
          </template>
          <template slot="thead">
            <vs-th sort-key="Region">Region</vs-th>
            <vs-th sort-key="Country">Pays</vs-th>
            <vs-th>Actions</vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td :data="data[indextr].region">{{ data[indextr].region }}</vs-td>

              <vs-td :data="data[indextr].country">{{ data[indextr].country}}</vs-td>

              <vs-td class="whitespace-no-wrap">

                <feather-icon
                  icon="EditIcon"
                  class="mx-1 cursor-pointer"
                  svgClasses="w-5 h-5 hover:text-danger stroke-current"
                  @click="toggleEdit(data[indextr])"
                />
                <feather-icon
                  icon="TrashIcon"
                  class="mx-1 cursor-pointer"
                  svgClasses="w-5 h-5 hover:text-danger stroke-current"
                  @click="toggleDelete(data[indextr])"
                />
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </div>
    </vs-card>
  </div>
</template>

<script>
import vSelect from "vue-select";
import moduleDataList from "@/store/data-list/moduleDataList.js";
export default {
  components: {
    vSelect,
  },
  data() {
    return {
      showAdd: false,
      Pmethod: null,
      chosenCountry: null,
      selected: [],
      addNewDataSidebar: false,
      sidebarData: null,
      shouldDeleteRegion: null,
      showDelete: false,
      edited_data: { name: "", id_pays: "" },
      shouldUpdateRegion: null,
      new_data: { name: "", id_pays: "" },
      showEdit: false,
    };
  },
  computed: {
    countries() {
      return this.$store.state.dataList.pays;
    },
    regions_c() {
      var final = this.chosenCountry ? this.chosenCountry.regions : [];
      var final = final.map((elt) => {
        return {
          region: elt.name,
          country: this.chosenCountry.name,
          id_pays: this.chosenCountry,
          ...elt,
        };
      });

      return final;
    },
    countriesName() {
      let pays = [];
      if (this.countries != []) {
        this.countries.forEach((element) => {
          pays.push(element.name);
        });
        return pays;
      }

      return [];
    },
  },
  methods: {
    toogleAdd() {
      this.showAdd = true;
    },
    toggleDataSidebar(val = false) {
      this.addNewDataSidebar = val;
      if (val == false) {
        this.Pmethod = "";
      }
    },

    async deleteRegion(region) {
      region.id_pays = this.chosenCountry.id;
      this.$vs.loading();
      try {
        await this.$store.dispatch("dataList/deleteRegion", {
          ...region,
        });

        this.showDelete = false;
      } catch (err) {
        this.$vs.notify({
          title: "Erreur",
          text: err.message,
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
      } finally {
        this.$vs.loading.close();
        this.shouldDeleteRegion = null;
      }
    },

    async addRegion() {
      if (!this.new_data.id_pays) {
        this.$vs.notify({
          title: "Erreur",
          text: "Choissisez un pays",
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
        return;
      }

      if (!this.new_data.name) {
        this.$vs.notify({
          title: "Erreur",
          text: "Entrez le nom de la region",
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
        return;
      }

      this.$vs.loading();
      try {
        const reqData = {
          id_pays: this.new_data.id_pays.id,
          name: this.new_data.name,
        };

        await this.$store.dispatch("dataList/createRegion", reqData);
      } catch (err) {
        this.$vs.notify({
          title: "Erreur",
          text: err.message,
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
      } finally {
        this.new_data = { name: "", id_pays: "" };
        this.$vs.loading.close();
        this.showAdd = false;
      }
    },

    async editRegion(id) {
      if (!this.edited_data.id_pays) {
        this.$vs.notify({
          title: "Erreur",
          text: "Choissisez un pays",
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
        return;
      }

      if (!this.edited_data.name) {
        this.$vs.notify({
          title: "Erreur",
          text: "Entrez le nom de la region",
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
        return;
      }
      this.$vs.loading();

      var region_send = {
        id: this.edited_data.id,
        id_pays: this.edited_data.id_pays.id,
        name: this.edited_data.name,
        old_id_pays: this.shouldUpdateRegion.id_pays.id,
      };

      try {
        await this.$store.dispatch("dataList/updateRegion", region_send);
        this.edited_data = { name: "", id_pays: "" };
        this.showEdit = false;
        this.shouldUpdateRegion = null;
      } catch (err) {
        this.$vs.notify({
          title: "Erreur",
          text: err.message,
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
      } finally {
        this.$vs.loading.close();
      }
    },

    toggleEdit(region) {
      this.showEdit = true;
      this.edited_data = region;
      this.shouldUpdateRegion = { ...region };
      //this.edited_data.id_pays = this.chosenCountry;
    },
    toggleDelete(region) {
      new Promise((resolve, reject) => {
        this.shouldDeleteRegion = region;
        resolve();
      }).then(() => (this.showDelete = true));
    },
  },
  mounted() {
    if (this.countriesName.length) {
      // this.chosenCountry = this.countriesName[0];
      // console.log(this.chosenCountry);
    }
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
      .then((response) => {
        if (this.countriesName.length) {
          this.chosenCountry = this.countries[0];
        }
      })
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

<style scoped>
.required {
  color: red;
}
.after-select {
  padding-top: 20px;
}
</style>