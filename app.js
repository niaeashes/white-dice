require('./lib/string.extend.js')
require('./lib/date.extend.js')

var mongoose = require('mongoose')
  , builder = require('./lib/builder.js')
  , listen = require('./lib/listen')
  , app = require('express')()
  , server = require('http').Server(app)
  , io = require('socket.io')(server)

var mongodb = 'mongodb://'+(process.env.DBSERVER || 'localhost')+
  '/'+(process.env.COLLECTION || 'trpg')
  , port = ( process.env.APP_PORT || 3000 )

console.log("MongoDB: "+mongodb)
mongoose.connect(mongodb)

app.get(/^\/room:[0-9]+$/, builder.roomHtml)
app.get(/^\/room:[0-9]+\.txt$/, builder.roomText)
app.get(/^\/room:[0-9]+\.log\.html$/, builder.logHtml.bind(builder))

app.get(/^\/map:[0-9]+$/, builder.mapHtml)
app.get(/^\/map:[0-9]+/owner$/, builder.mapOwnerHtml)

app.use(require('express').static(__dirname+'/assets'))

io.on("connection", function (socket) { new listen(io, socket)})

console.log("Port: "+port)
server.listen(port)
