<template>
  <v-container v-if="section">
    <v-card
      class="pa-3 mb-2"
      style="width: 80%; margin: 0 auto; border-radius: 10px;"
      color="black"
    >
      <v-card-title class="headline justify-center capitalize">{{ section }}</v-card-title>
    </v-card>
    <p class="title text-center">{{ cost }}kr</p>

    <v-timeline>
      <v-timeline-item v-for="(item, index) in items" :key="index" color="black" large>
        <template v-slot:opposite>
          <span>{{ item.date }}</span>
        </template>
        <v-card @click="editItem(index)" class="elevation-2 text-center">
          <v-card-title class="subtitle-1 justify-center">{{ item.name }}</v-card-title>
          <v-card-text>{{ item.cost }}kr</v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
    <v-dialog v-model="edit" max-width="300">
      <v-card class="pa-4">
        <v-layout row wrap pa-3>
          <v-flex xs12 pa-3>
            <v-text-field
              @change="saveEdit()"
              label="Item"
              v-model="itemToEdit.name"
            ></v-text-field>
          </v-flex>
          <v-flex xs6 pa-3>
            <v-combobox
              @change="saveEdit()"
              v-model="itemToEdit.quantity"
              :items="numbers"
              label="Quantity"
            ></v-combobox>
          </v-flex>
          <v-flex xs6 pa-3>
            <v-text-field
              @change="saveEdit()"
              label="Cost"
              v-model="itemToEdit.cost"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 pa-3 text-center>
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn text dark v-on="on">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="deleteItem()">
                  <v-list-item-title>Delete item</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-flex>
        </v-layout>
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
      items: [],
      edit: false,
      editIndex: '',
      itemToEdit: {},
      numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      user: '',
      cost: '',
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
  watch: {
    section: function() {
      this.renderSection();
    },
    renovations: function() {
      this.renderSection();
    },
  },
  methods: {
    getUser() {
      this.user = firebase.auth().currentUser.uid;
    },
    deleteItem() {
      const index = this.editIndex;
      const section = `renovation.${this.section}`;
      this.items.splice(index, 1);
      return new Promise((resolve, reject) => {
        db.collection('Users')
          .doc(this.user)
          .update({
            [section]: this.items,
          })
          .then(response => {
            this.edit = false;
            resolve();
          })
          .catch(err => {
            console.log(err);
            reject(err);
          });
      });
    },
    saveEdit() {
      const index = this.index;
      const section = `renovation.${this.section}`;
      this.items[index] = this.itemToEdit;
      console.log(this.itemToEdit);
      return new Promise((resolve, reject) => {
        db.collection('Users')
          .doc(this.user)
          .update({
            [section]: this.items,
          })
          .then(response => {
            resolve();
          })
          .catch(err => {
            console.log(err);
            reject(err);
          });
      });
    },
    editItem(index) {
      this.edit = true;
      this.editIndex = index;
      this.itemToEdit = this.items[index];
      console.log(this.itemToEdit);
    },
    renderSection() {
      const section = this.section;
      let totalCost = 0;
      if (this.renovations[section] && this.renovations[section].length > 0) {
        this.items = this.renovations[section];
        this.items.forEach(item => {
          item.date = new Date(item.date).toLocaleDateString('en-US');
          totalCost = totalCost + Number(item.cost);
        });
        this.cost = totalCost;
      }
    },
  },
  created() {
    this.getUser();
  },
};
</script>
