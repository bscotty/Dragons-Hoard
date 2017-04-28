const firebase = require('firebase');

// Setup Firebase
const config = {
    apiKey: "AIzaSyA14Rj6hDSZ0PxJeFhTK_ZR5fo-NVKvCQ4",
    authDomain: "dragons-hoard.firebaseapp.com",
    databaseURL: "https://dragons-hoard.firebaseio.com",
    projectId: "dragons-hoard",
    storageBucket: "dragons-hoard.appspot.com",
    messagingSenderId: "685172894729"
};
firebase.initializeApp(config);

function accessDatabase(databaseReference, fn) {
    return firebase.database().ref(databaseReference).once('value', fn);
}

function getKeyAtChild(databaseReferenceChild) {
    return firebase.database().ref().child(databaseReferenceChild).push().key;
}

function removeFromDatabase(databaseReference, fn) {
    return firebase.database().ref(databaseReference).remove(fn);
}

function updateDatabase(updateObj) {
    return firebase.database().ref().update(updateObj);
}

module.exports = {
    accessDatabase: accessDatabase,
    getKeyAtChild: getKeyAtChild,
    //onFirebaseSignIn: onFirebaseSignIn,
    removeFromDatabase: removeFromDatabase,
    updateDatabase: updateDatabase,
};