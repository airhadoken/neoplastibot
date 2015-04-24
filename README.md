# Neoplsticism Bot

This bot creates a 512x512 image in the style of Mondrian paintings (orthogonal black lines and primary color rectangles on a white field).  An live example of this can be found at [@neoplastibot on Twitter](https://twitter.com/neoplastibot)

## Requirements:

* Node.js
* Node-Canvas
* Express
* Twit
* MongoDB-node

## Usage

`node app.js` to start the service.

Flags:
* `-dry-run` don't Tweet the canvas image. (Useful with `-server` to debug title generation)
* `-server` serve the last created image and title as a web page.  Default port is 8080 but can be changed by setting the `PORT` environment variable
* `-once` run once and exit instead of setting intervals to run canvas creation and Tweeting.
* `-debug` Instead of tweeting the image, create an image file and save it in images/, then exit (implies `-once`)
* `-open` Used with `-debug`; open the image file immediately after creating.

## Configuration

See [config.json](blob/master/config.json) for instructions for setting up Twitter API keys and the MongoDB url to save statistics about what has been created.

## License

This software is copyright (C) 2015 Bradley Momberger and released under the MIT License.  Full license text may be found at [http://opensource.org/licenses/MIT](http://opensource.org/licenses/MIT).

Reproduction of the above (C) notice and link is sufficient to meet the standards set forth when redistributing, as are appropriate modifications to the above notice if using this software in whole or in part in another software project.

Portions of this software regarding canvas setup are (C) 2015 [Paul O'leary McCann](https://github.com/polm), license currently unknown.