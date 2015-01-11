var pattern = /^([0-9]+)P((?:\+|\-)[0-9]+)?/i
  , dice = require('./dice.js')

exports.isPicker = function(msg) {
  return !! pattern.exec(msg)
}

exports.format = function(suffix) {
  if ( typeof suffix == 'undefined' ) suffix = 0
  var suffix = 1*suffix
  return function(dices, log) {
    var number = 0
      , d = dices.join(", ")
    for ( var i in dices ) { ++number }
    var dices = dices.sort().reverse()
      , dice = [dices[0], dices[1]]
    for ( var i in dice ) {
      if ( typeof dice[i] == 'undefined' ) dice[i] = 1
    }
    return "Pickup: "+number+"D6 ( "+d+" ) ... [ 選択: "+dice[0]+"・"+dice[1]+(suffix > 0 ? " + "+suffix : "")+" = "
      +(1*dice[0]+1*dice[1]+suffix)+" ]"
  }
}

exports.apply = function(data) {
  var number = 1*(pattern.exec(data.msg)[1])
    , suffix = pattern.exec(data.msg)[2]
  data.dice.push(dice.roll(number+"D6", exports.format(suffix)))
  return data
}
