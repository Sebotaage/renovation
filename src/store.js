import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    chosenSection: '',
    sections: {},
  },
  getters: {
    chosenSection: state => state.chosenSection,
    sections: state => state.sections,
  },
  mutations: {
    setSection(state, section) {
      state.chosenSection = section;
    },
    allSections(state, sections) {
      state.sections = sections;
    },
  },
});
