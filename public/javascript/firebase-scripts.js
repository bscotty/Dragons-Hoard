function onFirebaseSignIn(fn) {
    return firebase.auth().onAuthStateChanged(fn, function (error) {
        console.log('error signing into Firebase', error);
    });
}

function accessDatabase(databaseReference, fn) {
    return firebase.database().ref(databaseReference).once('value', fn);
}