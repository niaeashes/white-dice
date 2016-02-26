var pattern = /^([0-9]+)t([0-9]+)?/i
  , dice = require('./dice.js')

exports.isMatch = function(msg) {
  return !! pattern.exec(msg)
}

exports.resultFunction = function(border) {
  return function(dices, log) {
    var resultFace = dices.join(", ")
      , damageCount = 0
    dices.forEach(function(d) {
      if ( border >= d ) { damageCount += 1 }
    })
    return ("祟語: "+resultFace+" [ Damage : "+damageCount+" ]")
  }
}

exports.apply = function(data) {
  var count = 1*pattern.exec(data.msg)[1]
    , border = pattern.exec(data.msg)[2]
  if ( border == undefined ) { border = 3 }
  border = parseInt(border)
  var resultFunction = this.resultFunction(border);
  data.dice.push(dice.roll(count+"d6", resultFunction))
  return data
}
