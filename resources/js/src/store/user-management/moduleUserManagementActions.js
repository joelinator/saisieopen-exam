/*=========================================================================================
  File Name: moduleCalendarActions.js
  Description: Calendar Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import axios from "@/axios.js";
// import axios from 'axios'

export default {
    // addItem({ commit }, item) {
    //   return new Promise((resolve, reject) => {
    //     axios.post("/api/data-list/products/", {item: item})
    //       .then((response) => {
    //         commit('ADD_ITEM', Object.assign(item, {id: response.data.id}))
    //         resolve(response)
    //       })
    //       .catch((error) => { reject(error) })
    //   })
    // },
    delPerm({ commit }, params) {
        return new Promise((resolve, reject) => {
            axios
                .delete(`/api/permissions/delete/${params}`, params)
                .then(response => {
                    commit("DELETE_PERMISSION", params);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    addPerm({ commit }, params) {
        return new Promise((resolve, reject) => {
            axios
                .post("/api/permissions/add", params)
                .then(response => {
                    commit("ADD_PERMISSIONS", response.data.data);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    updatePerm({ commit }, params) {
        return new Promise((resolve, reject) => {
            axios
                .put(`/api/permissions/update/${params.id}`, params)
                .then(response => {
                    commit("UPDATE_PERMISSION", response.data.data);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    addRole({ commit }, params) {
        console.log(params);
        return new Promise((resolve, reject) => {
            axios
                .post("/api/roles/add", params)
                .then(response => {
                    commit("ADD_ROLE", params);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    updateRole({ commit }, params) {
        return new Promise((resolve, reject) => {
            axios
                .put(`/api/roles/update/${params.id}`, params)
                .then(response => {
                    commit("UPDATE_ROLE", response.data.data);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    delRole({ commit }, params) {
        return new Promise((resolve, reject) => {
            axios
                .delete(`/api/roles/delete/${params}`)
                .then(response => {
                    commit("DELETE_ROLE", params);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    fetchRoutes({ commit }) {
        return new Promise((resolve, reject) => {
            axios
                .get("/api/auth/getRoutes")
                .then(response => {
                    commit("SET_ROUTES", response.data);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    fetchPermissions({ commit }) {
        return new Promise((resolve, reject) => {
            axios
                .get("/api/permissions/get")
                .then(response => {
                    commit("SET_PERMISSIONS", response.data);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    fetchRoles({ commit }) {
        return new Promise((resolve, reject) => {
            axios
                .get("/api/roles/get")
                .then(response => {
                    commit("SET_ROLES", response.data);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    addUser({ commit }, params) {
        console.log(params);
        return new Promise((resolve, reject) => {
            axios
                .post("/api/users/add ", params)
                .then(response => {
                    commit("ADD_USER", response.data.data);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    fetchUser({ commit }, userId) {
        commit("SET_USER", userId);
        // return new Promise((resolve, reject) => {
        //   axios.get(`/api/user-management/users/${userId}`)
        //     .then((response) => {
        //       resolve(response)
        //     })
        //     .catch((error) => { reject(error) })
        // })
    },
    fetchUsers({ commit }) {
        return new Promise((resolve, reject) => {
            axios
                .get("/api/users/filter/plus_deleted")
                .then(response => {
                    commit("SET_USERS", response.data);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    blockUser({ commit }, params) {
        return new Promise((resolve, reject) => {
            axios
                .delete(`/api/users/solf_delete/${params}`)
                .then(response => {
                    commit("BLOCK_USER", response.data.data);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    RestoreUser({ commit }, params) {
        return new Promise((resolve, reject) => {
            axios
                .get(`/api/users/restore/${params}`)
                .then(response => {
                    commit("RESTORE_USER", response.data.data);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    deleteUser({ commit }, params) {
        return new Promise((resolve, reject) => {
            axios
                .delete(`/api/users/hard_delete/${params}`)
                .then(response => {
                    commit("DELETE_USER", params);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    removeRecord({ commit }, userId) {
        return new Promise((resolve, reject) => {
            axios
                .delete(`/api/user-management/users/${userId}`)
                .then(response => {
                    commit("REMOVE_RECORD", userId);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    updateUser({ commit }, user) {
        return new Promise((resolve, reject) => {
            axios
                .put(`/api/users/update/${user.id}`, user)
                .then(response => {
                    commit("UPDATE_USER", response.data);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    updateUserRoles({ commit }, user) {
        return new Promise((resolve, reject) => {
            axios
                .put(`/api/user_roles/update/${user.id}`, {
                    role: user.role.map(elt => elt.id)
                })
                .then(response => {
                    commit("UPDATE_USER_ROLES", response.data.user);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    updateUserPassword({ commit }, user) {
        return new Promise((resolve, reject) => {
            axios
                .post(`/api/users/reset_password/${user.id}`, {
                    password: user.password
                })
                .then(response => {
                    
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
};
