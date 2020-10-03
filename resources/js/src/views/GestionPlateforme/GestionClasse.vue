<template>
  <div class="flex justify-center w-full">
    <div class="w-full sm:w-11/12 md:w-4/5">
      <!--Edit class popup -->
      <vs-popup classContent="popup" title="Modifier Classe" :active.sync="showEdit">
        <vs-input placeholder="Nom" class="h-M w-full mb-6" label="Nom" v-model="newName"></vs-input>

        <div class="vx-row justify-end">
          <vs-button class="mr-4" type="border" color="primary" @click="editClass(editId)">Enregistrer</vs-button>
        
        </div >
        </vs-popup>

      <!--Add class popup -->
      <vs-popup classContent="popup" title="Ajouter une Classe" :active.sync="showAdd">
        Nom de la classe
        <vs-input type="text" v-model="choosenClass" class="h-M w-full mb-8"></vs-input>

        <!--                Description de la classe-->
        <!--                <vs-textarea v-model="classDescription" ></vs-textarea>-->

        <div v-show="!showEdit" class="vx-row justify-end mb-6 mt-6">
          <div class="vx-col">
            <vs-button @click="addClass" type="filled" color="primary">Enregistrer</vs-button>
          </div>
        </div>
      </vs-popup>

      <!--Delete classe popup -->
      <vs-popup classContent="popup" title="Supprimer classe" :active.sync="showDelete">
        <div
          class="delete-message text-center mb-4"
        >Voulez vraiment supprimer cette classe ({{getClass(deleteId)?getClass(deleteId).name:''}})</div>
        <div class="delete-actions flex justify-center">
          <vs-button type="border" class="mr-2" @click="showDelete=false">Non</vs-button>
          <vs-button type="border" class="ml-2" color="danger" @click="deleteClass(deleteId)">Oui</vs-button>
        </div>
      </vs-popup>

      <vs-card>
        <template>
          <div class="mt-2 mat-hheader justify-center flex items-center">
            <h3 class="mr-2">Classes</h3>
          </div>
        </template>

        <vs-table max-items="10" pagination search :data="classes">
          <template slot="header">
            <div class="add-classe-button flex justify-start">
              <vs-button type="border" color="primary" @click="showAdd=true">Ajouter</vs-button>
            </div>
          </template>
          <template slot="thead">
            <vs-th>Nom</vs-th>
            <!--                        <vs-th>Description</vs-th>-->
            <vs-th>Actions</vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(classe, indextr) in data">
              <vs-td :data="classe.name">{{classe.name}}</vs-td>

              <vs-td class="whitespace-no-wrap">

                <feather-icon
                  icon="EditIcon"
                  class="mx-1 cursor-pointer"
                  svgClasses="w-5 h-5 hover:text-danger stroke-current"
                  @click="toggleEdit(classe.id)"
                />
                <feather-icon
                  icon="TrashIcon"
                  class="mx-1 cursor-pointer"
                  svgClasses="w-5 h-5 hover:text-danger stroke-current"
                  @click="toggleDelete(classe.id)"
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
      choosenClass: "",
      newName: "",
      searchKey: "",

      editId: null,
      deleteId: null,
      showAdd: false,
    };
  },
  computed: {
    ...mapGetters("dataList", ["classes"]),
  },

  watch: {},
  methods: {
    getClass(id) {
      return this.classes.find((cls) => cls.id === id);
    },
    async addClass() {
      this.$vs.loading();
      try {
        const reqData = {
          name: this.choosenClass,
        };

        await this.$store.dispatch("dataList/createClasse", reqData);

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
        this.choosenClass = "";
        this.$vs.loading.close();
      }
    },

    async deleteClass(id) {
      this.$vs.loading();
      try {
        await this.$store.dispatch("dataList/deleteClasse", {
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

    async editClass(index) {
      this.$vs.loading();
      try {
        await this.$store.dispatch("dataList/updateClasse", {
          id: this.classes[index].id,
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
    toggleEdit(id) {
      this.newName = this.getClass(id).name;
      this.editId = id;
      this.showEdit = true;
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
      .dispatch("dataList/fetchClassesList")
      .then((res) => {})
      .catch((err) => {
        this.$vs.notify({
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
</style>
