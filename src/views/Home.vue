<template>
  <v-container height="100vh">
    <Nav />
    <Section />
  </v-container>
</template>

<script>
import Nav from "../components/Nav";
import Section from "../components/Section";
import firebase from "firebase";
import db from "../main";

export default {
  components: {
    Nav,
    Section
  },
  data() {
    return {
      user: ""
    };
  },
  methods: {
    getUser() {
      this.user = firebase.auth().currentUser.uid;
      console.log(this.user);
    },
    getAllSections() {
      db.collection("Users")
        .doc(this.user)
        .onSnapshot(data => {
          this.$store.commit("allSections", data.data().renovation);
        });
    }
  },
  created() {
    this.getUser();
    this.getAllSections();
  }
};
</script>
