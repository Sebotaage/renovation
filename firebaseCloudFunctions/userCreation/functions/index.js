const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

// Sets user role to user on signup
exports.processSignUp = functions.auth.user().onCreate((user) => {
  const newUser = { uid: user.uid, rooms: [], renovation: {} };
  return db
    .collection('Users')
    .doc(newUser.uid)
    .set(newUser);
});