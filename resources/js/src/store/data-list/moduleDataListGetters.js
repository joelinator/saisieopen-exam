/*=========================================================================================
  File Name: moduleCalendarGetters.js
  Description: Calendar Module Getters
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

// getters
// const getters = {
//   getTests: state => state.tests,
//   getSubjects: state => state.subjects,
//   getClasses: state => state.classes,
//   getTest1() {
//
//     return 201
//   },
//   getTest2() {
//
//     return 202
//   },
//   getTest: state => id => {
//     const result = _.find(state.tests, t => t.id == id)
//     return result
//   },
//   getSubject: state => (value) => {
//     return _.find(state.subjects, s => s.value === value).label
//   },
//   getClass: state => (value) => {
//     return _.find(state.classes, c => c.value === value).label
//   },
// }

export default {
  // getItem: state => (productId) => state.products.find((product) => product.id == productId),

  getTest: state => itemId => {
    return state.epreuves.find((item) => item.id === itemId)
  },

  subjects: state => state.subjects,
  classes: state => state.classes,
  chapitres: state => state.chapitres,
  notions: state => state.notions,
  countries: state => state.pays,
  sessions: state => state.sessions,
  current_exams: state => state.currentExams,
  schoolyears: state => state.schoolyears,
  types: state => state.types,
  notionschap: state => state.classechapters,
}
