'use strict';

var sketchOptions = {
  cellSize : 25,
  bgColor : '#8c969e',
  canvasId: 'defaultCanvas0',
  defaultGameSize: 10,
  defaultBombNum: 10, 
};

var game;
var icons;

function preload() {
  icons = {
    blank: loadImage('http://i.imgur.com/HM1e3Tbb.jpg'),
    pressed: loadImage('http://i.imgur.com/bGT8xGEb.jpg'),
    exposedBomb: loadImage('http://i.imgur.com/pTJ8Swhb.jpg'),
    explodedBomb: loadImage('http://i.imgur.com/UFmXprFb.jpg'),
    flag: loadImage('http://i.imgur.com/nLPvW15b.jpg'),
    bombs: [
      loadImage('http://i.imgur.com/Flqdqi1b.jpg'), // 0
      loadImage('http://i.imgur.com/bM8oExob.jpg'), // 1
      loadImage('http://i.imgur.com/bQKSbqYb.jpg'), // 2
      loadImage('http://i.imgur.com/5jNcEeVb.jpg'), // 3
      loadImage('http://i.imgur.com/BnxjHgHb.jpg'), // 4
      loadImage('http://i.imgur.com/RaFrMYcb.jpg'), // 5
      loadImage('http://i.imgur.com/GlwQOy0b.jpg'), // 6
      loadImage('http://i.imgur.com/8ngsVa8b.jpg'), // 7
      loadImage('http://i.imgur.com/lJ8P1wab.jpg')  // 8
    ]
  };
}

function setup() {
  var myCanvas = createCanvas(250, 250);
  myCanvas.parent('#canvas');
  game = new Board(sketchOptions.defaultGameSize, sketchOptions.defaultBombNum, sketchOptions.cellSize, true);
}

// For non p5.js users, this methods gets called over and over again
function draw() {
  game.display();
}

function mouseClicked(event) {
  if (event.target.id !== sketchOptions.canvasId || game.state !== 'live') {
    game.unPressCell();
    return;
  }

  var x = _.floor(mouseX/sketchOptions.cellSize);
  var y = _.floor(mouseY/sketchOptions.cellSize);

  game.clickedCell(x, y);

  // Prevent browser default behavior
  return false;
}

function mousePressed(event) {
  if (event.target.id !== sketchOptions.canvasId || game.state !== 'live') {
    return;
  }

  var x = _.floor(mouseX/sketchOptions.cellSize);
  var y = _.floor(mouseY/sketchOptions.cellSize);

  if (mouseButton === 'left') {
    game.pressCell(x, y);
  } else {
    game.toggleFlag(x, y);
  }

  // Prevent browser default behavior
  return false;
}

function resize(size) {
  resizeCanvas(size * sketchOptions.cellSize, size * sketchOptions.cellSize);
}