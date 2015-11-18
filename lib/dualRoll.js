var pattern = /^dr([0-9]+)([\+\-]*)(?:c([0-9]+))?/i
  , dice = require('./dice.js')

exports.isDualRoll = function(msg) {
  return !! pattern.exec(msg)
}

exports.bpDice = function(bp, count, oldFunction) {
  return function(dices, log) {
    var firstRoll = dices.shift()
    return oldFunction(dices, log)
  }
}

exports.resultFunction = function(parsedMsg) {
  return function(dices, log) {
    var resultFace = ""+dices[0]
      , result = 1*dices.shift()
      , effect = 1*dices.shift()
    if ( parsedMsg.bonus != 0 ) {
      var bp = parsedMsg.bonus
      for ( var i in dices ) {
        resultFace += ', '+dices[i]+'x'
        var newResult = 1*(result%10+dices[i]*10)
        if ( bp * newResult < bp * result ) { result = newResult }
      }
      resultFace += ' => ' + result
    }
    return ("Judge: "+parsedMsg.success+"% ( "+parsedMsg.effectable+"% ) ... [ 出目 : "+
      resultFace+" "+
      exports.resultFace(result, parsedMsg.border)+
      ', 効果値 : '+(exports.effect(result, parsedMsg.border, effect))+' ]')
  }
}

exports.resultFace = function(result, border) {
  if ( border.effectable( result ) ) {
    return '効果的成功'
  } else if ( border.fumble( result ) ) {
    return '致命的失敗'
  } else if ( border.success( result ) ) {
    return '成功'
  } else {
    return '失敗'
  }
}

exports.effect = function(result, border, effect) {
  var baseValue = 0
  if ( border.effectable( result ) ) {
    baseValue = ( result%10+Math.floor(result/10) )*2
  } else {
    baseValue = result%10+Math.floor(result/10)
  }
  return ""+baseValue+" + 1D10 : "+effect+" = "+(baseValue+effect)
}

exports.parser = function(msg) {
  var success = 1*(pattern.exec(msg)[1])
    , effectable = 1*(pattern.exec(msg)[3])
  if ( Number.isNaN( effectable ) ) { effectable = Math.floor(success / 5) }
  return {
    success: success,
    effectable: effectable,
    border: {
      effectable: function(result) { return result <= effectable },
      success: function(result) { return result <= success },
      fumble: function(result) { return result >= 96 },
    },
    bonus: 0
  }
}

exports.buildDiceCode = function(parsedMsg) {
  var diceCode = 'd100+d10'
  if ( parsedMsg.bonus > 0 ) {
    diceCode += Array(bonus+1).join('+d10')
  } else if ( parsedMsg < 0 ) {
    diceCode += Array(-1*parsedMsg+1).join('+d10')
  }
  return diceCode
}

exports.apply = function(data) {
  var msg = this.parser(data.msg)
  data.dice.push(dice.roll(exports.buildDiceCode(msg), exports.resultFunction(msg)))
  return data
}
