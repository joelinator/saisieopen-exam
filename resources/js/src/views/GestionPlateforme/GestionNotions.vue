<template>
  <div class="flex justify-center w-full">
    <div class="w-full sm:w-11/12 md:w-4/5">
      <!--Edit notion popup -->
      <vs-popup classContent="popup" title="Modifier Notion" :active.sync="showEdit">
        <vs-input placeholder="Nom" class="h-M w-full mb-6" label="Nom" v-model="newName"></vs-input>Chapitres
        <v-select
          v-model="newDataChapitres"
          multiple
          :closeOnSelect="false"
          class="h-M w-full justify-end my-2"
          name="chapitre-names"
          :options="chapNames"
        />
        <vs-textarea class="mt-2" label="Description" v-model="newDesc" placeholder="Description"></vs-textarea>
        <div class="vx-row justify-end">
        <vs-button class="mr-4" type="border" @click="editNotion(editId)">Modifier</vs-button>
        </div>
      </vs-popup>

      <!--Add notion popup -->
      <vs-popup classContent="popup" title="Ajouter une notion" :active.sync="showAdd">
        Nom de la notion
        <vs-input type="text" v-model="choosenNotion" class="h-M w-full mb-8"></vs-input>
        <!-- v-validate="'required'" -->
        Description de la notion
        <vs-textarea v-model="notionDesc"></vs-textarea>Chapitres
        <v-select
          v-model="dataChapitres"
          :value="dataChapitres"
          multiple
          :closeOnSelect="false"
          class="h-M w-full justify-end my-2"
          name="chapitre-names"
          :options="chapNames"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />

        <div v-show="!showEdit" class="vx-row justify-end mb-6 mt-6">
          <div class="vx-col">
            <vs-button @click="addNotion" type="border" color="primary">Enregistrer</vs-button>
          </div>
        </div>
      </vs-popup>

      <!--Delete notion popup -->
      <vs-popup classContent="popup" title="Supprimer Notion" :active.sync="showDelete">
        <div
          class="delete-message text-center mb-4"
        >Voulez vraiment supprimer cette notion ({{getNotion(deleteIndex) !== undefined?getNotion(deleteIndex).title:''}})</div>
        <div class="delete-actions flex justify-center">
          <vs-button type="border" class="mr-2" @click="showDelete=false">Non</vs-button>
          <vs-button type="border" class="ml-2" color="danger" @click="deleteNotion(deleteIndex)">Oui</vs-button>
        </div>
      </vs-popup>

      <vs-card>
        <template>
          <div class="mt-2 mb-4 mat-hheader justify-center flex items-center">
            <h3 class="mr-2">Notions</h3>
          </div>
        </template>

        <vs-table max-items="10" pagination search :data="notions">
          <template slot="header">
            <div class="add-notion-button flex justify-start">
              <vs-button
              type="border"
                @click="showAdd=true,choosenNotion='',
                  dataChapitres=[],
                  notionDesc=''"
              >Ajouter</vs-button>
            </div>
          </template>
          <template slot="thead">
            <vs-th>Nom</vs-th>
            <vs-th>Description</vs-th>
            <vs-th>Actions</vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(notion, indextr) in data">
              <vs-td :data="notion.title">{{notion.title}}</vs-td>
              <vs-td :data="notion.description">{{notion.description}}</vs-td>
              <vs-td class="whitespace-no-wrap">

                <feather-icon
                  icon="EditIcon"
                  class="mx-1 cursor-pointer"
                  svgClasses="w-5 h-5 hover:text-danger stroke-current"
                  @click="toggleEdit(notion.id)"
                />
                <feather-icon
                  icon="TrashIcon"
                  class="mx-1 cursor-pointer"
                  svgClasses="w-5 h-5 hover:text-danger stroke-current"
                  @click="toggleDelete(notion.id)"
                />
              </vs-td>

              <template class slot="expand">
                <div class="w-2/3 flex flex-wrap">
                  <p class="pr-2 text-lg">Chapitres :</p>
                  <div v-if="notion.chapitres && notion.chapitres.length">
                    <vs-chip 
                      color="primary"
                      v-for="(chapitre, index) in notion.chapitres"
                      :key="index"
                    >{{chapitre.title}}</vs-chip>
                  </div>
                </div>
              </template>
            </vs-tr>
          </template>
        </vs-table>
      </vs-card>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
import moduleDataList from "@/store/data-list/moduleDataList.js";
import { mapGetters } from "vuex";
export default {
  name: "GestionNotions",
  components: {
    "v-select": vSelect,
  },
  data() {
    return {
      showEdit: false,
      showDelete: false,
      choosenNotion: "",
      dataChapitres: [],
      notionDesc: "",
      newName: "",
      newDesc: "",
      newDataChapitres: [],
      searchKey: "",
      editId: null,
      deleteIndex: null,
      showAdd: false,
      indList: [],
    };
  },
  computed: {
    ...mapGetters("dataList", ["notions"]),
    ...mapGetters("dataList", ["chapitres"]),

    chapNames() {
      var final = [];
      if (this.chapitres !== []) {
        this.chapitres.forEach((element) => {
          final.push({
            label: element.title,
            value: element.title,
            id: element.id,
          });
          this.indList.push(element.id);
        });
        return final;
      }
      return [];
    },
    chosenChapIds() {
      var final = [];

      if (this.showAdd) {
        if (this.dataChapitres !== []) {
          this.dataChapitres.forEach((el) => {
            var index = null;
            index = this.chapNames.findIndex((element) => {
              return element === el;
            });
            final.push(this.indList[index]);
          });
        }
      } else if (this.showEdit) {
        if (this.newdataChapitres !== []) {
          this.newdataChapitres.forEach((el) => {
            var index = null;
            index = this.chapNames.findIndex((element) => {
              return element === el;
            });
            final.push(this.indList[index]);
          });
        }
      }
      return final;
    },
  },

  watch: {},
  methods: {
    async addNotion() {
      this.$vs.loading();
      try {
        const reqData = {
          title: this.choosenNotion,
          description: this.notionDesc,
          chapitres: this.chosenChapIds,
        };

        await this.$store.dispatch("dataList/createNotion", reqData);

        this.showAdd = false;
        this.$vs.notify({
          text: "Notion Crée avec succès",
          color: "primary",
          // iconPack: "feather",
          // icon: "icon-alert-circle",
        });
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

    async deleteNotion(id) {
      this.$vs.loading();
      await this.$store
        .dispatch("dataList/deleteNotion", {
          id: id,
        })
        .then((resp) => {
          this.showDelete = false;
          this.$vs.notify({
            title: "Info",
            text: "Suppression réussie",
            color: "primary",
            iconPack: "feather",
            icon: "icon-alert-circle",
          });
        })
        .catch((err) => {
          this.$vs.notify({
            title: "Erreur",
            text: err.message,
            color: "warning",
            iconPack: "feather",
            icon: "icon-alert-circle",
          });
        })
        .finally(() => {
          this.$vs.loading.close();
        });
    },

    editNotion(editId) {
      this.$vs.loading();
      this.$store
        .dispatch("dataList/updateNotion", {
          id: editId,
          title: this.newName,
          description: this.newDesc,
          chapitres: this.newdataChapitres,
        })
        .then((resp) => {
          this.showEdit = false;
          this.$vs.notify({
            title: "Info",
            text: "Modification réussie",
            color: "primary",
            iconPack: "feather",
            icon: "icon-alert-circle",
          });
        })
        .catch((err) => {
          this.$vs.notify({
            title: "Erreur",
            text: err.message,
            color: "warning",
            iconPack: "feather",
            icon: "icon-alert-circle",
          });
        })
        .finally(() => this.$vs.loading.close());
    },
    toggleEdit(id) {
      let not = this.getNotion(id);
      if (not != undefined && not != null) {
        this.newName = not.title;
        this.newDesc = not.description;
        var final = [];

        if (not.chapitres != []) {
          not.chapitres.forEach((element) => {
            final.push({
              label: element.title,
              value: element.title,
              id: element.id,
            });
          });

          this.newDataChapitres = final;
        }
        this.editId = id;
        this.showEdit = true;
      }
    },
    toggleDelete(index) {
      this.deleteIndex = index;
      this.showDelete = true;
    },
    getNotion(deleteIndex) {
      return this.notions.find((elt) => elt.id == deleteIndex);
    },
  },
  async created() {
    this.$vs.loading();
    if (!moduleDataList.isRegistered) {
      this.$store.registerModule("dataList", moduleDataList);
      moduleDataList.isRegistered = true;
    }

    await this.$store
      .dispatch("dataList/fetchNotionsList")
      .then((res) => {
        this.$vs.loading.close();
      })
      .catch((err) => {
        this.$vs.notify({
          title: "Erreur",
          text: err.message,
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
        this.$vs.loading.close();
      });
    await this.$store
      .dispatch("dataList/fetchChapitresList")
      .then((res) => {
        if (!this.$store.state["dataList/classes"])
          this.$store.dispatch("dataList/fetchClassesList").then((res) => {
            this.$vs.loading.close();
          });
        else this.$vs.loading.close();
      })
      .catch((err) => {
        this.$vs.notify({
          title: "Erreur",
          text: err.message,
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
        this.$vs.loading.close();
      });
  },

  mounted() {},
};
</script>

<style lang="scss" scoped>
</style>
