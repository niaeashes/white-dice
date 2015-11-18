var dice = require("./dice.js")
  , message = require('./message.js')
  , command = require('./command.js')
  , skill = require('./skill.js')
  , picker = require('./picker.js')
  , dualRoll = require('./dualRoll.js')
  , keyNo = require('./keyNo.js')

function getDateTime() {
  var date = new Date()
  var hour = date.getHours()
  hour = (hour < 10 ? "0" : "") + hour
  var min  = date.getMinutes()
  min = (min < 10 ? "0" : "") + min
  var sec  = date.getSeconds()
  sec = (sec < 10 ? "0" : "") + sec
  var month = date.getMonth() + 1
  month = (month < 10 ? "0" : "") + month
  var day  = date.getDate()
  day = (day < 10 ? "0" : "") + day
  return month + "/" + day + " " + hour + ":" + min
}

var Listen = function(io, socket) {
  this.io = io
  this.socket = socket
 
  socket.on("room", this.room.bind(this))
  socket.on("message", this.message.bind(this))
  socket.on("disconnect", function () {})
}

Listen.prototype.room = function(data) {
  var io = this.io, socket = this.socket
  socket.join('room-'+data.room)
  message.recent('room-'+data.room, 100, function(err, docs) {
    io.sockets
      .to(socket.rooms[0])
      .emit("log", docs.reverse())
  })
}

Listen.prototype.message = function (data) {
  var io = this.io, socket = this.socket
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
    if ( data.msg.isDice() ) {
      for ( var i = 0; i < dice.getRollCount(data.msg).count; i++ ) {
        data.dice.push(dice.roll(dice.getRollCount(data.msg).dice))
      }
    }
    if ( picker.isPicker(data.msg) ) { data = picker.apply(data) }
    if ( skill.isSkill(data.msg) ) { data = skill.apply(data) }
    if ( dualRoll.isDualRoll(data.msg) ) { data = dualRoll.apply(data) }
    if ( keyNo.isKeyNo(data.msg) ) { data = keyNo.apply(data) }
    if ( loggingMsg ) { message.eventEmitter.emit('add', data) }
    if ( typeof data.to == 'function' ) { data.to = data.to(socket, io.sockets.sockets) }
    if ( ! data.secret ) {
      io.sockets.to(data.to).emit("message", data)
    } else { // is Secret
      socket.broadcast.to(data.to).emit("message", data)
      data.secret = false
      io.sockets.to(socket.rooms[0]).emit("message", data)
    }
  } catch ( e ) { console.log("Error: "+e) }
}

module.exports = Listen
