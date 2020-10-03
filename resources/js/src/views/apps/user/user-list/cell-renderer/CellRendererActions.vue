<template>
  <div>
    <div :style="{'direction': $vs.rtl ? 'rtl' : 'ltr'}">
      <feather-icon
        icon="EyeIcon"
        svgClasses="h-5 w-5 mx-2 hover:text-danger cursor-pointer"
        @click="showDetails=true"
      />
      <feather-icon
        v-if="!params.data.hasOwnProperty('deleted_at')"
        icon="Edit3Icon"
        svgClasses="h-5 w-5 mx-2 hover:text-primary cursor-pointer"
        @click="editRecord"
      />
      <feather-icon
        v-if="!params.data.hasOwnProperty('deleted_at')"
        icon="LockIcon"
        svgClasses="h-5 w-5 mx-2 hover:text-danger cursor-pointer"
        @click="confirmLockRecord()"
      />
      <feather-icon
        v-else
        icon="UnlockIcon"
        svgClasses="h-5 w-5 mx-2 hover:text-danger cursor-pointer"
        @click="confirmRestoreRecord()"
      />
      <feather-icon
        v-if="!params.data.hasOwnProperty('deleted_at')"
        icon="Trash2Icon"
        svgClasses="h-5 w-5 ml-2 mr-3 hover:text-danger cursor-pointer"
        @click="confirmDeleteRecord"
      />
    </div>

    <vs-popup classContent="popup" title="Details D'un utilisateur " :active.sync="showDetails">
      <vs-tabs alignment="fixed">
        <vs-tab label="Informations de base">
          <div class="ml-2 mr-2">
            <div class="px-3">
              <!-- ACCOUNT NAME -->
              <div class="pb-2">
                <vs-input
                  class="w-full"
                  label="Nom d'utilisateur"
                  name="accountName"
                  v-validate="'required'"
                  v-model="user.account_name"
                  :disabled="!editModeInfo"
                />
              </div>
              <!-- NAME OF USER -->
              <div class="pb-2">
                <vs-input
                  class="w-full"
                  name="userName"
                  label="Nom"
                  v-validate="'required'"
                  v-model="user.name"
                  :disabled="!editModeInfo"
                />
              </div>
              <!-- TELEPHONE -->
              <div class="pb-2">
                <vs-input
                  class="w-full"
                  name="telephone"
                  label="Telephone"
                  v-validate="'required'"
                  v-model="user.tel"
                  :disabled="!editModeInfo"
                />
              </div>
              <!-- EMAIL -->
              <div class="pb-2">
                <vs-input
                  class="w-full"
                  name="email"
                  type="email"
                  label="Adresse Email"
                  v-validate="'required'"
                  v-model="user.email"
                  :disabled="!editModeInfo"
                />
              </div>
              <!-- DATE OF BIRTH -->
              <div class="pb-2">
                <vs-input
                  class="w-full"
                  name="date_naissance"
                  label="Date de Naissance"
                  type="date"
                  v-validate="'required'"
                  v-model="user.date_naissance"
                  :disabled="!editModeInfo"
                />
              </div>
              <!-- COUNTRY -->
              <div class="pb-2">
                <div class="pl-1 label">Pays</div>
                <v-select
                  :dir="$vs.rtl ? 'rtl' : 'ltr'"
                  v-model="user.pays"
                  :label="'name'"
                  class="h-M w-full"
                  name="Country"
                  :options="paysList"
                  :disabled="!editModeInfo"
                  @input="updateCountry"
                ></v-select>
              </div>
              <!-- SCHOOL -->
              <div class="pb-2" v-show="user.etablissement || editModeInfo">
                <div class="pl-1 label">Etablissement</div>
                <v-select
                  :dir="$vs.rtl ? 'rtl' : 'ltr'"
                  v-model="user.etablissement"
                  class="h-M w-full"
                  :label="'name'"
                  name="school"
                  :options="schoolList"
                  :disabled="!editModeInfo"
                >/></v-select>
              </div>

              <!-- CLASS -->
              <div class="pb-2" v-show="user.classe || editModeInfo">
                <div class="pl-1">Classe</div>
                <v-select
                  :dir="$vs.rtl ? 'rtl' : 'ltr'"
                  v-model="user.classe"
                  class="h-M w-full"
                  :label="'name'"
                  name="school"
                  :options="classList"
                  :disabled="!editModeInfo"
                ></v-select>
              </div>

              <!-- PASSWORD -->
              <!-- <div v-show="editModeInfo" class="pb-2">
              <div class="pl-1">Mot de passe</div>
              <vs-input
                class="w-full"
                name="password"
                type="password"
                v-validate="'required'"
                v-model="user.password"
              />
              </div>-->
              <!-- CONFIRM PASSWORD -->
              <!-- <div v-show="editModeInfo" class="pb-2">
              <div class="pl-1">Confirmer le mot de passe</div>
              <vs-input
                class="w-full"
                name="cPassword"
                type="password"
                v-validate="'required'"
                v-model="user.cPassword"
              />
              </div>-->
              <!-- IS STAFF -->
              <!-- <div class="pb-2">
            <vs-checkbox :disabled="!editModeInfo" class="inline-flex" v-model="user.is_staff">
              <span class="pl-2">Is a staff</span>
            </vs-checkbox>
              </div>-->
            </div>
            <div class="pb-2 mt-4 flex flex-wrap justify-center">
              <div v-if="!editModeInfo">
                <vs-button class="mr-2" @click="toggleEdit()">Editer</vs-button>
              </div>
              <div v-else>
                <vs-button class="mr-2" @click="updateUser()">Enregistrer</vs-button>
                <vs-button color="warning" class="mr-2" @click="toggleEdit()">Annuler</vs-button>
              </div>
            </div>
          </div>
        </vs-tab>
        <vs-tab label="Roles et Permissions">
          <div>
            <!-- Roles -->
            <div class="pb-2" v-if="user.role.length && !editRole">
              <div class="vx-row justify-center ml-4"></div>
              <div class="vx-row mt-3 justify-center"></div>
              <vs-table :data="user.role">
                <template slot="thead">
                  <vs-th>Roles</vs-th>
                </template>
                <template slot-scope="{data}">
                  <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="tr.name">{{tr.name}}</vs-td>
                    <template slot="expand">
                      <div class="w-2/3 flex flex-wrap">
                        <p
                          class="pr-2 text-lg"
                          v-if="tr.permission && tr.permission.length"
                        >Permissions :</p>
                        <div>
                          <vs-chip
                            color="primary"
                            v-for="(permission, index) in tr.permission"
                            :key="index"
                          >{{permission.name}}</vs-chip>
                        </div>
                      </div>
                    </template>
                  </vs-tr>
                </template>
              </vs-table>
            </div>
            <div class="flex flex-wrap justify-center" v-else-if="!editRole">
              <span>Cet Utilisateur n'as pas encore de role</span>
            </div>

            <div class="pb-2" v-else>
              <div class="pl-1">Role</div>
              <v-select
                :dir="$vs.rtl ? 'rtl' : 'ltr'"
                v-model="user.role"
                class="h-full w-full"
                :label="'name'"
                name="school"
                multiple
                :options="rolesList"
                menu-props="auto"
              ></v-select>
            </div>

            <div class="flex flex-wrap justify-center">
              <div v-if="!editRole">
                <vs-button @click="toggleEditRole()" class="mt-4">Editer</vs-button>
              </div>
              <div v-else>
                <vs-button @click="updateUserRole()" class="mr-2">Enregistrer</vs-button>
                <vs-button color="warning" class="mr-2" @click="toggleEditRole()">Annuler</vs-button>
              </div>
            </div>
          </div>
        </vs-tab>
        <vs-tab label="Mot de passe">
          <div>
            <!-- PASSWORD -->
            <div class="pb-2">
              <vs-input
                class="w-full"
                label="Mot de passe"
                name="password"
                type="password"
                v-validate="'required'"
                v-model="user.password"
              />
            </div>
            <!-- CONFIRM PASSWORD -->
            <div class="pb-2">
              <vs-input
                class="w-full"
                name="cPassword"
                type="password"
                label="Confirmation"
                v-validate="'required'"
                v-model="user.cPassword"
              />
            </div>
            <div class="mt-4 flex flex-wrap justify-center">
              <vs-button
                :disabled="!user.password || !user.cPassword || user.password !== user.cPassword"
                class="mr-2 pb-2"
                @click="updateUserPassword"
              >Renitialiser</vs-button>
            </div>
          </div>
        </vs-tab>
      </vs-tabs>
    </vs-popup>
  </div>
</template>

<script>
import vSelect from "vue-select";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  name: "CellRendererActions",
  components: {
    VuePerfectScrollbar,
    "v-select": vSelect,
  },
  data() {
    return {
      showDetails: false,
      editModeInfo: false,
      editRole: false,
      edited_data: {
        pays: null,
      },
      user: null,
      original_user: null,
      settings: {
        // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
    };
  },

  computed: {
    paysList() {
      return this.$store.state.dataList.pays;
    },

    classList() {
      return this.$store.state.dataList.classes;
    },

    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    },

    rolesList() {
      return this.$store.state.userManagement.roles;
    },

    user_permission() {
      let permissions = [];

      this.user.role.forEach((role) => {
        permissions.push(...role.permission);
      });

      return permissions;
    },

    schoolList() {
      var final = [];
      var index;
      if (this.user.pays != null) {
        index = this.paysList.findIndex((element) => {
          return element.id === this.user.pays.id;
        });
        if (index > -1) {
          var regions = [];
          this.paysList[index].regions.forEach((element) => {
            element.etablissements.forEach((element1) => {
              final.push(element1);
            });
          });
          return final;
        }
      }
      return [];
    },
  },
  async created() {
    this.user = {
      ...this.params.data,
    };
    this.original_user = {
      ...this.params.data,
    };
  },
  methods: {
    toggleEdit() {
      this.editModeInfo = !this.editModeInfo;
      // if (!this.editModeInfo) {
      //   this.user = { ...this.original_user };
      // }
    },

    toggleEditRole() {
      this.editRole = !this.editRole;

      if (!this.editRole) {
        this.user = { ...this.original_user };
      }
    },

    updateCountry() {
      this.user.etablissement = null;
    },

    async updateUserRole() {
      let self = this;

      self.$vs.loading();
      self.editRole = false;
      self.showDetails = false;

      try {
        await self.$store.dispatch("userManagement/updateUserRoles", this.user);

        this.original_user = {
          ...this.user,
        };

        self.$vs.notify({
          title: "Success",
          text: "Roles mis à jours avec success",
          color: "success",
          icon: "check_box",
        });
      } catch (err) {
        self.$vs.notify({
          title: "Erreur",
          text: err.message,
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });

        self.showDetails = true;
        self.editRole = true;
      } finally {
        self.$vs.loading.close();
      }
    },

    async updateUserPassword() {
      let self = this;

      self.$vs.loading();
      self.showDetails = false;

      try {
        await self.$store.dispatch(
          "userManagement/updateUserPassword",
          self.user
        );

        self.$vs.notify({
          title: "Success",
          text: "Mot de passe mis à jours avec success",
          color: "success",
          icon: "check_box",
        });
      } catch (err) {
        self.$vs.notify({
          title: "Erreur",
          text: err.message,
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });

        self.showDetails = true;
        self.editRole = true;
      } finally {
        self.$vs.loading.close();
      }
    },

    async updateUser() {
      let self = this;
      var to_send = {
        ...self.user,
      };

      to_send.pays = to_send.pays.id;
      to_send.classe = to_send.classe.id;
      to_send.etablissement = to_send.etablissement.id;

      self.$vs.loading();

      self.showDetails = false;
      self.editModeInfo = false;

      try {
        await self.$store.dispatch("userManagement/updateUser", to_send);

        this.original_user = {
          ...this.user,
        };

        self.$vs.notify({
          title: "Success",
          text: "Utilisateur mis à jours avec success",
          color: "success",
          icon: "check_box",
        });
      } catch (err) {
        self.$vs.notify({
          title: "Erreur",
          text: err.message,
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });

        self.showDetails = true;
        self.editModeInfo = true;
      } finally {
        self.$vs.loading.close();
      }
    },

    editRecord() {
      // this.$router.push(`/apps/user/user-edit/${  268}`).catch(() => {})

      /*
              Below line will be for actual product
              Currently it's commented due to demo purpose - Above url is for demo purpose

              this.$router.push("/apps/user/user-edit/" + this.params.data.id).catch(() => {})
            */

      // this.$router
      //   .push("/apps/user/user-edit1/" + this.params.data.id)
      //   .catch(() => {});

      this.showDetails = true;
      this.editModeInfo = true;
    },
    confirmDeleteRecord() {
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: "Confirmer la Suppression",
        text: `Etes vous sure de vouloir supprimer "${this.params.data.account_name}"`,
        accept: this.deleteRecord,
        acceptText: "Supprimmer",
      });
    },
    confirmLockRecord() {
      this.$vs.dialog({
        type: "confirm",
        color: "warning",
        title: "Confirmer ",
        text: `Etes vous sure de vouloir blocker "${this.params.data.account_name}"`,
        accept: this.blockRecord,
        acceptText: "Blocker",
      });
    },
    confirmRestoreRecord() {
      this.$vs.dialog({
        type: "confirm",
        color: "warning",
        title: "Confirmer ",
        text: `Etes vous sure de vouloir deblocker "${this.params.data.account_name}"`,
        accept: this.restoreRecord,
        acceptText: "Deblocker",
      });
    },
    blockRecord() {
      this.$store
        .dispatch("userManagement/blockUser", this.params.data.id)
        .then(() => {
          this.$vs.notify({
            color: "success",
            title: "Success",
            text: "Cette Utilisateur a ete blocker avec success ",
          });
        })
        .catch((err) => {
          this.$vs.notify({
            title: "Erreur",
            text: err.message,
            color: "primary",
            iconPack: "feather",
            icon: "icon-mail",
          });
        });
    },
    restoreRecord() {
      this.$store
        .dispatch("userManagement/RestoreUser", this.params.data.id)
        .then(() => {
          this.$vs.notify({
            color: "success",
            title: "Success",
            text: "Cette Utilisateur a ete deblocker avec success ",
          });
        })
        .catch((err) => {
          this.$vs.notify({
            title: "Erreur",
            text: err.message,
            color: "primary",
            iconPack: "feather",
            icon: "icon-mail",
          });
        });
    },
    deleteRecord() {
      /* Below two lines are just for demo purpose */

      /* UnComment below lines for enabling true flow if deleting user */
      this.$store
        .dispatch("userManagement/deleteUser", this.params.data.id)
        .then(() => {
          this.showDeleteSuccess();
        })
        .catch((err) => {
          this.$vs.notify({
            title: "Erreur",
            text: err.message,
            color: "primary",
            iconPack: "feather",
            icon: "icon-mail",
          });
        });
    },
    showDeleteSuccess() {
      this.$vs.notify({
        color: "success",
        title: "Success",
        text: "Cette Utilisateur a ete supprimer avec success ",
      });
    },
  },
};
</script>

<style scoped  lang="scss">
.label {
  padding-left: 5px;
  font-size: 0.85rem;
  color: rgba(0, 0, 0, 0.7);
}

// .scroll-area--data-list-add-new {
//   // height: calc(var(--vh, 1vh) * 100 - 4.3rem);
//   height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 82px);

//   &:not(.ps) {
//     overflow-y: auto;
//   }
// }
</style>
