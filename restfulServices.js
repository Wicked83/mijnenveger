'use strict';

var app = require('express')();     /* server */
var mongoClient = require('mongodb').MongoClient;   /* communicatie mongodb */
var url = "mongodb://localhost:27017/test"; /* !! NIET http !! */
var path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/deelnemers', haalDeelnemerlijstOp);
app.get('/naam', selecteerOpNaam);
app.get('/config', selecteerOpConfig);
app.post('/nieuw', nieuweSpelerInvoegen);

function haalDeelnemerlijstOp(request, response) {
    var naam = 'Joske';
    var bommen = 10, rijen = 10, kolommen = 10;
    var query = naam ? { 'naam': naam } : { 'bommen': bommen, 'rijen': rijen, 'kolommen': kolommen };
    // var query = { 'naam': naam };

    mongoClient.connect(url, function (error, db) {
        console.log('connected to db');
        var collection = db.collection('mijnenveger');
        collection.find(query).toArray(function (err, docs) {
            console.log('deelnemerlijst gevonden');
            response.send(JSON.stringify(docs));
            db.close;
        })
    })
}
function selecteerOpNaam(request, response) {
    console.log('selectie op naam');
}

function selecteerOpConfig(request, response) {
    console.log('selectie op config');
}

/* 3/config, orden tijd, push & pop */
function nieuweSpelerInvoegen(req, res) {
    // console.log('you are here');
    mongoClient.connect(url, function (err, db) {
        console.log('nieuwe invoer opgestart');
        var collection = db.collection('mijnenveger');
        collection.insertOne({
            naam: req.body.naam,
            tijd: req.body.tijd,
            bommen: req.body.bommen,
            rijen: req.body.rijen,
            kolommen: req.body.kolommen
        }, function (err, r) {
            // console.log("toegevoegd: " + r.insertedCount);
            console.log("req: " + req);
            console.log(req);
            console.log("req.body: " + req.body);
            console.log("req.body.naam: " + req.body.naam);
            db.close;
        })
    })
}

app.listen(1111);

/* app.get('/', function (req, res) {
    res.send('Hello world');
})
app.listen(3000) */

/* 
opvragen top > configuratie >> top 3
limit 3
config inwerken > string 'bomxrijxkolom'
config inwerken > string  config (gekregen)
opvragen top 3 > opzoeken op naam
post conffig/speler
 */