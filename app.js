
// What shall we do to create art?

// Step 1: Create a random name from a set of firsts and lasts:

// Step 2: Hash the name to 

// Step 3: choose a color palette and a style.  (Mondrian, Malevich, minimalism, etc.)

// Step 4: draw random shapes in this style on the canvas.
var Canvas = require("canvas");

var fs = require('fs');
var canvas = new Canvas(512, 512);
var context = canvas.getContext("2d");
var config = require("./config.json");
var Twit = require("twit");
var express = require("express");
var app = express();

var consumer_key = config.consumer_key;
var consumer_secret = config.consumer_secret;
var access_token = config.access_token; 
var access_token_secret = config.access_token_secret;


var boogie = false; //Math.random() < 0.5;
var title;
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
  var child_process, out, stream;
  child_process = require("child_process");
  fname = fname || __dirname + '/images/randrian.' + new Date().toISOString() + '.png';
  out = fs.createWriteStream(fname);
  stream = canvas.pngStream();
  stream.on('data', function(it){
    return out.write(it);
  });
  return stream.on('end', function(){
    console.log('saved png to ' + fname);

    if(~process.argv.indexOf("-open")) {
      child_process.exec("open " + fname);
    }
  });
};

function asum(arr) {
	return arr.reduce(function(a, b) {
		return a + b;
	}, 0)
}

function createCanvas() {
  var xparts = [];
  while(asum(xparts) < 512) {
    xparts.push(Math.floor(Math.pow(Math.random() * 12, 2)) + 50);
  }
  var yparts = [];
  while(asum(yparts) < 512) {
    yparts.push(Math.floor(Math.pow(Math.random() * 12, 2)) + 50);
  }

  var fills = [];
  xparts.forEach(function(xp, x) {
    fills.unshift([]);
    yparts.forEach(function(yp, y) {
      fills[0].push({
        fill: "white",
        w: 1,
        h: 1, 
        wmax: fills.length - (x === xparts.length - 1 ? 1 : 0), //x direction being done in reverse
        hmax: yparts.length - (y === 0 ? 1 : y) 
      });
    });
  });

  var count = Math.floor(
    Math.random() * (xparts.length + yparts.length)
  ) + 4;
  var fillcolors = ["yellow", "red", "blue"];
  var xp, yp, fill;
  while(count--) {

    xp = Math.floor(Math.random() * xparts.length);
    yp = Math.floor(Math.random() * yparts.length);
    fill = fillcolors[Math.floor(Math.random() * (xp * yp === 0 ? 3 : fillcolors.length))];

    fills[xp][yp].fill = fill;
  }

  var p, xd, yd, sanity;
  xp = 0;
  yp = 0;
  count = Math.floor(
    Math.random() * xparts.length * yparts.length * (1 - 1 / Math.E)
  ) + 10;
  while(count--) {

    p = Math.floor(Math.random() * xparts.length * yparts.length) + 1;
    sanity = xparts.length * yparts.length;
    xd = 0;
    yd = 0;

    // choose a random start point.
    while(p-- && sanity) {
      xp++;
      if(xp >= xparts.length) {
        xp = 0;
        yp = (yp + 1) % yparts.length;
      }
      if(p < 1
         && (fills[xp][yp].fill == null
             || fills[xp][yp].w > 1
             || fills[xp][yp].h > 1
             || (fills[xp][yp].wmax < 2 && fills[xp][yp].hmax < 2)
             )) {
        ++p; // large rectangle found. Maybe don't count this iteration.  
        // But also don't let it loop forever if we run out of blocks to play with.
        --sanity;
      }
    }

    // If sanity is 0, The Elder Ones got to this iteration.
    // (tried too many times to pass through large blocks. This could mean the whole grid is now large blocks,
    //  and that's OK, but then it's hard to find more).
    if(sanity > 0) {
      do {
        xd = Math.floor(Math.pow(Math.random(), 3) * fills[xp][yp].wmax + 1);
        yd = Math.floor(Math.pow(Math.random(), 3) * fills[xp][yp].hmax + 1);
      } while(xd < 2 && yd < 2); // Recalculate if we didn't grow the rectangle.

      // null out the following stuff in the blocks; adjust max width/height to preceding blocks
      (function() {
        var i, j, k;
        // first pass: check for wmax/ymax differences in rows and columns if block is 2x2 or greater.
        for(i = xp + 1; i < xp + xd; i++) {
          for(j = yp + 1; j < yp + yd; j++) {
            if(fills[i][j].fill == null || fills[i][j].w > 1 || fills[i][j].h > 1) {
              //special case -- another row/column in our block has a lesser wmax/hmax than our origin
              if(xd > yd) {
                xd = i - xp;
              } else {
                yd = j - yp;
              }
            }
          }
        }

        for(i = 0; i < xp + xd; i++) {
          for(j = 0; j < yp + yd; j++) {
            if(i >= xp && j >= yp) {
              if(i > xp || j > yp) { // don't null the upper left corner
                fills[i][j].fill = null;
              }
            } else if(i >= xp) { // vertically above the new block
              fills[i][j].hmax = Math.min(yp - j, fills[i][j].hmax);
            } else if(j >= yp) { // horizontally left of the new block
              fills[i][j].wmax = Math.min(xp - i, fills[i][j].wmax);
            }
          }
        }
      })();
      fills[xp][yp].w = xd;
      fills[xp][yp].h = yd;
    }

  }

  context.fillStyle = "rgb(0,0,0)";
  context.fillRect(0, 0, 512, 512);

  var colorsused = {};
  fills.forEach(function(xfills, i) {
    xfills.forEach(function(xyfill, j) {
      var xoff = asum(xparts.slice(0, i)), 
          yoff = asum(yparts.slice(0, j)), 
          w = xparts[i], 
          h = yparts[j], ref_i = i, ref_j = j;

      if(!xyfill.fill)
        return;

      context.fillStyle = xyfill.fill;
      if(xoff < 505 && yoff < 505) {
        // can't see these.        
        colorsused[xyfill.fill] = true;
      }

      while(++ref_i < i + xyfill.w) {
        w += xparts[ref_i];
      }
      while(++ref_j < j + xyfill.h) {
        h += yparts[ref_j];
      }

      xoff += (i ? 7 : 0);
      yoff += (j ? 7 : 0);
      w -= (i ? 7 : 0);
      h -= (j ? 7 : 0);

      context.fillRect(xoff, yoff, w, h);
    });
  });

  function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
  }

  title = "Composition in ";
  delete colorsused["white"];
  colorsused = Object.keys(colorsused).sort();
  switch(colorsused.length) {
    case 0:
    title += "White";
    break;
    case 1:
    title += capitalize(colorsused[0]);
    break;
    case 2:
    title += capitalize(colorsused[0]) + " and " + capitalize(colorsused[1]);
    break;
    default:
    title += "Red, Blue, and Yellow";
  }

  return canvas;
}


// If deployed to Nodejitsu, it requires an application to respond to HTTP requests
// If you're running locally or on Openshift you don't need this, or express at all.
if(!~process.argv.indexOf("-debug")) {
  app.get('/', function(req, res){
    canvas.toDataURL('image/png', function(err, str){
      res.send(
        '<h1><a href="https://twitter.com/neoplastibot">@neoplastibot</a></h1>'
        + '<h2>last image: "' + title + '"</h2><img src="' + str + '">'
      );
    });
  });
  try {
    app.listen(process.env.PORT || 8080);
  } catch(e) {
    console.error(e);
    //continue app. just forget about serving web
  }
  // insert your twitter app info here
  var T = new Twit({
    consumer_key:     consumer_key, 
    consumer_secret:  consumer_secret,
    access_token:     access_token,
    access_token_secret: access_token_secret
  });

  function makeTweet(){  // first we must post the media to Twitter
    T.post('media/upload', { "media": createCanvas().toBuffer().toString('base64') }, function (err, data, response) {

      if(err) {
        console.error(err);
        if(~process.argv.indexOf("-once")) {
          process.exit(0);
        }
      }

      // now we can reference the media and post a tweet (media will attach to the tweet)
      var mediaIdStr = data.media_id_string;
      var params = { status: title, media_ids: [mediaIdStr] };

      T.post('statuses/update', params, function (err, data, response) {
        console.log(data);
        if(~process.argv.indexOf("-once")) {
          process.exit(0);
        }
      });
    });
  }

  //makeTweet();
  createCanvas();
  if(!~process.argv.indexOf("-once")) {
    setInterval(makeTweet, config.interval || 86400000);
  }

} else {  
  writePng(createCanvas());
  console.log(title);
}


// Step 5: 