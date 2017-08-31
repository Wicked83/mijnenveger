'use strict';
var toetsenbord = require('readline-sync');
var modSpel = require('./modelSpel.js');
var spel = new modSpel("Joske");

function SpelConsole(spelObj) {
  this.spel = spelObj;
}

SpelConsole.prototype.toonBord = function () {
  var bord = '';
  this.spel.bord.forEach(rij => {
    rij.forEach(vak => {
      bord += vak.omgedraaid ? ' ' + vak.bomBuren : ' .';
    });
    bord += '\n';
  });
  console.log(bord);
};
SpelConsole.prototype.toonBommen = function () {
  var bord = '';
  this.spel.bord.forEach(rij => {
    rij.forEach(vak => {
      bord += vak.bom ? ' *' : ' .';
    });
    bord += '\n';
  });
  console.log(bord);
};



SpelConsole.prototype.omdraaien = function (rij, kolom) {
  if (this.spel.bord[rij][kolom].omdraaien()){

  }
};

var cbord = new SpelConsole(spel);
// var knopType = toetsenbord.question('Kies R voor rechte en L voor linke knop: ');
var rij = +toetsenbord.question('Voer het rijnummer in: ');
var kolom = +toetsenbord.question('Voer het kolomnummer in: ');


cbord.spel.vakjeOmdraaien(rij, kolom);

cbord.toonBord();
var check = toetsenbord.question('Wil je de bommen zien?(y/n): ');
if (check == 'y') {
  cbord.toonBommen();
}
