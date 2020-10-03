/*=========================================================================================
  File Name: moduleCalendarState.js
  Description: Calendar Module State
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/
// import mutations from './moduleDataListMutations.js'
// import actions from './moduleDataListActions.js'
// import getters from './moduleDataListGetters.js'
const _ = require('lodash')




export default {
    products: [],
    pays: [],
    classechapters: [],
    classechapters_has_set: false,
    epreuves: [],
    types: [],
    etablissement: [],
    currentExams: {},
    exams_has_set: false,
    pays_has_set: false,
    types_has_set: false,
    etablissement_has_set: false,
    subjects_has_set: false,
    classes_has_set: false,
    chapitres_has_set: false,
    notions_has_set: false,
    subjects: [],
    classes: [],
    chapitres: [],
    notions: [],
    sessions: [
        '2015',
        '2016',
        '2017',
        '2018',
        '2019'
    ],
    schoolyears: [
        '2015/2016',
        '2016/2017',
        '2017/2018',
        '2018/2019',
        '2019/2020'
    ],

}
