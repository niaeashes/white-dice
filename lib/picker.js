var pattern = /^([0-9]+)P/i
  , dice = require('./dice.js')

exports.isPicker = function(msg) {
  return !! pattern.exec(msg)
}

exports.format = function(dices, log) {
  var number = 0
    , d = dices.join(", ")
  for ( var i in dices ) { ++number }
  var dices = dices.sort().reverse()
    , dice = [dices[0], dices[1]]
  for ( var i in dice ) {
    if ( typeof dice[i] == 'undefined' ) dice[i] = 1
  }
  return "Pickup: "+number+"D6 ( "+d+" ) ... [ 選択: "+dice[0]+"・"+dice[1]+" ]"
}

exports.apply = function(data) {
  var number = 1*(pattern.exec(data.msg)[1])
  data.dice.push(dice.roll(number+"D6", exports.format))
  return data
}
