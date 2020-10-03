<!-- =========================================================================================
  File Name: App.vue
  Description: Main vue file - APP
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div id="app" :class="vueAppClasses">
    <router-view @setAppClasses="setAppClasses" />
  </div>
</template>

<script>
import themeConfig from "@/../themeConfig.js";
import jwt from "@/http/requests/auth/jwt/index.js";

export default {
  data() {
    return {
      vueAppClasses: [],
    };
  },
  watch: {
    "$store.state.theme"(val) {
      this.toggleClassInBody(val);
    },
    "$vs.rtl"(val) {
      document.documentElement.setAttribute("dir", val ? "rtl" : "ltr");
    },
  },
  methods: {
    toggleClassInBody(className) {
      if (className === "dark") {
        if (document.body.className.match("theme-semi-dark"))
          document.body.classList.remove("theme-semi-dark");
        document.body.classList.add("theme-dark");
      } else if (className === "semi-dark") {
        if (document.body.className.match("theme-dark"))
          document.body.classList.remove("theme-dark");
        document.body.classList.add("theme-semi-dark");
      } else {
        if (document.body.className.match("theme-dark"))
          document.body.classList.remove("theme-dark");
        if (document.body.className.match("theme-semi-dark"))
          document.body.classList.remove("theme-semi-dark");
      }
    },
    setAppClasses(classesStr) {
      this.vueAppClasses.push(classesStr);
    },
    handleWindowResize() {
      this.$store.commit("UPDATE_WINDOW_WIDTH", window.innerWidth);

      // Set --vh property
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      );
    },
    handleScroll() {
      this.$store.commit("UPDATE_WINDOW_SCROLL_Y", window.scrollY);
    },

    validURL(str) {
      var pattern = new RegExp(
        "^(https|http?:\\/\\/)?" + // protocol
          "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
          "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
          "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
          "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
          "(\\#[-a-z\\d_]*)?$",
        "i"
      ); // fragment locator
      return !!pattern.test(str);
    },
  },
  mounted() {
    this.toggleClassInBody(themeConfig.theme);
    this.$store.commit("UPDATE_WINDOW_WIDTH", window.innerWidth);

    const vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  },
  async created() {
    //load jwt user from server
    this.$vs.loading();

    var url = new URL(window.location.href);
    var token =
      url.searchParams.get("token") || localStorage.getItem("accessToken");
    var logout =
      url.searchParams.get("logout") ||
      this.$store.state.auth.logoutRedirect ||
      localStorage.getItem("logoutRedirect");

    // token =
    //   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xMjcuMC4wLjE6NTAwMVwvYXBpXC9uZXdhdXRoXC9sb2dpbiIsImlhdCI6MTYwMDg1OTMxNiwiZXhwIjoxNjAwODY1MzE2LCJuYmYiOjE2MDA4NTkzMTYsImp0aSI6IldEenc0QjVhMW5TR2lmaGsiLCJzdWIiOjE3NzcsInBydiI6Ijg3ZTBhZjFlZjlmZDE1ODEyZmRlYzk3MTUzYTE0ZTBiMDQ3NTQ2YWEifQ.h7q54n6y6Fn4h0pa643DnliY_IDY-c3CScLHHxdGrM8";
    // logout = "https://www.google.com";

    let has_error = false;

    if (!logout) {
      this.$vs.notify({
        title: "Erreur",
        text: "Logout Redirect URL Not Provided",
        color: "warning",
        iconPack: "feather",
        icon: "icon-alert-circle",
      });
      has_error = true;
    }
    // if (!this.validURL(logout)) {
    //   this.$vs.notify({
    //     title: "Erreur",
    //     text: "Logout Redirect URL is Not Valide",
    //     color: "warning",
    //     iconPack: "feather",
    //     icon: "icon-alert-circle",
    //   });
    //   has_error = true;
    // }
    if (!token) {
      this.$vs.notify({
        title: "Erreur",
        text: "Token Not Found in URL",
        color: "warning",
        iconPack: "feather",
        icon: "icon-alert-circle",
      });
      has_error = true;
    }
    if (has_error) {
      this.$router.push("/pages/not-authorized");
    } else if (!this.$store.state.auth.is_authenticated) {
      let logoutRedirect = logout;
      try {
        await this.$store.dispatch("auth/loadJwtUser", {
          token,
          logoutRedirect,
        });
        this.$vs.notify({
          color: "success",
          title: "Success",
          text: "Utilisateur chargé avec success",
        });
        this.$store.dispatch("updateUserRole", {
          aclChangeRole: this.$acl.change,
          userRole: "admin",
        });
        
        if (this.$router.currentRoute.path.includes("not-authorized")) {
          //the user were in   not-authorized page then redirect in home page
          this.$router.push("/").catch(() => {});
        } else {
          this.$router.push(this.$router.currentRoute.path).catch(() => {});
        }
      } catch (error) {
        this.$vs.notify({
          title: "Erreur",
          text: error.message,
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
      } finally {
      }
    }
    setTimeout(() => {
      this.$vs.loading.close();
    }, 100);

    // jwt
    //jwt.init()

    const dir = this.$vs.rtl ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);

    window.addEventListener("resize", this.handleWindowResize);
    window.addEventListener("scroll", this.handleScroll);

    // Auth0
    try {
      await this.$auth.renewTokens();
    } catch (e) {
      console.error(e);
    }
  },
  destroyed() {
    window.removeEventListener("resize", this.handleWindowResize);
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>
