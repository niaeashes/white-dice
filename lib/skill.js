var pattern = /^s([0-9]+)([\+\-]*)/i
  , dice = require('./dice.js')

exports.isSkill = function(msg) {
  return !! pattern.exec(msg)
}

exports.bpDice = function(bp, count, oldFunction) {
  return function(dices, log) {
    var firstRoll = dices.shift()
    console.log(dices)
    for ( var diceFace in dices ) {
      console.log(diceFace)
    }
    return oldFunction(dices, log)
  }
}

exports.resultFunction = function(border, bp, count) {
  return function(dices, log) {
    var resultFace = ""+dices[0]
      , result = 1*dices.shift()
    if ( bp == 'bonus' ) {
      for ( var i in dices ) {
        resultFace += ', '+dices[i]+'x'
        var newResult = 1*(result%10+dices[i]*10)
        if ( newResult < result ) { result = newResult }
      }
      resultFace += ' => ' + result
    }
    if ( bp == 'penalty' ) {
      for ( var i in dices ) {
        resultFace += ', '+dices[i]+'x'
        var newResult = 1*(result%10+dices[i]*10)
        if ( newResult > result ) { result = newResult }
      }
      resultFace += ' => ' + result
    }
    return ("Judge: "+border+"% ... [ 出目 : "+
      resultFace+" "+
      (border >= result ? "Success!" : "Failure..." )+" ]")
  }
}

exports.apply = function(data) {
  var bp = pattern.exec(data.msg)[2]
    , bonus = bp.split('+').length - 1
    , penalty = bp.split('-').length - 1
    , diceCode = 'd100'
    , border = 1*(pattern.exec(data.msg)[1])
    , resultFunction = exports.resultFunction(border, ( bonus > 0 ? 'bonus' : ( penalty > 0 ? 'penalty' : null)), bonus + penalty)
  if ( bonus > 0 ) {
    diceCode += Array(bonus+1).join('+d10')
  } else if ( penalty > 0 ) {
    diceCode += Array(penalty+1).join('+d10')
  }
  data.dice.push(dice.roll(diceCode, resultFunction))
  return data
}
