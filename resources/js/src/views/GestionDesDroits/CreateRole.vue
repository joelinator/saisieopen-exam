
<template>
  <div class="flex justify-center">
    <vs-card class="w-4/6 bg-white m-10">
      <div class="vx-row mb-6">
        <div class="vx-col w-full">
          <div class="label mb-1 text-base pl-2">Nom Du Role</div>
          <vs-input
            class="w-full"
            name="data-description"
            v-validate="'required'"
            v-model="roleName"
          />
        </div>
        <span
          class="text-danger text-sm ml-6"
          v-show="errors.has('data-description')"
        >{{ errors.first('data-description') }}</span>
      </div>
      <div class="vx-row mb-6 mt-6">
        <div class="vx-col w-full">
          <div class="label mb-1 text-base pl-2">Permissions</div>
          <v-select
            multiple
            :closeOnSelect="false"
            v-model="dataPermissions"
            class="h-M w-full"
            name="route-name"
            v-validate="'required'"
            :options="permissionNameList"
          >/></v-select>
        </div>
        <span
          class="text-danger text-sm ml-6"
          v-show="errors.has('route-name')"
        >{{ errors.first('route-name') }}</span>
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
      dataPermissions: null,
      roleName: null,
      permissionList: [],
      permissionIdList: [],
    };
  },
  computed: {
    permissionNameList() {
      var final = [];
      this.permissionList.forEach((element, index) => {
        final.push(element.name);
        this.permissionIdList.push(element.id);
      });
      return final;
    },
    permissionIds() {
      var index = [];
      this.dataPermissions.forEach((element, ind) => {
        index.push(
          this.permissionNameList.findIndex((curval) => {
            return element == curval;
          })
        );
      });
      var final = [];
      index.forEach((element, ind) => {
        final.push(this.permissionIdList[element]);
      });

      return final;
    },
  },
  methods: {
    submit() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$vs.loading();
          const obj = {
            name: this.roleName,
            permission: this.permissionIds,
          };
          let self = this;
          axios
            .post("/api/roles/add", obj)
            .then(function (response) {
              self.$vs.notify({
                title: "Success",
                text: "Ce Role a ete cree avec success",
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
              self.$vs.loading.close();
              self.$vs.notify({
                title: "Erreur",
                text: error.message,
                color: "warning",
                iconPack: "feather",
                icon: "icon-alert-circle",
              });
            });
        }
      });
    },
    erase() {
      this.dataPermissions = [];
      this.roleName = null;
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
      .dispatch("userManagement/fetchPermissions")
      .then((response) => {
        setTimeout(() => {
          this.$vs.loading.close();
        }, 200);
      })
      .catch((err) => {
        setTimeout(() => {
          this.$vs.loading.close();
        }, 200);
        self.$vs.notify({
          title: "Erreur",
          text: err.message,
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
        console.error(err);
      });

    this.permissionList = this.$store.state.userManagement.permissions;
  },
  mounted() {},
};
</script>

<style scoped>
.h-M {
  height: 43px;
}
</style>