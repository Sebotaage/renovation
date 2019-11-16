<template>
  <v-container>
    <v-navigation-drawer app v-model="drawer" absolute temporary>
      <v-list-item>
        <v-list-item-avatar>
          <v-img
            src="https://images.unsplash.com/photo-1525909002-1b05e0c869d8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80"
          ></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="headline">Renovation</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item v-for="item in sections" :key="item" link @click="setSection(item)">
          <v-list-item-icon>
            <v-icon color="white" large>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="subtitle-1 capitalize">{{ item }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar height="80px" app>
      <v-app-bar-nav-icon x-large @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="headline"></v-toolbar-title>
      <div class="flex-grow-1"></div>
      <v-btn icon>
        <v-icon large @click="newItem = !newItem">mdi-plus-circle</v-icon>
      </v-btn>
    </v-app-bar>
    <v-dialog v-model="newItem" width="500">
      <v-card>
        <v-card class="pa-5">
          <v-card-title class="justify-center mb-2">New item</v-card-title>
          <v-layout row wrap pa-3>
            <v-flex xs12 pa-3>
              <v-combobox
                v-model="sectionName"
                :items="sections"
                label="Section"
                class="capitalize"
              ></v-combobox>
            </v-flex>
            <v-flex xs12 pa-3>
              <v-text-field label="Item" v-model="itemName"></v-text-field>
            </v-flex>
            <v-flex xs6 pa-3>
              <v-combobox v-model="quantity" :items="numbers" label="Quantity"></v-combobox>
            </v-flex>
            <v-flex xs6 pa-3>
              <v-text-field label="Cost" v-model="itemCost" suffix="kr"></v-text-field>
            </v-flex>
            <v-flex xs6 pa-3>
              <v-btn color="black" @click="addNewItem()">Add</v-btn>
            </v-flex>
          </v-layout>
        </v-card>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import firebase from 'firebase';
import db from '../main';

export default {
  data() {
    return {
      drawer: null,
      items: [],
      newItem: false,
      sectionName: '',
      itemName: '',
      itemCost: '',
      quantity: '',
      sections: [],
      numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      user: '',
    };
  },
  computed: {
    section: function() {
      return this.$store.getters.chosenSection;
    },
    renovations: function() {
      return this.$store.getters.sections;
    },
  },
  methods: {
    getUser() {
      this.user = firebase.auth().currentUser.uid;
    },
    setSection(section) {
      this.$store.commit('setSection', section);
      this.drawer = false;
    },
    async createSection() {
      const section = this.sectionName.toLowerCase();
      const renovation = `renovation.${section}`;
      return new Promise((resolve, reject) => {
        db.collection('Users')
          .doc(this.user)
          .update({
            rooms: firebase.firestore.FieldValue.arrayUnion(section),
            [renovation]: [
              {
                name: this.itemName,
                cost: this.itemCost,
                quantity: this.quantity,
                date: Date.now(),
              },
            ],
          })
          .then(async () => {
            await this.getAllSections();
            resolve();
          })
          .catch(err => {
            console.log(err);
            reject();
          });
      });
    },
    async saveNewItem() {
      const section = this.sectionName;
      if (isNaN(this.itemCost)) {
        alert('Please use numbers only for price');
      } else {
        this.renovations[section].push({
          name: this.itemName,
          cost: this.itemCost,
          quantity: this.quantity,
          date: Date.now(),
        });
        console.log(this.renovations[section]);
        return new Promise((resolve, reject) => {
          db.collection('Users')
            .doc(this.user)
            .set(
              {
                renovation: this.renovations,
              },
              { merge: true },
            )
            .then(response => {
              resolve();
            })
            .catch(err => {
              console.log(err);
              reject(err);
            });
        });
      }
    },
    async addNewItem() {
      if (!this.sectionName || !this.itemName || !this.itemCost || !this.quantity) {
        alert('Please fill out the entire form');
      } else {
        const itemSection = this.sectionName.toLowerCase();
        const doesSectionExist = this.renovations[itemSection];
        const loading = true;
        if (doesSectionExist) {
          await this.saveNewItem();
          this.clearNewItemForm();
        } else {
          await this.createSection();
          this.clearNewItemForm();
        }
      }
    },
    clearNewItemForm() {
      this.itemName = '';
      this.itemCost = '';
      this.quantity = '';
      this.sectionName = '';
      this.newItem = false;
      this.loading = false;
    },
    getSectionList() {
      return new Promise((resolve, reject) => {
        db.collection('Users')
          .doc(firebase.auth().currentUser.uid)
          .onSnapshot(doc => {
            this.sections = doc.data().rooms;
          });
      });
    },
    getAllSections() {
      return new Promise((resolve, reject) => {
        db.collection('Users')
          .doc(this.user)
          .get()
          .then(data => {
            this.$store.commit('allSections', data.data().renovation);
            resolve();
          })
          .catch(err => {
            console.log(err);
            reject(err);
          });
      });
    },
  },
  created() {
    this.getUser();
    this.getSectionList();
  },
};
</script>

<style></style>
