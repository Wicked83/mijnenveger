'use strict';

var app = require('express')(); /* server */
var mongoClient = require('mongodb').MongoClient; /* communicatie mongodb */
var url = "mongodb://localhost:27017/test"; /* !! NIET http !! */
var path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// enable cross domain calls (CORS = cross origin resource sharing)
app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/deelnemers', haalDeelnemerlijstOp);

app.post('/nieuw', nieuweSpelerInvoegen);

function haalDeelnemerlijstOp(request, response) {

    console.log(request.query.naam)
    var naam = request.query.naam;
    var bommen = +request.query.bommen, rijen = +request.query.rijen, kolommen = +request.query.kolommen;
    var query = naam ? { 'naam': naam } : bommen ? { 'bommen': bommen, 'rijen': rijen, 'kolommen': kolommen } : {};
    // var query = { 'naam': naam };

    mongoClient.connect(url, function (error, db) {
        console.log('connected to db');
        var collection = db.collection('mijnenveger');
        collection.find(query)
            .sort({ bommen: -1, kolommen: -1, rijen: -1, tijd: 1 })
            .toArray(function (err, docs) {
                console.log('deelnemerlijst gevonden');
                response.send(JSON.stringify(docs));
                /* var resultaat = JSON.stringify(docs);
                console.log(JSON.parse(resultaat)); */
                db.close;
            })
    })
}

/* 3/config, orden tijd, push & pop */
function nieuweSpelerInvoegen(req, res) {
    // console.log('you are here');
    mongoClient.connect(url, function (err, db) {
        console.log('nieuwe invoer opgestart');
        console.log(req.body.naam)
        var collection = db.collection('mijnenveger');
        collection.insertOne({
            naam: req.body.naam,
            tijd: +req.body.tijd,
            bommen: +req.body.bommen,
            rijen: +req.body.rijen,
            kolommen: +req.body.kolommen,
            // bom: req.body.bom
        }, function (err, r) {
            // console.log("toegevoegd: " + r.insertedCount);
            console.log("res: " + res);
            console.log("tijdelijk toegevoegd");
            /* console.log(req);
            console.log("req.body: " + req.body);
            console.log("req.body.naam: " + req.body.naam); */
            if (!err) {
                /* opvragen & vgl */
                var bommen = +req.body.bommen,
                    rijen = +req.body.rijen,
                    kolommen = +req.body.kolommen;
                var query = { 'bommen': bommen, 'rijen': rijen, 'kolommen': kolommen };
                collection.find(query).sort({ tijd: -1 }).toArray(function (err, docs) {
                    if (!err) {
                        // console.log(docs)
                        if (docs.length > 3) {
                            var melding;
                            if (+req.body.tijd < docs[0].tijd) {
                                melding = "je staat in de top 3";
                            } else {
                                melding = "helaas... je staat niet in de top 3";
                            }
                            collection.deleteOne(docs[0], function (err, r) {
                                if (!err) {
                                    res.end(JSON.stringify({ message: melding }))
                                    // TODO (optioneel): melden bijgevoegd in top3?
                                } else {
                                    res.end(JSON.stringify({ message: "Er is iets foutgelopen bij het aanpassen van de nieuwe top3" }));
                                    console.log('error: ' + err)
                                }
                                db.close();
                            })
                        } else {
                            res.end(JSON.stringify({ message: "je staat in de top3" }));
                        }
                    } else {
                        res.end(JSON.stringify({ message: "Er is iets foutgelopen bij het opvragen van de nieuwe top3" }));
                        console.log('error: ' + err)
                        db.close();
                    }

                });

            } else {
                res.end(JSON.stringify({ message: "Er is iets foutgelopen bij het toevoegen aan de top3" }));
                console.log('error: ' + err);
                db.close();
            }

        })



        // if (tijd < collection.find({}))


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