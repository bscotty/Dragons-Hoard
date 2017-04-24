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

app.get('/', function (req, res) {
    //const user = req.body.user;
    res.render('home')
});

app.get('/about', function (req, res) {
    res.redirect('/');
});

app.get('/signin', function (req, res) {
    res.render('signin');
});

app.get('/signout', function (req, res) {
    res.render('signout');
});

app.get('/sheets', function (req, res) {
    res.render('sheets');
});

app.post('/sheet/newSheet', function (req, res) {
    console.log('uid', req.body.huid);
    console.log('name', req.body.sheetName);

    if (req.body.sheetName + '' === '') {
        res.render('sheets', {error: 'You must enter a sheet name.'});
        return;
    }

    //firebase.auth().signInWithCustomToken(req.body.hact);

    const key = firebase.database().ref().child('sheets').push().key;
    const sheet = new Sheet();
    sheet.user = req.body.huid;
    sheet.name = req.body.sheetName;
    sheet.level = 1;
    sheet.exp = 0;
    sheet.slug = key;
    sheet.class = 'Adventurer';
    sheet.inspiration = 'false';

    const updates = {};
    updates['/users/' + req.body.huid + '/' + key] = key;
    updates['/sheets/' + key] = {
        user: sheet.user,
        name: sheet.name,
        level: sheet.level,
        exp: sheet.exp,
        slug: key,
        class: sheet.class,
        inspiration: sheet.inspiration,
    };
    firebase.database().ref().update(updates).then(function () {
        res.render('sheet', {sheet: sheet});
    });
});

app.get('/sheet/newSheet', function (req, res) {
    res.render('slug', null);
});

app.get('/sheet/:slug', function (req, res) {
    const slug = req.params.slug;

    let sheet = new Sheet();
    firebase.database().ref('/sheets/' + slug).once('value', function (snapshot) {
        const val = snapshot.val();
        sheet.user = val.user;
        sheet.slug = val.slug;
        sheet.name = val.name;// + ' level ' + snapshot.val().level + ' ' + snapshot.val().class;
        sheet.player = val.player;
        sheet.class = val.class;
        sheet.level = val.level;
        sheet.exp = val.exp;
        sheet.faction = val.faction;
        sheet.race = val.race;
        sheet.subrace = val.subrace;
        sheet.background = val.background;
        sheet.alignment = val.alignment;
        sheet.abilityScores = val.abilityScores;
        sheet.inspiration = val.inspiration;
        sheet.saves = val.saves;
    }).then(function () {
        res.render('slug', {sheet: sheet});
    });
});

app.post('/sheet/:slug', function (req, res) {
    //console.log('req.body', req.body);
    const slug = req.params.slug;

    const sheet = new Sheet();
    sheet.slug = slug;
    sheet.user = req.body.user;
    sheet.name = req.body.name;
    sheet.player = req.body.player;
    sheet.class = req.body.class;
    sheet.level = req.body.level;
    sheet.exp = req.body.exp;

    sheet.faction = req.body.faction;
    sheet.race = req.body.race;
    sheet.subrace = req.body.subrace;
    sheet.background = req.body.background;
    sheet.alignment = req.body.alignment;

    sheet.abilityScores = {
        str: req.body.str,
        dex: req.body.dex,
        con: req.body.con,
        int: req.body.int,
        wis: req.body.wis,
        cha: req.body.cha
    };

    sheet.saves = {
        str: req.body.strSave,
        dex: req.body.dexSave,
        con: req.body.conSave,
        int: req.body.intSave,
        wis: req.body.wisSave,
        cha: req.body.chaSave,
    };

    sheet.inspiration = (req.body.inspiration !== undefined) ? 'true' : 'false';

    //TODO: Find a way to only update the stuff changed, to cut down on traffic
    const update = {};
    update['/sheets/' + slug] = {
        user: sheet.user,
        slug: sheet.slug,
        name: sheet.name,
        player: sheet.player,
        class: sheet.class,
        level: sheet.level,
        exp: sheet.exp,

        faction: sheet.faction,
        race: sheet.race,
        subrace: sheet.subrace,
        background: sheet.background,
        alignment: sheet.alignment,
        abilityScores: {
            str: sheet.abilityScores.str,
            dex: sheet.abilityScores.dex,
            con: sheet.abilityScores.con,
            int: sheet.abilityScores.int,
            wis: sheet.abilityScores.wis,
            cha: sheet.abilityScores.cha
        },
        inspiration: sheet.inspiration,
        saves: {
            str: sheet.saves.str,
            dex: sheet.saves.dex,
            con: sheet.saves.con,
            int: sheet.saves.int,
            wis: sheet.saves.wis,
            cha: sheet.saves.cha,
        }
    };
    // console.log('sheet ability scores', sheet.abilityScores);
    // console.log('update', update);
    // console.log('update ability scores', update['/sheets/' + slug].abilityScores);

    firebase.database().ref().update(update).then(function () {
        res.render('slug', {sheet: sheet});
    });
});

app.post('/delete/:slug', function (req, res) {
    const slug = req.params.slug;
    // Delete the sheet reference from the user's listing in the database.
    firebase.database().ref('/users/' + req.body.uid + '/' + slug).remove(function (err) {
        if (err) {
            console.log('Error deleting sheet reference ' + slug + ' for user', req.body.uid);
        }
    });
    // Also delete the sheet data itself.
    firebase.database().ref('/sheets/' + slug).remove(function (err) {
        if (err) {
            console.log('Error deleting sheet ' + slug, err);
        } else {
            res.redirect('/sheets')
        }
    });
});

app.listen(process.env.PORT || 3000);