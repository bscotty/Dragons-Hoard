// app.js
const express = require('express');
const path = require('path');
const bp = require('body-parser');
const mongoose = require('mongoose');
const firebase = require('firebase');
//const firebaseui = require('firebaseui');

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
//const firebaseDatabase = firebase.database();

// Ensure we get our schemas from db.js
const db = require('./db.js');
const app = express();

const Sheet = mongoose.model('Sheet');

// 1. Express-Static
app.use(express.static(path.join(__dirname, 'public')));
// 2. HBS Views
app.set('views', __dirname + '/views/');
app.set('view engine', 'hbs');
// 3. Middleware
app.use(bp.urlencoded({extended: false}));

// 4. Routing

app.get('/', function(req, res) {
    //const user = req.body.user;
    res.render('home')
});

app.get('/about', function (req, res) {
    res.redirect('/');
});

app.get('/signin', function(req, res) {
    res.render('signin');
});

app.get('/signout', function(req, res) {
    res.render('signout');
});

app.get('/sheets', function(req, res) {
    res.render('sheets');
});

app.post('/sheet/newSheet', function (req, res) {
    console.log('uid', req.body.huid);
    //console.log('access token', req.body.hact);
    console.log('name', req.body.sheetName);

    if(req.body.sheetName + '' === '') {
        res.render('sheets', {error: 'You must enter a sheet name.'});
        return;
    }

    //firebase.auth().signInWithCustomToken(req.body.hact);

    const key = firebase.database().ref().child('sheets').push().key;
    const sheet = new Sheet();
    sheet.name = req.body.sheetName;
    sheet.level = 1;
    sheet.slug = key;
    sheet.class = 'Adventurer';

    const updates = {};
    updates['/users/' + req.body.huid + '/' + key] = key;
    updates['/sheets/' + key] = {name: sheet.name, level: sheet.level, slug: key, class: sheet.class};
    firebase.database().ref().update(updates).then(function() {
        res.render('sheet', {sheet: sheet});
    });
});

app.get('/sheet/newSheet', function(req, res) {
   res.render('slug', null);
});

app.get('/sheet/:slug', function(req, res) {
    const slug = req.params.slug;

    let sheet = new Sheet();
    firebase.database().ref('/sheets/' + slug).once('value', function(snapshot) {
        sheet.name = snapshot.val().name;// + ' level ' + snapshot.val().level + ' ' + snapshot.val().class;
        sheet.level = snapshot.val().level;
        sheet.slug = snapshot.val().slug;
        sheet.class = snapshot.val().class;
    }).then(function() {
        res.render('slug', {sheet: sheet});
    });

});

app.listen(3000);