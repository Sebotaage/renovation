<template>
  <div style="width: 80%; margin: 0 auto; margin-top:10%;">
    <v-card class="borderRadius">
      <v-card-title primary-title>
        <div style="margin: 0 auto; padding: 10px 0 0 0;">
          <h3 class="headline">Renovation</h3>
        </div>
      </v-card-title>
      <v-card-text style>
        <!--  <v-form ref="form" class="fields">
          <v-flex xs12>
            <v-text-field v-model="email" label="E-mail" :rules="emailRules" required></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              type="password"
              v-model="password"
              label="Password"
              :rules="passwordRules"
              required
              style="margin-bottom: 10px;"
            ></v-text-field>
          </v-flex>
        </v-form>
        <v-flex xs12 style="display: flex;">
          <v-btn @click="login()" color="success" class="login" round>Log In</v-btn>
        </v-flex>
         <v-flex xs12 style="display: flex;">
          <span class="login" style="text-align: center; font-size: 12px; margin-top:5px;">
            No account?
            <router-link to="/signup">Sign up here</router-link>
          </span>
        </v-flex>-->
        <v-flex xs12 style="display: flex;">
          <v-btn @click="socialLogin()" color="black" class="login" rounded>Log In with Google</v-btn>
        </v-flex>
        <!-- <v-flex xs12 style="display: flex;">
          <v-btn
            @click="fbLogin()"
            color="blue"
            class="login"
            round
            style="margin-top: 5px"
          >Or Facebook</v-btn>
        </v-flex>-->
      </v-card-text>
    </v-card>
    <v-snackbar color="error" v-model="snackbar" top :timeout="3500" vertical style>
      {{ msg }}
      <v-btn color="black" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  data() {
    return {
      email: "",
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+/.test(v) || "E-mail must be valid"
      ],
      password: "",
      passwordRules: [v => !!v || "Password is required"],
      snackbar: false,
      msg: "Please enter a valid email and a password"
    };
  },
  methods: {
    login() {
      if (this.$refs.form.validate()) {
        firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(
            user => {
              this.$router.replace("home");
            },
            err => {
              alert("Oops. " + err.message);
            }
          );
      } else {
        this.snackbar = true;
      }
    },
    socialLogin() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          this.$router.replace("home");
        })
        .catch(err => {
          alert("Oops. " + err.message);
        });
    },
    fbLogin() {
      const provider = new firebase.auth.FacebookAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          this.$router.replace("home");
        })
        .catch(err => {
          alert("Oops. " + err.message);
        });
    }
  }
};
</script>

<style scoped>
.borderRadius {
  margin-top: 5%;
}
.fields {
  width: 90%;
  margin: 0 auto;
}
.login {
  margin: 0 auto;
  width: 200px;
}
.or {
  margin: 0 auto;
  padding: 10px;
}
</style>
