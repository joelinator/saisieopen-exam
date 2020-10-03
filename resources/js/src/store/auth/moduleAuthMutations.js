/*=========================================================================================
  File Name: moduleAuthMutations.js
  Description: Auth Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import axios from "../../http/axios/index.js";

export default {
    SET_BEARER(state, accessToken) {
        axios.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${accessToken}`;
    },

    UPDATE_USER_INFO(state, { user, logoutRedirect }) {
        state.current_user = user;
        state.logoutRedirect = logoutRedirect;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("logoutRedirect", logoutRedirect);
        state.is_authenticated = true;
    },

    USER_LOGOUT(state) {
        localStorage.removeItem("user");
        localStorage.removeItem("logoutRedirect");
        state.current_user = {};
        state.is_authenticated = false;
    }
};
