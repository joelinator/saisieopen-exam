<template>
  <div class="flex justify-center w-full">
    <div class="w-full sm:w-11/12 md:w-4/5">
      <!--Edit matiere popup -->
      <vs-popup classContent="popup" title="Modifier Matiere" :active.sync="showEdit">
        <vs-input placeholder="Nom" class="h-M w-full mb-6" label="Nom" v-model="newName"></vs-input>
        <vs-textarea label="Description" v-model="newDesc" placeholder="Description"></vs-textarea>
        <div class="vx-row justify-end">
        <vs-button type="border" color="primary" class="mr-4" @click="editMatiere(editId)">Modifier</vs-button>
        </div>
      </vs-popup>

      <!--Add matiere popup -->
      <vs-popup classContent="popup" title="Ajouter une Matiere" :active.sync="showAdd">
        Nom de la matiere
        <vs-input type="text" v-model="choosenMatiere" class="h-M w-full mb-8"></vs-input>Description de la matiere
        <vs-textarea v-model="matiereDescription"></vs-textarea>

        <div v-show="!showEdit" class="vx-row justify-end mb-6 mt-6">
          <div class="vx-col">
            <vs-button @click="addMatiere" type="border" color="primary">Enregistrer</vs-button>
          </div>
        </div>
      </vs-popup>

      <!--Delete matiere popup -->
      <vs-popup classContent="popup" title="Supprimer Matiere" :active.sync="showDelete">
        <div
          class="delete-message text-center mb-4"
        >Voulez vraiment supprimer cette matiere ({{getMatiere(deleteId)?getMatiere(deleteId).name:''}})</div>
        <div class="delete-actions flex justify-center">
          <vs-button type="border" class="mr-2" @click="showDelete=false">Non</vs-button>
          <vs-button type="border" class="ml-2" color="danger" @click="deleteMatiere(deleteId)">Oui</vs-button>
        </div>
      </vs-popup>

      <vs-card>
        <template>
          <div class="mt-2 mat-hheader flex justify-center items-center">
            <h3 class="mr-2">Matieres</h3>
          </div>
        </template>

        <vs-table max-items="10" pagination search :data="subjects">
          <template slot="header">
            <div class="add-matiere-button flex justify-start">
              <vs-button class="primary" type="border" @click="showAdd=true">Ajouter</vs-button>
            </div>
          </template>

          <template slot="thead">
            <vs-th>Nom</vs-th>
            <vs-th>Description</vs-th>
            <vs-th>Actions</vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr
              @click="showSearch"
              :key="indextr"
              v-for="(matiere, indextr) in data"
              :data="matiere"
            >
              <vs-td :data="matiere.name">{{matiere.name}}</vs-td>
              <vs-td :data="matiere.description">{{matiere.description}}</vs-td>
              <vs-td class="whitespace-no-wrap">

                <feather-icon
                  icon="EditIcon"
                  class="mx-1 cursor-pointer"
                  svgClasses="w-5 h-5 hover:text-danger stroke-current"
                  @click="toggleEdit(matiere.id)"
                />
                <feather-icon
                  icon="TrashIcon"
                  class="mx-1 cursor-pointer"
                  svgClasses="w-5 h-5 hover:text-danger stroke-current"
                  @click="toggleDelete(matiere.id)"
                />
              </vs-td>
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
  name: "GestionMatiere",
  components: {
    "v-select": vSelect,
  },
  data() {
    return {
      showEdit: false,
      showDelete: false,
      choosenMatiere: "",
      matiereDescription: "",
      newName: "",
      newDesc: "",
      editId: null,
      deleteId: null,
      showAdd: false,
      searchKey: "",
    };
  },
  computed: {
    ...mapGetters("dataList", ["subjects"]),
  },

  watch: {},
  methods: {
    getMatiere(id) {
      return this.subjects.find((sbj) => sbj.id === id);
    },
    async addMatiere() {
      this.$vs.loading();
      try {
        const reqData = {
          name: this.choosenMatiere,
          description: this.matiereDescription,
        };

        await this.$store.dispatch("dataList/createMatiere", reqData);

        this.showAdd = false;
      } catch (err) {
        this.$vs.notify({
          title: "Erreur",
          text: err.message,
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
      } finally {
        this.choosenMatiere = "";
        this.matiereDescription = "";
        this.$vs.loading.close();
      }
    },

    async deleteMatiere(id) {
      this.$vs.loading();
      try {
        await this.$store.dispatch("dataList/deleteMatiere", {
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

    async editMatiere(index) {
      this.$vs.loading();
      try {
        await this.$store.dispatch("dataList/updateMatiere", {
          id: this.subjects[index].id,
          name: this.newName,
          description: this.newDesc,
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
    showSearch() {
      console.log(
        "search==>",
        this.$vs.getSearch(this.subjects, this.searchKey)
      );
      this.$vs.loading();
    },
    toggleEdit(id) {
      const mat = this.getMatiere(id);
      if (mat) {
        this.newName = mat.name;
        this.newDesc = mat.description;
        this.editId = mat.id;
        this.showEdit = true;
      }
    },
    toggleDelete(id) {
      this.deleteId = id;
      this.showDelete = true;
    },
  },
  async created() {
    this.$vs.loading();
    if (!moduleDataList.isRegistered) {
      this.$store.registerModule("dataList", moduleDataList);
      moduleDataList.isRegistered = true;
    }

    this.$store
      .dispatch("dataList/fetchMatieresList")
      .then((res) => {})
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
    // setTimeout(() => {
    //   this.$vs.loading.close();
    // }, 200);
  },

  mounted() {},
};
</script>

<style lang="scss" scoped>
</style>
