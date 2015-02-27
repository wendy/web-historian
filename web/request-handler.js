var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!
var serverUrl = 'http://localhost:8080/';

exports.handleRequest = function (req, res) {
  // res.end(archive.paths.list);
  /* THESE SERVE UP THE MAIN FILES */
  if (req.url === '/') {
    // IF REQUESTING HOMEPAGE
    if (req.method === 'GET') {
      // IF GETTING HOMEPAGE
      fs.readFile(__dirname + '/public/index.html', function (err, html) {
        if (err) {
          throw err;
        }
        res.writeHeader(200, helpers.headers);
        res.write(html);
        res.end();
      });
    } else if (req.method === 'POST') {
      // IF POSTING TO HOMEPAGE
      var url = '';
      req.on('data', function(chunk) {
        url += chunk;
      });
      req.on('end', function() {
        url = url.slice(4) // url=someurl

        // if archived
        archive.isURLArchived(url, function(isArchived) {
          if (isArchived) {
            // redirect to archived page
            res.writeHead(302, {'Location': serverUrl + url});
            res.end();
            return;
          } else {
            // else if missing from sites
              // add to sites
            // redirect to loading page

            archive.addUrlToList(url);
            res.writeHead(301, {'Location': serverUrl + 'loading.html'})
            res.end();
          }
        });
        // }
      });
    }

  } else if (req.url === '/styles.css') {
    // IF REQUESTING STYLES.CSS
    fs.readFile(__dirname + '/public/styles.css', function (err, css) {
      if (err) {
        throw err;
      }
      res.writeHeader(200, {'Content-Type': 'text/css'});
      res.write(css);
      res.end();
    });
  } else if (req.url === '/node_modules/jquery/dist/jquery.js') {
    // IF REQUESTING JQUERY.JS
    fs.readFile(__dirname + '/..' + req.url, function (err, html) {
      if (err) {
        throw err;
      }
      res.writeHeader(200, {'Content-Type': 'application/javascript'});
      res.write(html);
      res.end();
    });
  } else if (req.url === '/loading.html') {
    // IF REQUESTING LOADING.HTML
    fs.readFile(__dirname + '/public/loading.html', function (err, html) {
      if (err) {
        throw err;
      }
      console.log('requesting loading.html')
      res.writeHeader(200, helpers.headers);
      res.write(html);
      res.end();
    });
  } else {
    // REQUESTING SOME ARCHIVED PAGE
    fs.readFile(archive.paths.archivedSites + req.url, function (err, html) {
      if (err) {
        throw err;
      }
      console.log('requesting:', req.url)
      res.writeHeader(200, helpers.headers);
      res.write(html);
      res.end();
    });
  }



};
