<template>
  <div class="flex justify-center w-full">
    <div class="w-4/5">
      <vs-card>
        <div class="vx-row mb-6 mt-6">
          <div class="vx-col w-1/2">
            <v-select
              v-model="chosenRole"
              class="h-M w-full"
              name="route-name"
              v-validate="'required'"
              :options="roleList_computed"
            ></v-select>
          </div>
          <div class="vx-col">
            <!-- <router-link to="/createrole"> -->
            <vs-button
              to="/createrole"
              color="primary"
              type="filled"
              icon="add_circle_outline"
            >Ajouter un role</vs-button>
            <!-- </router-link> -->
          </div>
        </div>
        <div class="mb-6 mt-6">
          <div class="ml-6">
            <div class="flex justify-between flex-wrap">
              <h3 class="pr-2 self-center">Liste des Permissions</h3>
              <vs-input
                icon-pack="feather"
                icon="icon-search"
                v-model="filter"
                size="small"
                class="pl-2 pr-3 ml-auto self-center"
              />
            </div>
            <ul class="flex flex-wrap mt-3 ml-3">
              <li
                @click="showEdit=true"
                class="text-base my-1 pr-4"
                v-for="(item,index) in filtered_permissions"
                :key="index"
              >
                <vs-checkbox v-model="updatedPer" :vs-value="item">{{item}}</vs-checkbox>
              </li>
            </ul>
            <h4
              class="text-center mx-1 mt-5"
              style="color:lightgray"
              v-show="filtered_permissions==''"
            >Aucun resultat a afficher</h4>
          </div>
        </div>
        <div v-show="showEdit" class="vx-row justify-end mb-6 mt-6">
          <div class="vx-col">
            <vs-button @click="updateRole()" type="filled" color="primary">Enregistrer</vs-button>
          </div>
          <div class="vx-col">
            <vs-button @click="reinitialise()" type="filled" color="warning">Reinitialiser</vs-button>
          </div>
        </div>
      </vs-card>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
import moduleUserManagement from "@/store/user-management/moduleUserManagement.js";
import axios from "axios";

export default {
  components: {
    "v-select": vSelect,
  },
  data() {
    return {
      showEdit: false,
      filter: "",
      roleList: [],
      chosenRole: null,
      chosenId: null,
      updatedPer: [],
      defaultPer: [],
      permissionList: [],
    };
  },
  computed: {
    filtered_permissions() {
      var final1 = [];
      var final2 = [];
      this.permissionList.forEach((element, index) => {
        final1.push(element.name);
      });
      if (this.filter != "") {
        final1.forEach((element, index) => {
          if (element.toLowerCase().includes(this.filter.toLowerCase())) {
            final2.push(element);
          }
        });
        return final2;
      } else {
        return final1;
      }
    },
    permissionIds() {
      var final = [];
      this.updatedPer.forEach((element, index) => {
        this.permissionList.forEach((element2, index2) => {
          if (element == element2.name) {
            final.push(element2.id);
            return;
          }
        });
      });
      return final;
    },
    roleList_computed() {
      var final = [];
      this.roleList.forEach((element, index) => {
        final.push(element.name);
      });
      return final;
    },
    permissionNameList() {
      var final = [];
      this.permissionList.forEach((element, index) => {
        final.push(element.name);
      });
      return final;
    },
    getFinalPermIDs() {
      var final = [];
      this.updatedPer.forEach;
    },
  },

  watch: {
    chosenRole() {
      var final = [];
      var chosenIndex = null;
      if (this.chosenRole != null && this.chosenRole != undefined) {
        this.roleList.forEach((element, index) => {
          if (element.name == this.chosenRole) {
            chosenIndex = index;
            return;
          }
        });
        this.roleList[chosenIndex].permission.forEach((element, index) => {
          final.push(element.name);
        });
      }
      this.chosenId = this.roleList[chosenIndex].id;
      this.updatedPer = final;
      this.defaultPer = final;
    },
  },
  methods: {
    reinitialise() {
      this.updatedPer = this.defaultPer;
    },
    updateRole() {
      this.$vs.loading();
      const obj = {
        id: this.chosenId,
        name: this.chosenRole,
        permission: this.permissionIds,
      };
      let self = this;
      axios
        .put(`/api/roles/update/${obj.id}`, obj)
        .then(function (response) {
          self.$vs.loading.close();
          self.showEdit = false;
          self.$vs.notify({
            title: "Success",
            text: "Ce Role a ete changee avec success",
            color: "primary",
            iconPack: "feather",
            icon: "icon-mail",
          });
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
    if (!moduleUserManagement.isRegistered) {
      this.$store.registerModule("userManagement", moduleUserManagement);
      moduleUserManagement.isRegistered = true;
    }
    let self = this;
    await this.$store
      .dispatch("userManagement/fetchRoles")
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

    this.permissionList = this.$store.state.userManagement.permissions;
    this.roleList = this.$store.state.userManagement.roles;
    if (this.roleList_computed != undefined) {
      this.chosenRole = this.roleList_computed[0];
    }
    setTimeout(() => {
      this.$vs.loading.close();
    }, 200);
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
</style>