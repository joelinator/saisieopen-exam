<template>
  <div class="flex justify-center w-full">
    <div class="w-full sm:w-11/12 md:w-4/5">
      <!--Edit chapitre popup -->
      <vs-popup classContent="popup" title="Modifier Chapitre" :active.sync="showEdit">
        <vs-input placeholder="Nom" class="h-M w-full mb-6" label="Nom" v-model="newName"></vs-input>
        <vs-textarea label="Description" v-model="newDesc" placeholder="Description"></vs-textarea>
        <v-select
          v-model="dataClasse"
          :value="dataClasse"
          multiple
          :closeOnSelect="false"
          class="h-M w-full justify-end my-2"
          name="chapitre-names"
          :options="classesName"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
        <div class="vx-row justify-end">
        <vs-button class="mr-4" type="border" @click="editChapitre(editId)">Modifier</vs-button>
        </div>
      </vs-popup>

      <!--Add chapitre popup -->
      <vs-popup classContent="popup" title="Ajouter une chapitre" :active.sync="showAdd">
        Titre du chapitre
        <vs-input type="text" v-model="choosenChapitre" class="h-M w-full mb-8"></vs-input>Description du chapitre
        <vs-textarea v-model="chapitreDesc"></vs-textarea>Classe(s)
        <v-select
          v-model="dataClasse"
          :value="dataClasse"
          multiple
          :closeOnSelect="false"
          class="h-M w-full justify-end my-2"
          name="chapitre-names"
          :options="classesName"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
        <div v-show="!showEdit" class="vx-row justify-end mb-6 mt-6">
          <div class="vx-col">
            <vs-button @click="addChapitre" type="border" color="primary">Enregistrer</vs-button>
          </div>
        </div>
      </vs-popup>

      <!--Delete chapitre popup -->
      <vs-popup classContent="popup" title="Supprimer chapitre" :active.sync="showDelete">
        <div
          class="delete-message text-center mb-4"
        >Voulez vraiment supprimer ce chapitre ({{getChapter(deleteId) !== undefined?getChapter(deleteId).title:''}})</div>
        <div class="delete-actions flex justify-center">
          <vs-button type="border" class="mr-2" @click="showDelete=false">Non</vs-button>
          <vs-button type="border" class="ml-2" color="danger" @click="deleteChapitre(deleteId)">Oui</vs-button>
        </div>
      </vs-popup>

      <vs-card>
        <template>
          <div class="mt-2 mb-4 mat-hheader justify-center flex items-center">
            <h3 class="mr-2">Chapitres</h3>
          </div>
        </template>

        <vs-table max-items="10" pagination search :data="chapitres">
          <template slot="header">
            <div class="add-chapitre-button flex justify-start">
              <vs-button
              type="border"
                @click="showAdd=true,
            choosenChapitre=null,
                    chapitreDesc='',
                    dataClasse=[]"
              >Ajouter</vs-button>
            </div>
          </template>
          <template slot="thead">
            <vs-th>Nom</vs-th>
            <vs-th>Description</vs-th>
            <vs-th>Actions</vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(chapitre, indextr) in data">
              <vs-td :data="chapitre.title">{{chapitre.title}}</vs-td>
              <vs-td :data="chapitre.description">{{chapitre.description}}</vs-td>
              <vs-td class="whitespace-no-wrap">

                <feather-icon
                  icon="EditIcon"
                  class="mx-1 cursor-pointer"
                  svgClasses="w-5 h-5 hover:text-danger stroke-current"
                  @click="toggleEdit(chapitre.id)"
                />
                <feather-icon
                  icon="TrashIcon"
                  class="mx-1 cursor-pointer"
                  svgClasses="w-5 h-5 hover:text-danger stroke-current"
                  @click="toggleDelete(chapitre.id)"
                />
              </vs-td>

              <template v-if="chapitre.classes && chapitre.classes.length" class slot="expand">
                <div class="w-2/3 flex flex-wrap">
                  <p class="pr-2 text-lg">Classes :</p>

                  <vs-chip color="primary" v-for="(classe, index) in chapitre.classes" :key="index">{{classe.name}}</vs-chip>
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
  name: "GestionChapitres",
  components: {
    "v-select": vSelect,
  },
  data() {
    return {
      showEdit: false,
      showDelete: false,
      choosenChapitre: "",
      chapitreDesc: "",
      newName: "",
      newDesc: "",
      searchKey: "",
      editId: null,
      deleteId: null,
      showAdd: false,
      dataClasse: [],
    };
  },
  computed: {
    ...mapGetters("dataList", ["chapitres"]),
    ...mapGetters("dataList", ["classes"]),
    classesName() {
      let classes = [];
      this.classes.forEach((element) => {
        classes.push({
          label: element.name,
          value: element.name,
          id: element.id,
        });
      });
      return classes;
    },
  },

  watch: {},
  methods: {
    async addChapitre() {
      this.$vs.loading();
      try {
        let cls = [];
        this.dataClasse.forEach((elt) => {
          cls.push(elt.id);
        });
        const reqData = {
          title: this.choosenChapitre,
          description: this.chapitreDesc,
          classes: cls,
        };

        await this.$store.dispatch("dataList/createChapitre", reqData);

        this.showAdd = false;
        this.$vs.notify({
          text: "Chapitre Crée avec succès",
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

    async deleteChapitre(id) {
      this.$vs.loading();
      try {
        await this.$store.dispatch("dataList/deleteChapitre", {
          id: id,
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
      }
    },

    async editChapitre(editId) {
      this.$vs.loading();
      try {
        let cls = [];
        this.dataClasse.forEach((elt) => {
          cls.push(elt.id);
        });
        await this.$store.dispatch("dataList/updateChapitre", {
          id: editId,
          title: this.newName,
          description: this.newDesc,
          classes: cls,
        });

        this.showEdit = false;
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
    toggleEdit(id) {
      let chap = this.getChapter(id);
      if (chap != undefined && chap != null) {
        this.newName = chap.title;
        this.newDesc = chap.description;
        this.dataClasse = [];
        chap.classes.forEach((elt) => {
          this.dataClasse.push({
            label: elt.name,
            value: elt.name,
            id: elt.id,
          });
        });
        this.editId = id;
        this.showEdit = true;
      }
    },
    toggleDelete(index) {
      this.deleteId = index;
      this.showDelete = true;
    },
    getChapter(id) {
      return this.chapitres.find((elt) => elt.id == id);
    },
  },
  async created() {
    this.$vs.loading();
    if (!moduleDataList.isRegistered) {
      this.$store.registerModule("dataList", moduleDataList);
      moduleDataList.isRegistered = true;
    }

    await this.$store
      .dispatch("dataList/fetchChapitresList")
      .then((res) => {
        if (!this.$store.state["dataList/classes"])
          this.$store.dispatch("dataList/fetchClassesList").then((res) => {});
      })
      .catch((err) => {
        this.$vs.notify({
          title: "Erreur",
          text: err.message,
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
      });
    if (!this.$store.state.dataList.classes_has_set) {
      await this.$store.dispatch("dataList/fetchClassesList");
    }
    setTimeout(() => {
      this.$vs.loading.close();
    }, 200);
  },

  mounted() {},
};
</script>

<style scoped>
</style>
