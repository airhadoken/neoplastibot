
"use strict";


// What shall we do to create art?

// Step 1: Create a random name from a set of firsts and lasts:

// Step 2: Hash the name to 

// Step 3: choose a color palette and a style.  (Mondrian, Malevich, minimalism, etc.)

// Step 4: draw random shapes in this style on the canvas.
var Canvas = require("canvas");

var canvas = new Canvas(512, 512);
var context = canvas.getContext("2d");

var boogie = false; //Math.random() < 0.5;
function drawVerticalLine(xoffset, ystart, length) {
  var counter = 0;
  if(boogie) {
    context.fillStyle = "rgb(200, 150, 0)";
    context.fillRect(xoffset, ystart, 7, length);
    counter = Math.floor(Math.random() * length / 2);
    context.fillStyle = "rgb(100, 200, 200)";
    while(counter < length) {
      context.fillRect(xoffset, ystart + counter, 7, 7);
      counter += Math.floor(Math.random() * (length - 7) / 2) + 14;
    }
  } else {
    context.fillStyle = "rgb(0,0,0)";
    context.fillRect(xoffset, ystart, 7, length);
  }}

function drawHorizontalLine(xstart, yoffset, length) {
  var counter = 0;
  if(boogie) {
    context.fillStyle = "rgb(200, 150, 0)";
    context.fillRect(xstart, yoffset, length, 7);
    counter = Math.floor(Math.random() * length / 2);
    context.fillStyle = "rgb(100, 200, 200)";
    while(counter < length) {
      context.fillRect(xstart + counter, yoffset, 7, 7);
      counter += Math.floor(Math.random() * (length - 7) / 2) + 14;
    }
  } else {
    context.fillStyle = "rgb(0,0,0)";
    context.fillRect(xstart, yoffset, length, 7);
  }
}


var writePng = function(canvas, fname){
    var fs, out, stream;
    fs = require('fs');
    fname = fname || __dirname + '/images/randrian.' + new Date().toISOString() + '.png';
    out = fs.createWriteStream(fname);
    stream = canvas.pngStream();
    stream.on('data', function(it){
      return out.write(it);
    });
    return stream.on('end', function(){
      return console.log('saved png to ' + fname);
    });
  };

function asum(arr) {
	return arr.reduce(function(a, b) {
		return a + b;
	}, 0)
}

var xparts = [];
while(asum(xparts) < 512) {
  xparts.push(Math.floor(Math.pow(Math.random() * 14, 2)) + 50);
}

var yparts = xparts.map(function() {
  var yp = [];
  while(asum(yp) < 512) {
    yp.push(Math.floor(Math.pow(Math.random() * 14, 2)) + 50);
  }
  return yp;
});

var fills = [];
var count = Math.floor(Math.random() * yparts.reduce(function(a, yp) { return a + yp.length; }, 0) / 2) + 1;
var fillcolors = ["rgb(255, 255, 0)", "rgb(255, 0, 0)", "rgb(0, 0, 255)"];
var xp, yp, fill;
while(count--) {

  xp = Math.floor(Math.random() * xparts.length);
  yp = Math.floor(Math.random() * yparts[xp].length);
  fill = fillcolors[Math.floor(Math.random() * fillcolors.length)];

  console.log(JSON.stringify([xp, yp, fill]));
  fills.push([xp, yp, fill]);
}

context.fillStyle = "rgb(255,255,255)";
context.fillRect(0, 0, 512, 512);

xparts.reduce(function(offset, xp, i) {
  drawVerticalLine(offset + xp, 0, 512);

  yparts[i].reduce(function(yoffset, yp, i) {
    drawHorizontalLine(offset, yoffset + yp, xp);
    return yoffset + yp;
  }, 0);

  return offset + xp;
}, 0);


fills.forEach(function(fill) {
  var xoff, yoff, w, h;

  context.fillStyle = fill[2];
  xoff = fill[0] && asum(xparts.slice(0, fill[0])) + 7;
  yoff = fill[1] && asum(yparts[fill[0]].slice(0, fill[1])) + 7;
  w = xparts[fill[0]] - (xoff ? 7 : 0);
  h = yparts[fill[0]][fill[1]] - (yoff ? 7 : 0);
  console.log("filling", xoff, yoff, w, h);

  context.fillRect(xoff, yoff, w, h);
});

console.log(context.transform.toString())
writePng(canvas);

// Step 5: 