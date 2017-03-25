var fs = require('fs')
  , path = require('path')

var _ = {}
var parameters = []

function isJson(filename) {
  return filename.match(/\.json$/) != null;
}

var PARAMETER_DIR = path.normalize(__dirname+"/../parameters");
console.log("Parameter Dir: ", PARAMETER_DIR);

fs.readdir(PARAMETER_DIR, function(err, files) {
  if ( err ) {
    return console.error(err);
  }
  var json_files = files.filter(isJson);
  console.log("Parameter files:", json_files.join(', '));
  for ( var i in json_files ) {
    var filename = json_files[i];
    console.log("Try to Load from ", filename);
    fs.readFile( PARAMETER_DIR+'/'+filename, function(err, content) {
      if ( err ) {
        return console.error(err);
      }
      var parameter = JSON.parse(content);
      parameters.push(parameter);
      console.log("Loaded Parameter from ", filename);
    });
  }
})

_.load = function(name) {
  for ( var i in parameters ) {
    if ( parameters[i].names.includes(name) ) {
      return parameters[i];
    }
  }
  return {
    names: [],
    user_id: null,
    parameters: []
  };
}

module.exports = _
