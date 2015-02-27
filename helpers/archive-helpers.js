var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('http-request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  // call a callback on each url in sites.txt
  fs.readFile(exports.paths.list, function(err, file) {
    var urls = file.toString().split('\n');
    urls.forEach(function(url) {
      callback(url);
    });
  });
};

exports.isUrlInList = function(url, callback){
  fs.readFile(exports.paths.list, function(err, file) {
    if (err) { return err; }
    callback(file.toString().indexOf(url));
  });
};

exports.addUrlToList = function(url){
  // if isUrlInList
  exports.isUrlInList(url, function(index) {
    if (index === -1) {
      // write url to file
      fs.appendFile(exports.paths.list, url + '\n', function(err) {
        if (err) { return err; }
        console.log('saved', url, 'to sites.txt');
        // callback(true);
      })
    }
  })
};

exports.isURLArchived = function(url, callback){
  fs.readdir(exports.paths.archivedSites, function(err, files) {
    if (err) { return err; }
    // console.log('files:', files, 'typeof files:', typeof files);
    callback(files.indexOf(url) !== -1);
  })
};

exports.downloadUrls = function(){
  // readListOfUrls
  exports.readListOfUrls(function(url) {
    exports.isURLArchived(url, function(isArchived) {
      // if not archived
      if (!isArchived) {
        // save the html to archives/sites
        request.get(
          {'url': url},
          exports.paths.archivedSites + '/' + url,
          function(err, res) {
            console.log(res);
          }
        )
      }
    })
  })
};




