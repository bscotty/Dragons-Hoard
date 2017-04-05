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
    //messagingSenderId: "685172894729"
};
firebase.initializeApp(config);
//const firebaseDatabase = firebase.database();

// Ensure we get our schemas from db.js
const db = require('./db.js');
const app = express();

// 1. Express-Static
app.use(express.static(path.join(__dirname, 'public')));
// 2. HBS Views
app.set('views', __dirname + '/views/');
app.set('view engine', 'hbs');
// 3. Middleware
app.use(bp.urlencoded({extended: false}));

// 4. Routing

app.get('/', function(req, res) {
    const user = req.body.user;
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

app.get('/sheets/newSheet', function(req, res) {
   res.render('sheet', null);
});

app.get('/sheets/:slug', function(req, res) {
    const slug = req.body.slug;
    // TODO: Get the correct sheet from the database using the slug.
    let sheet = {};
    res.render('sheet', sheet);
});

app.listen(3000);