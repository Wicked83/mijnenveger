'use strict';

var modSpel = require('./moduleSpel.js');
var modVakje = require('./moduleVakje.js');

var spel = new modSpel("Joske", 7, 7, 7);
console.log(spel);
console.log(spel.timer());

var vak = new modVakje();

var test1111 = spel.spelersnaam
console.log(test1111)
spel.initialiseren()
spel.verdelingBommen()