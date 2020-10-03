<template>
  <div class="the-navbar__user-meta flex items-center" v-if="activeUserInfo.displayName">
    <div class="text-right leading-tight hidden sm:block">
      <p class="font-semibold">{{ activeUserInfo.displayName }}</p>
    </div>

    <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">
      <div class="con-img ml-3">
        <img
          v-if="activeUserInfo.profile"
          key="onlineImg"
          :src="activeUserInfo.profile"
          alt="user-img"
          width="40"
          height="40"
          class="rounded-full shadow-md cursor-pointer block"
        />
        <vs-avatar v-else color="primary" :text=" activeUserInfo.displayName" />
      </div>

      <vs-dropdown-menu class="vx-navbar-dropdown">
        <ul style="min-width: 9rem">
          <li
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
            @click="$router.push('/pages/profile').catch(() => {})"
          >
            <feather-icon icon="UserIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Profile</span>
          </li>

          <li
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
            @click="$router.push('/apps/chat').catch(() => {})"
          >
            <feather-icon icon="MessageSquareIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Chat</span>
          </li>

          <vs-divider class="m-1" />

          <li
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
            @click="logout"
          >
            <feather-icon icon="LogOutIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Logout</span>
          </li>
        </ul>
      </vs-dropdown-menu>
    </vs-dropdown>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";

export default {
  data() {
    return {};
  },
  computed: {
    activeUserInfo() {
      let user = this.$store.state.auth.current_user;
      return {
        ...user,
        displayName: user.account_name ? user.account_name : user.email,
      };
    },
  },
  methods: {
    logout() {
      if (this.$store.state.auth.current_user) {
        this.$store
          .dispatch("auth/logoutJwt")
          .then((response) => {
            this.$store.dispatch('updateUserRole', {aclChangeRole: this.$acl.change, userRole: 'none'});
            //this.$router.push('/');
            //window.location.replace(this.$store.state.auth.logoutRedirect);
            window.location.reload();
          })
          .catch((err) => {
            console.log("error", err);

            this.$vs.notify({
              title: "Erreur",
              text: err.message,
              color: "warning",
              iconPack: "feather",
              icon: "icon-alert-circle",
            });
          });
      }
    },
  },
};
</script>
