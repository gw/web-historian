var path = require('path');
var fs = require("fs");
var URL = require("url");
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');

var paths = archive.paths;

// handlRequest will have to pass in direct filePaths to
// serveAssets function

exports.handleRequest = function (req, res, filePath) {
  console.log("SERVING ", req.url)

  console.log("handleRequest Called");

  if (req.method === "GET") {
    console.log("GET REQUEST RECEIVED")
    httpHelpers.serveAssets(res, filePath);
  }

  if (req.method === "POST") {
    console.log("POST REQUEST RECEIVED");

    req.on("data", function(data) {
      var url = data.toString().split("=")[1];

      archive.isUrlInList(paths.archivedSitesList, url, function(isInArchiveList) {
        console.log("Is in list?: " + isInArchiveList);

        if (isInArchiveList) {
          console.log("ITS IN THE ARCHIVE. SERVE.")

          var archivePath = archive.getArchivedHtml(url);
          httpHelpers.serveAssets(res, archivePath);

        } else {
          //Serve loading page immediately
          //Add to fetch list with a /n if not already there
        }
      });

    })
  }
};
