import Vue from 'vue';
import firebase from 'firebase';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import store from './store';

const firebaseConfig = {};

firebase.initializeApp(firebaseConfig);
export default firebase.firestore();

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  store,
  created: () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        router.replace('/home').catch(err => {
          console.log(err);
        });
      } else {
        router.replace('/login').catch(err => {
          console.log(err);
        });
      }
    });
  },
  render(h) {
    return h(App);
  },
}).$mount('#app');
