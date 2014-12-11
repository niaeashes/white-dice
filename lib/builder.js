var fs = require('fs')
  , Reader = require('./reader.js').Reader
  , jade = require('jade')

module.exports = {
  roomHtml: function (req, res) {
    try {
      var html = jade.renderFile('./templates/room.jade', {
        room_url: req.headers.host+":"+(process.env.APP_PORT || 3000)+'/'
      , room_id: req.url.substring(6)})
      res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"})
      res.end(html)
    } catch (err) { buildErr(req, res, err) }
  }

, roomText: function (req, res) {
    var reader = new Reader(1*req.url.substring(6).replace('.txt', ''))
    reader.buildText(function(err, text) {
      if ( err ) { return this.buildErr(req, res, err) }
      res.writeHead(200, {"Content-Type": "text/plane; charset=utf-8"})
      res.end(text)
    })
  }

, logHtml: function (req, res) {
    var reader = new Reader(1*req.url.substring(6).replace('.log.html', ''))
      , buildErr = this.buildErr.bind(this)
    reader.buildLogHtml(function(err, html){
      if ( err ) { return buildErr(req, res, err) }
      res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"})
      res.end(html)
    })
  }

, mapHtml: function (req, res) {
    try {
      res.writeHead(200, {"Content-Type":"text/html; charset=utf-8"})
      var header = fs.readFileSync("./map.header.html", "utf-8")
        , footer = fs.readFileSync("./map.footer.html", "utf-8")
        , room = "<div id='map' data-url='http://"+
          req.headers.host+":"+(process.env.APP_PORT || 3000)+
          "/' data-id='"+req.url.substring(6)+"'></div>"
      res.end(header+room+footer);
    } catch (err) { buildErr(req, res, err) }
  }

, buildErr: function(req, res, err) {
    res.writeHead(500, {"Content-Type": "text/plain"})
    console.log(err)
    res.end("Internal Server Error\n")
  }
}
