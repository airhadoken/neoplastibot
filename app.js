
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
  var fs, child_process, out, stream;
  fs = require('fs');
  child_process = require("child_process");
  fname = fname || __dirname + '/images/randrian.' + new Date().toISOString() + '.png';
  out = fs.createWriteStream(fname);
  stream = canvas.pngStream();
  stream.on('data', function(it){
    return out.write(it);
  });
  return stream.on('end', function(){
    console.log('saved png to ' + fname);

    if(process.argv[2] === "-open") {
      child_process.exec("open " + fname);
    }
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

// var yparts = xparts.map(function() {
//   var yp = [];
//   while(asum(yp) < 512) {
//     yp.push(Math.floor(Math.pow(Math.random() * 14, 2)) + 50);
//   }
//   return yp;
// });

var yparts = [];
while(asum(yparts) < 512) {
  yparts.push(Math.floor(Math.pow(Math.random() * 14, 2)) + 50);
}


var fills = [];
xparts.forEach(function() {
  fills.unshift([]);
  yparts.forEach(function() {
    fills[0].push("rgb(255, 255, 255)");
  });
});
var count = Math.floor(
  Math.random() * xparts.length * yparts.length * (1 - 1 / Math.E)
) + 4;
var fillcolors = ["rgb(255, 255, 0)", "rgb(255, 0, 0)", "rgb(0, 0, 255)", "left", "left", "left", "left", "top", "top", "top", "top"];
var xp, yp, fill;
while(count--) {

  xp = Math.floor(Math.random() * xparts.length);
  yp = Math.floor(Math.random() * yparts.length);
  fill = fillcolors[Math.floor(Math.random() * (xp * yp === 0 ? 3 : fillcolors.length))];

  fills[xp][yp] = fill;
}

context.fillStyle = "rgb(0,0,0)";
context.fillRect(0, 0, 512, 512);

// xparts.reduce(function(offset, xp, i) {
//   drawVerticalLine(offset + xp, 0, 512);

//   yparts[i].reduce(function(yoffset, yp, i) {
//     drawHorizontalLine(offset, yoffset + yp, xp);
//     return yoffset + yp;
//   }, 0);

//   return offset + xp;
// }, 0);
fills[0].forEach(function(fill, i) {
  console.log(fills.map(function(f) { return f[i]; }).join(", "));
});


fills.forEach(function(xfills, i) {
  xfills.forEach(function(xyfill, j) {
    var xoff = asum(xparts.slice(0, i)), 
        yoff = asum(yparts.slice(0, j)), 
        w = xparts[i], 
        h = yparts[j], ref_i = i, ref_j = j;

    while(xyfill === "left" || xyfill === "top") {
      if(xyfill === "left") {
        xyfill = fills[ref_i -= 1][ref_j];
        xoff -= xparts[ref_i];
        w += xparts[ref_i];
      }
      if(xyfill === "top") {
        xyfill = fills[ref_i][ref_j -= 1];
        yoff -= yparts[ref_j];
        h += yparts[ref_j];
      }
    }
    context.fillStyle = xyfill;    

    xoff += (ref_i ? 7 : 0);
    yoff += (ref_j ? 7 : 0);
    w -= (ref_i ? 7 : 0);
    h -= (ref_j ? 7 : 0);

    context.fillRect(xoff, yoff, w, h);
  });
});

writePng(canvas);

// Step 5: 