/*=========================================================================================
  File Name: moduleCalendarActions.js
  Description: Calendar Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

// import axios from '@/axios.js'
import axios from "@/axios";

export default {
    addItem({ commit }, item) {
        return new Promise((resolve, reject) => {
            axios
                .post("/api/create-exams", item)
                .then(response => {
                    // commit('ADD_ITEM', Object.assign(item, { id: response.data.id }))
                    console.log(
                        "response.data.exams ==>> ",
                        response.data.exams
                    );
                    commit("ADD_ITEM", response.data.exams);
                    resolve(response);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },
    fetchClasseChapters({ commit }, classe) {
        return new Promise((resolve, reject) => {
            axios
                .get(`/api/classechapters/${classe}`)
                .then(response => {
                    commit("SET_CHAPTERS", response.data.data);
                    resolve(response);
                })
                .catch(err => {
                    reject(err.response.data);
                    reject(err.response.data);
                });
        });
    },
    fetchPaysList({ commit }) {
        return new Promise((resolve, reject) => {
            axios
                .get("/api/pays")
                .then(response => {
                    commit("SET_COUNTRIES", response.data.data);

                    resolve(response);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },

    createPays({ commit }, params) {
        return new Promise((resolve, reject) => {
            axios
                .post("/api/createPays", params)
                .then(response => {
                    console.log("response ===>> ", response.data.data);
                    commit("UPDATE_COUNTRIES", params);

                    resolve(response);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },
    createEtablissement({ commit }, params) {
        return new Promise((resolve, reject) => {
            axios
                .post("/api/etablissement", params)

                .then(response => {
                    console.log("response ===>> ", response.data.data);
                    commit("CREATE_ETABLISSEMENT", response.data.etablissement);

                    resolve(response);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },
    updateEtablissement({ commit }, { id, newName, newRegion }) {
        return new Promise((resolve, reject) => {
            console.log("data is ===> ", id, newName, newRegion);
            axios
                .put(`/api/etablissement/${id}`, {
                    name: newName,
                    region: newRegion
                })

                .then(response => {
                    commit("UPDATE_ETABLISSEMENT", response.data.etablissement);

                    resolve(response);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },
    fetchEtablissement({ commit }) {
        return new Promise((resolve, reject) => {
            axios
                .get("/api/etablissement")
                .then(response => {
                    commit("GET_SCHOOL", response.data.data);

                    resolve(response);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },
    removeEtablissement({ commit }, params) {
        return new Promise((resolve, reject) => {
            axios
                .delete(`/api/etablissement/${params}`)
                .then(response => {
                    console.log(
                        "responseetablissement ===>> ",
                        response.data.data
                    );
                    commit("REMOVE_SCHOOL", params);

                    resolve(response);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },
    removePays({ commit }, params) {
        return new Promise((resolve, reject) => {
            axios
                .delete(`/api/deletePays/${params}`)
                .then(response => {
                    commit("REMOVE_PAYS", params);
                    resolve(response);
                })
                .catch(err => {
                    reject(err.response.data);
                    commit("ADD_PAYS_BACK", params);
                });
        });
    },
    fetchTypesList({ commit }) {
        return new Promise((resolve, reject) => {
            axios
                .get("/api/types")
                .then(response => {
                    commit("SET_TYPES", response.data.data);

                    resolve(response);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },
    fetchMatieresList({ commit }) {
        return new Promise((resolve, reject) => {
            axios
                .get("/api/matieres")
                .then(response => {
                    commit("SET_MATIERES", response.data.data);

                    resolve(response);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },

    async createMatiere({ commit }, { name, description }) {
        return new Promise((resolve, reject) => {
            axios
                .post(`/api/matieres`, {
                    name: name,
                    description: description
                })
                .then(res => {
                    commit("ADD_MATIERE", res.data.data);
                    resolve(res);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },

    async updateMatiere({ commit }, { id, name, description }) {
        return new Promise((resolve, reject) => {
            axios
                .put(`/api/matieres/${id}`, {
                    name: name,
                    description: description
                })
                .then(res => {
                    commit("UPDATE_MATIERE", res.data.data);
                    resolve(res);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },

    async deleteMatiere({ commit }, { id }) {
        return new Promise((resolve, reject) => {
            axios
                .delete(`/api/matieres/${id}`)
                .then(res => {
                    commit("REMOVE_MATIERE", id);
                    resolve(res);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },

    async createRegion({ commit }, region) {
        return new Promise((resolve, reject) => {
            axios
                .post(`/api/regions`, {
                    ...region
                })
                .then(res => {
                    var data_to_store = {
                        id_pays: region.id_pays,
                        ...res.data.data
                    };
                    commit("ADD_REGION", data_to_store);
                    resolve(res);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },

    async deleteRegion({ commit }, region) {
        return new Promise((resolve, reject) => {
            axios
                .delete(`/api/regions/${region.id}`)
                .then(res => {
                    commit("REMOVE_REGION", region);
                    resolve(res);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },

    async updateRegion({ commit }, region) {
        return new Promise((resolve, reject) => {
            axios
                .put(`/api/regions/${region.id}`, {
                    ...region
                })
                .then(res => {
                    var data_to_store = {
                        id_pays: region.id_pays,
                        old_id_pays: region.old_id_pays,
                        ...res.data.data
                    };
                    commit("UPDATE_REGION", data_to_store);
                    resolve(res);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },

    fetchClassesList({ commit }) {
        return new Promise((resolve, reject) => {
            axios
                .get("/api/classes")
                .then(response => {
                    commit("SET_CLASSES", response.data.data);

                    resolve(response);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },
    async createClasse({ commit }, { name, description }) {
        return new Promise((resolve, reject) => {
            axios
                .post(`/api/classes`, {
                    name: name,
                    description: description
                })
                .then(res => {
                    commit("ADD_CLASS", res.data.data);
                    resolve(res);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },

    async updateClasse({ commit }, { id, name }) {
        return new Promise((resolve, reject) => {
            axios
                .put(`/api/classes/${id}`, {
                    name: name
                })
                .then(res => {
                    commit("UPDATE_CLASS", res.data.data);
                    resolve(res);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },

    async deleteClasse({ commit }, { id }) {
        return new Promise((resolve, reject) => {
            axios
                .delete(`/api/classes/${id}`)
                .then(res => {
                    commit("REMOVE_CLASS", id);
                    resolve(res);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },

    ///CHAPITRE CRUD

    fetchChapitresList({ commit }) {
        return new Promise((resolve, reject) => {
            axios
                .get("/api/chapitre")
                .then(response => {
                    commit("SET_CHAPITRES", response.data.data);

                    resolve(response);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },

    async createChapitre({ commit }, { title, description, classes }) {
        return new Promise((resolve, reject) => {
            axios
                .post(`/api/chapitre`, {
                    title: title,
                    description: description,
                    classes: classes
                })
                .then(res => {
                    commit("ADD_CHAPITRE", res.data.data);
                    resolve(res);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },

    async updateChapitre({ commit }, { id, title, description, classes }) {
        return new Promise((resolve, reject) => {
            axios
                .put(`/api/chapitre/${id}`, {
                    title: title,
                    description: description,
                    classes: classes
                })
                .then(res => {
                    commit("UPDATE_CHAPITRE", res.data.data);
                    resolve(res);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },

    async deleteChapitre({ commit }, { id }) {
        return new Promise((resolve, reject) => {
            axios
                .delete(`/api/chapitre/${id}`)
                .then(res => {
                    commit("REMOVE_CHAPITRE", id);
                    resolve(res);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },

    ///NOTIONS CRUD

    fetchNotionsList({ commit }) {
        return new Promise((resolve, reject) => {
            axios
                .get("/api/notions")
                .then(response => {
                    commit("SET_NOTIONS", response.data.data);
                    resolve(response);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },

    async createNotion({ commit }, { title, description, chapitres }) {
        return new Promise((resolve, reject) => {
            axios
                .post(`/api/notions`, {
                    title: title,
                    description: description,
                    chapitres: chapitres
                })
                .then(res => {
                    commit("ADD_NOTION", res.data.data);
                    resolve(res);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },

    async updateNotion({ commit }, { id, title, description, chapitres }) {
        return new Promise((resolve, reject) => {
            axios
                .put(`/api/notions/${id}`, {
                    title: title,
                    description: description,
                    chapitres: chapitres
                })
                .then(res => {
                    commit("UPDATE_NOTION", res.data.notion);
                    resolve(res);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },

    async deleteNotion({ commit }, { id }) {
        return new Promise((resolve, reject) => {
            axios
                .delete(`/api/notions/${id}`)
                .then(res => {
                    commit("REMOVE_NOTION", id);
                    resolve(res);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },

    /**
     * --Exams--
     */
    fetchExamsItem({ commit }, examsId) {
        commit("SET_EXAM", examsId);
        // return new Promise((resolve, reject) => {
        //   axios.get('/api/data-list/exam', { examsId })
        //     .then((response) => {

        //       commit('SET_EXAM', response.data)
        //
        //       resolve(response)
        //     })
        //     .catch((err) => { reject(err.response.data) })
        // })
    },
    fetchExamsListItems({ commit }) {
        return new Promise((resolve, reject) => {
            axios
                .get("/api/exams")
                .then(response => {
                    commit("SET_EXAMS", response.data);
                    resolve(response);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
        // return new Promise((resolve, reject) => {
        //   axios.get('/api/data-list/exams')
        //     .then((response) => {
        //       commit('SET_EXAMS', response.data)
        //       resolve(response)
        //     })
        //     .catch((err) => { reject(err.response.data) })
        // })
    },
    // fetchEventLabels({ commit }) {
    //   return new Promise((resolve, reject) => {
    //     axios.get("/api/apps/calendar/labels")
    //       .then((response) => {
    //         commit('SET_LABELS', response.data)
    //         resolve(response)
    //       })
    //       .catch((err) => { reject(err.response.data) })
    //   })
    // },
    updateExams({ commit }, item) {
        return new Promise((resolve, reject) => {
            axios
                .post(`/api/exam`, item)
                .then(response => {
                    commit("UPDATE_EXAMS", response.data.exams);
                    resolve(response);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },
    removeExams({ commit }, itemId) {
        return new Promise((resolve, reject) => {
            axios
                .delete(`/api/data-list/exams/${itemId}`)
                .then(response => {
                    commit("REMOVE_EXAMS", itemId);
                    resolve(response);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },
    // eventDragged({ commit }, payload) {
    //   return new Promise((resolve, reject) => {
    //     axios.post(`/api/apps/calendar/event/dragged/${payload.event.id}`, {payload: payload})
    //       .then((response) => {

    //         // Convert Date String to Date Object
    //         let event = response.data
    //         event.startDate = new Date(event.startDate)
    //         event.endDate = new Date(event.endDate)

    //         commit('UPDATE_EVENT', event)
    //         resolve(response)
    //       })
    //       .catch((err) => { reject(err.response.data) })
    //   })
    // },

    // ####################################################=========================

    /**
     * PRODUCTS
     */
    fetchDataListItems({ commit }) {
        return new Promise((resolve, reject) => {
            axios
                .get("/api/data-list/products")
                .then(response => {
                    commit("SET_PRODUCTS", response.data);
                    resolve(response);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },
    // fetchEventLabels({ commit }) {
    //   return new Promise((resolve, reject) => {
    //     axios.get("/api/apps/calendar/labels")
    //       .then((response) => {
    //         commit('SET_LABELS', response.data)
    //         resolve(response)
    //       })
    //       .catch((err) => { reject(err.response.data) })
    //   })
    // },
    updateItem({ commit }, item) {
        return new Promise((resolve, reject) => {
            axios
                .post(`/api/data-list/products/${item.id}`, {
                    item
                })
                .then(response => {
                    commit("UPDATE_PRODUCT", response.data);
                    resolve(response);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    },
    removeItem({ commit }, itemId) {
        return new Promise((resolve, reject) => {
            axios
                .delete(`/api/data-list/products/${itemId}`)
                .then(response => {
                    commit("REMOVE_ITEM", itemId);
                    resolve(response);
                })
                .catch(err => {
                    reject(err.response.data);
                });
        });
    }
    // eventDragged({ commit }, payload) {
    //   return new Promise((resolve, reject) => {
    //     axios.post(`/api/apps/calendar/event/dragged/${payload.event.id}`, {payload: payload})
    //       .then((response) => {

    //         // Convert Date String to Date Object
    //         let event = response.data
    //         event.startDate = new Date(event.startDate)
    //         event.endDate = new Date(event.endDate)

    //         commit('UPDATE_EVENT', event)
    //         resolve(response)
    //       })
    //       .catch((err) => { reject(err.response.data) })
    //   })
    // },
};
