
<template>
  <div class="flex justify-center">
    <vs-card class="w-4/6 bg-white m-10">
      <div class="vx-row mb-6 mt-6">
        <div class="vx-col w-full">
          <div class="label mb-1 text-base pl-2">Nom De La Route</div>
          <v-select
            v-model="dataRouteName"
            class="h-M w-full"
            name="route-name"
            v-validate="'required'"
            :options="methodList"
          >/></v-select>
          <div class="w-full h-20"></div>
        </div>
        <span
          class="text-danger text-sm ml-6"
          v-show="errors.has('route-name')"
        >{{ errors.first('route-name') }}</span>
      </div>
      <div class="vx-row mb-6">
        <div class="vx-col w-full">
          <div class="label mb-1 text-base pl-2">Methode de la Requete</div>
          <v-select
            v-model="dataMethod"
            class="h-M w-full"
            name="data-method"
            v-validate="'required'"
            :options="requestMethods"
          >/></v-select>
        </div>
        <span
          class="text-danger text-sm ml-6"
          v-show="errors.has('data-method')"
        >{{ errors.first('data-method') }}</span>
      </div>
      <div class="vx-row mb-6">
        <div class="vx-col w-full">
          <div class="label mb-1 text-base pl-2">Description</div>
          <vs-input
            class="w-full"
            name="data-description"
            v-validate="'required'"
            v-model="dataDescription"
          />
        </div>
        <span
          class="text-danger text-sm ml-6"
          v-show="errors.has('data-description')"
        >{{ errors.first('data-description') }}</span>
      </div>
      <div class="vx-row">
        <div class="vx-col w-full">
          <vs-button @click="submit()" class="mr-3 mb-2">Creer</vs-button>
          <vs-button @click="erase()" color="warning" type="border" class="mb-2">Reinitialiser</vs-button>
        </div>
      </div>
    </vs-card>
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
      dataMethod: null,
      dataRouteName: null,
      dataDescription: null,
      requestMethods: [
        "Post",
        "Get",
        "Put",
        "Delete",
        "Patch",
        "Options",
        "Head",
      ],
    };
  },
  computed: {
    methodList() {
      return this.$store.state.userManagement.routes;
    },
    lowercaseM() {
      return this.dataMethod.toLowerCase();
    },
  },
  methods: {
    submit() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$vs.loading();
          const obj = {
            name: this.dataRouteName,
            method: this.lowercaseM,
            description: this.dataDescription,
          };
          let self = this;

          axios
            .post("/api/permissions/add", obj)
            .then(function (response) {
              self.$vs.notify({
                title: "Success",
                text: "Cette permission a ete cree avec success",
                color: "primary",
                iconPack: "feather",
                icon: "icon-mail",
              });
              self.$router.push({
                path: "/",
              });
              self.$vs.loading.close();
            })
            .catch(function (error) {
              self.$vs.notify({
                title: "Erreur",
                text: error.message,
                color: "warning",
                iconPack: "feather",
                icon: "icon-alert-circle",
              });
              self.$vs.loading.close();
            });
        }
      });
    },
    erase() {
      this.dataMethod = null;
      this.dataRouteName = null;
      this.dataDescription = null;
    },
    redirect() {
      this.$router.push({
        path: "/",
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
      .dispatch("userManagement/fetchRoutes")
      .then((response) => {
        setTimeout(() => {
          this.$vs.loading.close();
        }, 200);
      })
      .catch((err) => {
        self.$vs.notify({
          title: "Erreur",
          text: err.message,
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
        setTimeout(() => {
          this.$vs.loading.close();
        }, 200);
        console.error(err);
      });

    this.permissionList = this.$store.state.userManagement.permissions;
  },
};
</script>

<style scoped>
.h-M {
  height: 43px;
}
</style>