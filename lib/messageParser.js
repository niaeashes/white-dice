var dice = require("./dice.js")
  , command = require('./command.js')
  , skill = require('./skill.js')
  , picker = require('./picker.js')
  , dualRoll = require('./dualRoll.js')
  , dx = require('./dx.js')
  , tatari = require('./tatari.js')
  , utakaze = require('./utakaze.js')
  , keyNo = require('./keyNo.js')

module.exports = function(data, callback) {
  data.dice = []
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
    if ( dx.isMatch(data.msg) ) { data = dx.apply(data) }
    if ( tatari.isMatch(data.msg) ) { data = tatari.apply(data) }
    if ( utakaze.isMatch(data.msg) ) { data = utakaze.apply(data) }
    if ( keyNo.isKeyNo(data.msg) ) { data = keyNo.apply(data) }
    if ( typeof callback == 'function' ) { callback(data) }
  } catch ( e ) { console.log("Error: "+e) }

  return data;
}
