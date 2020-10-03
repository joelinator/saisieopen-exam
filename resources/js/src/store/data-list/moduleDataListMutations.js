/*=========================================================================================
  File Name: moduleCalendarMutations.js
  Description: Calendar Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

export default {
    ADD_ITEM(state, item) {
        // state.products.unshift(item)
        state.epreuves.unshift(item);
        state.currentExams = item;
    },
    /**
     * EXAMS
     */
    SET_EXAMS(state, epreuves) {
        if (!state.exams_has_set) {
            state.epreuves = epreuves;
            state.exams_has_set = true;
        }
    },
    SET_CHAPTERS(state, classechapters) {
        state.classechapters = classechapters;
    },
    ADD_PAYS_BACK(state, pays) {
        state.pays.unshift(pays);
    },
    SET_COUNTRIES(state, pays) {
        state.pays = pays;
        state.pays_has_set = true;
    },
    GET_SCHOOL(state, etablissement) {
        state.etablissement = etablissement;
        state.etablissement_has_set = true;
    },
    CREATE_ETABLISSEMENT(state, etablissement) {
        state.etablissement.unshift(etablissement);
    },
    UPDATE_ETABLISSEMENT(state, school) {
        const schoolIndex = state.etablissement.findIndex(
            p => p.id === school.id
        );
        Object.assign(state.etablissement[schoolIndex], school);
    },
    REMOVE_SCHOOL(state, itemId) {
        const ItemIndex = state.etablissement.findIndex(p => p.id === itemId);
        state.etablissement.splice(ItemIndex, 1);
    },
    UPDATE_COUNTRIES(state, pays) {
        state.pays.push(pays);
    },
    REMOVE_PAYS(state, itemId) {
        const ItemIndex = state.pays.findIndex(p => p.id === itemId);
        state.pays.splice(ItemIndex, 1);
    },

    SET_TYPES(state, types) {
        state.types = types;
        state.types_has_set = true;
    },

    //MATIERES CRUD
    SET_MATIERES(state, matieres) {
        state.subjects = matieres;

        state.subjects_has_set = true;
    },
    ADD_MATIERE(state, newMatiere) {
        state.subjects.push(newMatiere);
    },
    REMOVE_MATIERE(state, id) {
        try {
            const index = state.subjects.findIndex(subj => subj.id === id);
            state.subjects.splice(index, 1);
        } catch (err) {}
    },
    UPDATE_MATIERE(state, newData) {
        try {
            const index = state.subjects.findIndex(
                subj => subj.id === newData.id
            );
            state.subjects[index] = newData;
        } catch (err) {}
    },

    ADD_REGION(state, newData) {
        try {
            const { id_pays, ...other } = newData;
            var selected_pays = state.pays.filter(elt => elt.id == id_pays);
            if (selected_pays.length) {
                selected_pays[0].regions.unshift(other);
            }
            //state.regions.push(newMatiere);
        } catch (err) {}
    },

    REMOVE_REGION(state, region) {
        try {
            //const { id_pays, ...other } = newData;
            var selected_pays = state.pays.filter(
                elt => elt.id == region.id_pays
            );
            if (selected_pays.length) {
                var pays = selected_pays[0];
                const index = pays.regions.findIndex(
                    elt => elt.id === region.id
                );
                pays.regions.splice(index, 1);
            }
        } catch (err) {}
    },

    UPDATE_REGION(state, newData) {
        try {
            const { id_pays, old_id_pays, ...other } = newData;
            //look if pays has changed
            if (id_pays !== old_id_pays) {
                var old_selected_pays = state.pays.find(
                    elt => elt.id == old_id_pays
                );
                //remove from old pays
                if (old_selected_pays) {
                    const index = old_selected_pays.regions.findIndex(
                        elt => elt.id == newData.id
                    );
                    old_selected_pays.regions.splice(index, 1);
                }

                //push in new_one

                var new_selected_pays = state.pays.find(
                    elt => elt.id == id_pays
                );

                if (new_selected_pays) {
                    new_selected_pays.regions.unshift(other);
                }
            } else {
                //in the same pays
                var selected_pays = state.pays.find(
                    elt => elt.id === id_pays
                );

                //then replace

                if (selected_pays) {
                    const index = selected_pays.regions.findIndex(
                        elt => elt.id == newData.id
                    );
                    selected_pays.regions.splice(index , 1 , other);
                }
            }
        } catch (err) {}
    },

    //CLASSES CRUD
    SET_CLASSES(state, classes) {
        state.classes = classes;
        state.classes_has_set = true;
    },
    ADD_CLASS(state, newClass) {
        state.classes.push(newClass);
    },
    UPDATE_CLASS(state, newData) {
        try {
            const index = state.classes.findIndex(cls => cls.id === newData.id);
            state.classes[index] = newData;
        } catch (err) {}
    },

    REMOVE_CLASS(state, classId) {
        try {
            const index = state.classes.findIndex(cls => cls.id === classId);
            state.classes.splice(index, 1);
        } catch (err) {
            console.error(
                "could not find index of given class// at delete class mutation"
            );
        }
    },

    //CHAPITRES CRUD
    SET_CHAPITRES(state, chapitres) {
        state.chapitres = chapitres;
        state.chapitres_has_set = true;
    },
    ADD_CHAPITRE(state, newChapitre) {
        state.chapitres.push(newChapitre);
    },
    UPDATE_CHAPITRE(state, newData) {
        try {
            const index = state.chapitres.findIndex(
                chp => chp.id === newData.id
            );
            Object.assign(state.chapitres[index], newData);
        } catch (err) {}
    },

    REMOVE_CHAPITRE(state, chapId) {
        try {
            const index = state.chapitres.findIndex(chp => chp.id === chapId);
            state.chapitres.splice(index, 1);
        } catch (err) {
            console.error(
                "could not find index of given class// at delete chapitre mutation"
            );
        }
    },

    //NOTIONS CRUD
    SET_NOTIONS(state, notions) {
        state.notions = notions;
        state.notions_has_set = true;
    },
    ADD_NOTION(state, newNotion) {
        state.notions.push(newNotion);
    },
    UPDATE_NOTION(state, newData) {
        const notionIndex = state.notions.findIndex(p => p.id === newData.id);
        Object.assign(state.notions[notionIndex], newData);
    },

    REMOVE_NOTION(state, notionId) {
        try {
            const index = state.notions.findIndex(
                notion => notion.id === notionId
            );
            state.notions.splice(index, 1);
        } catch (err) {
            console.error(
                "could not find index of given class// at delete chapitre mutation"
            );
        }
    },

    SET_EXAM(state, itemId) {
        state.currentExams = state.epreuves.find(
            exam => exam.body.id == itemId
        );
        //
        // state.currentExams = exams
    },
    // SET_LABELS(state, labels) {
    //   state.eventLabels = labels
    // },
    UPDATE_EXAMS(state, exam) {
        const examIndex = state.epreuves.findIndex(
            p => p.body.id == exam.body.id
        );
        Object.assign(state.epreuves[examIndex], exam);
    },
    REMOVE_EXAMS(state, itemId) {
        const ItemIndex = state.epreuves.findIndex(p => p.id === itemId);
        state.epreuves.splice(ItemIndex, 1);
    },
    /**
     * PRODUCTS
     */
    SET_PRODUCTS(state, products) {
        state.products = products;
    },
    // SET_LABELS(state, labels) {
    //   state.eventLabels = labels
    // },
    UPDATE_PRODUCT(state, product) {
        const productIndex = state.products.findIndex(p => p.id === product.id);
        Object.assign(state.products[productIndex], product);
    },
    REMOVE_ITEM(state, itemId) {
        const ItemIndex = state.products.findIndex(p => p.id === itemId);
        state.products.splice(ItemIndex, 1);
    }
};
