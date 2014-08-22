var http = require("http")
  , socketio = require("socket.io")
  , fs = require("fs")
  , path = require("path")
  , dice = require("./lib/dice.js")
  , mongoose = require('mongoose')
  , message = require('./lib/message.js')
  , command = require('./lib/command.js')
  , skill = require('./lib/skill.js')

mongoose.connect('mongodb://'+(process.env.DBSERVER || 'localhost')+'/'+(process.env.COLLECTION || 'trpg'))

function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return month + "/" + day + " " + hour + ":" + min;
}
 
var server = http.createServer(function(req, res) {
  if ( req.url.match(/^\/room:[0-9]+$/) ) {
    res.writeHead(200, {"Content-Type":"text/html"})
    var header = fs.readFileSync("./header.html", "utf-8")
      , footer = fs.readFileSync("./footer.html", "utf-8")
      , room = "<div id='room' data-url='http://"+req.headers.host+":"+(process.env.APP_PORT || 3000)+"/' data-id='"+req.url.substring(6)+"'></div>"
    res.end(header+room+footer);
    return;
  }

  if ( req.url.match(/^\/?room:[0-9]+\.txt$/) ) {
    var Reader = require('./lib/reader.js').Reader
      , reader = new Reader(1*req.url.substring(6).replace('.txt', ''))
    reader.buildText(function(err, text) {
      if ( err ) {
        response.writeHead(500, {"Content-Type": "text/plain"})
        response.write(err + "\n")
        response.end()
        return
      }
      res.writeHead(200, {"Content-Type": "text/plane; charset=utf-8"})
      res.end(text)
    })
    return
  }

  var filename = path.join(process.cwd(), "assets"+req.url);
  fs.exists(filename, function(exists) {
    if ( ! path.extname(filename).match(/^.(css|js|png|wav)$/) || ! exists ) {
      res.writeHead(404, {"Content-Type": "text/plain"});
      res.write("404 Not Found\n");
      res.end();
      return;
    }
    fs.readFile(filename, function(err, file) {
      if (err) {
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      } 
      res.writeHead(200);
      res.write(file, "binary");
      res.end();
    })
  })
}).listen(process.env.APP_PORT || 3000);
 
var io = socketio.listen(server);

io.sockets.on("connection", function (socket) {

  socket.on("room", function(data) {
    socket.join('room-'+data.room)
  })

  socket.on("log", function(data) {
    message.recent('room-'+data.room, 100, function(err, docs) {
      io.sockets
        .to(socket.rooms[0])
        .emit("log", docs.reverse())
    })
  })

  // メッセージ送信（送信者にも送られる）
  socket.on("message", function (data) {
    var title = command.hasTitle(data.msg)
    if ( title ) {
      io.sockets.to(socket.rooms[1]).emit("title", {title: title[1].trim()})
      return
    }
    var data = {
        author:data.author,
        msg:data.msg,
        dice:[],
        color:data.color,
        datetime:getDateTime(),
        room:socket.rooms[1],
        hash:command.buildHash(socket.rooms[0]),
        secret: false,
        to: socket.rooms[1]}
      , loggingMsg = command.checkLogging(data.msg)
    data = command.applyReplacer(data)
    try {
      if ( dice.hasDice(data.msg) ) {
        for ( var i = 0; i < dice.getRollCount(data.msg).count; i++ ) {
          data.dice.push(dice.roll(dice.getRollCount(data.msg).dice))
        }
      }
      if ( skill.isSkill(data.msg) ) { data = skill.apply(data) }
      if ( loggingMsg ) { message.eventEmitter.emit('add', data) }
      if ( typeof data.to == 'function' ) { data.to = data.to(socket, io.sockets.sockets) }
      if ( ! data.secret ) {
        io.sockets.to(data.to).emit("message", data);
      } else { // is Secret
        socket.broadcast.to(data.to).emit("message", data);
        data.secret = false
        io.sockets.to(socket.rooms[0]).emit("message", data);
      }
    } catch ( e ) { console.log("Error: "+e) }
  });
 
  // 切断したときに送信
  socket.on("disconnect", function () {
//    io.sockets.emit("S_to_C_message", {value:"user disconnected"});
  });
});
