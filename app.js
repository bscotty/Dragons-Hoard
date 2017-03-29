// app.js
const express = require('express');
const path = require('path');
const bp = require('body-parser');
const mongoose = require('mongoose');

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

app.get('/login', function(req, res) {
    res.render('login');
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