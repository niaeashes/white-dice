var message = require('./message.js')
  , jade = require('jade')

exports.Reader = function(room) {
  this.room = room
}

exports.Reader.prototype = {
  buildText: function(callback) {
    var text = ''
    message.findAll("room-"+this.room, function(err, messages) {
      for ( var i in messages ) {
        var msg = messages[i]
        try {
          text += " "+msg.author+": "+msg.msg+"\r\n"
          if ( msg.dice ) {
            for ( var d = 0; d < msg.dice.length; d++ ) {
              text += "\t"+(1+1*d)+": "+msg.dice[d]+"\r\n"
            }
          }
        } catch (err) {
          console.log(err)
        }
      }
      callback(err, text)
    })
  }

  // Expects to design callback function ... function(err, html)
, buildLogHtml: function(callback) {
    var room = this.room
    message.findAll("room-"+room, function(err, messages) {
      try {
        var html = jade.renderFile('./templates/log.jade', {
          pageTitle: 'Log: Room No.'+room
        , messages: messages
        , md5: require('MD5')})
        callback(null, html)
      } catch (err) { callback(err, null) }
    })
  }
}
