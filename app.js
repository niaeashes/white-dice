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

app.get(/^\/room:[0-9]+$/, builder.buildHtml)
app.get(/^\/room:[0-9]+\.txt$/, builder.buildText)
app.use(require('express').static(__dirname+'/assets'))

io.on("connection", function (socket) { new listen(io, socket)})

console.log("Port: "+port)
server.listen(port)
