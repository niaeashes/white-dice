var message = require('./message.js')

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
          text += " "+msg.author+": "+msg.msg+"\n"
          if ( msg.dice ) {
            for ( var d = 0; d < msg.dice.length; d++ ) {
              text += "\t"+(1+1*d)+": "+msg.dice[d]+"\n"
            }
          }
        } catch (err) {
          console.log(err)
        }
      }
      callback(err, text)
    })
  }
}
