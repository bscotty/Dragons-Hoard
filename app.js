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
        sheet.skills = val.skills;
    }).then(function () {
        res.render('slug', {sheet: sheet});
    });
});

app.post('/sheet/:slug', function (req, res) {
    console.log('req.body', req.body);
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
        str: (req.body.strSave) ? req.body.strSave : 'none',
        dex: (req.body.dexSave) ? req.body.dexSave : 'none',
        con: (req.body.conSave) ? req.body.conSave : 'none',
        int: (req.body.intSave) ? req.body.intSave : 'none',
        wis: (req.body.wisSave) ? req.body.wisSave : 'none',
        cha: (req.body.chaSave) ? req.body.chaSave : 'none',
    };

    sheet.skills = {
        acrobatics: (req.body.acrobatics) ? req.body.acrobatics : 'none',
        animalHandling: (req.body.animalHandling) ? req.body.animalHandling : 'none',
        arcana: (req.body.arcana) ? req.body.arcana : 'none',
        athletics: (req.body.athletics) ? req.body.athletics : 'none',
        deception: (req.body.deception) ? req.body.deception : 'none',
        history: (req.body.history) ? req.body.history : 'none',
        insight: (req.body.insight) ? req.body.insight : 'none',
        intimidation: (req.body.intimidation) ? req.body.intimidation : 'none',
        investigation: (req.body.investigation) ? req.body.investigation : 'none',
        medicine: (req.body.medicine) ? req.body.medicine : 'none',
        nature: (req.body.nature) ? req.body.nature : 'none',
        perception: (req.body.perception) ? req.body.perception : 'none',
        performance: (req.body.performance) ? req.body.performance : 'none',
        persuasion: (req.body.persuasion) ? req.body.persuasion : 'none',
        religion: (req.body.religion) ? req.body.religion : 'none',
        sleightOfHand: (req.body.sleightOfHand) ? req.body.sleightOfHand : 'none',
        stealth: (req.body.stealth) ? req.body.stealth : 'none',
        survival: (req.body.survival) ? req.body.survival : 'none',
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
        },
        skills: {
            acrobatics: sheet.skills.acrobatics,
            animalHandling: sheet.skills.animalHandling,
            arcana: sheet.skills.arcana,
            athletics: sheet.skills.athletics,
            deception: sheet.skills.deception,
            history: sheet.skills.history,
            insight: sheet.skills.insight,
            intimidation: sheet.skills.intimidation,
            investigation: sheet.skills.investigation,
            medicine: sheet.skills.medicine,
            nature: sheet.skills.nature,
            perception: sheet.skills.perception,
            performance: sheet.skills.performance,
            persuasion: sheet.skills.persuasion,
            religion: sheet.skills.religion,
            sleightOfHand: sheet.skills.sleightOfHand,
            stealth: sheet.skills.stealth,
            survival: sheet.skills.survival,
        },
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