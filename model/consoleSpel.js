'use strict';

var modSpel = require('./modelSpel.js');
var spel = new modSpel("Joske", 7, 7, 7);

function SpelConsole(spelObj) {
  this.spel = spelObj;
}

SpelConsole.prototype.toonBord = function () {
  var bord = '';
  this.spel.bord.forEach(rij => {
    rij.forEach(vak => {
      // bord += vak.bom ? ' *' : ' .';
      bord += ' ' + vak.bomBuren;
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

cbord.toonBord();
