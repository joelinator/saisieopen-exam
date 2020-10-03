import Vue from "vue";
import { AclInstaller, AclCreate, AclRule } from "vue-acl";
import router from "@/router";

Vue.use(AclInstaller);

let initialRole = "none";

// const userInfo = JSON.parse(localStorage.getItem('user'));
// console.log("user info acl >>" ,  userInfo);
// if (userInfo && userInfo.role) initialRole = userInfo.role

export default new AclCreate({
    initial: initialRole,
    notfound: "/pages/not-authorized",
    router,
    acceptLocalRules: true,
    globalRules: {
        admin: new AclRule("admin").generate(),
        editor: new AclRule("editor").or("admin").generate(),
        auth: new AclRule("none").generate()
    }
});
