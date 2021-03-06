var mongoose = require("mongoose")
var EventEmitter = require('events').EventEmitter
exports.messageSchema = mongoose.Schema({
  author: String,
  msg: String,
  room: String,
  dice: [String],
  color: String,
  updated: { type: Date, default: Date.now },
  datetime: String,
  secret: { type: Boolean, default: false },
  hash: String
})

exports.recent = function (room, limit, callback) {
  exports.model
    .find({room: room})
    .sort('-updated')
    .limit(limit)
    .exec(callback)
}

exports.findAll = function (room, callback) {
  return exports.model
    .find({room: room})
    .sort('+updated')
    .exec(callback)
}

exports.model = mongoose.model('Message', exports.messageSchema)
exports.eventEmitter = new EventEmitter()
exports.eventEmitter.on('add', function(data) {
  var message = new exports.model(data)
  message.save(function(err){
    if ( err ) { console.log("Error: "+err) }
  })
})
