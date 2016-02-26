var pattern = /^dr([0-9]+)([cs](?:[0-9]+(?:\/[0-9]+)?))?((?:[+\-][0-9]+)+)?/i
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
    return ("Judge: "+parsedMsg.success+"% ( "+parsedMsg.effectable+"% ) ... [ 出目 : "+
      resultFace+" "+
      exports.resultFace(result, parsedMsg.border)+
      ', 効果値 : '+(exports.effect(result, parsedMsg.border, parsedMsg.exp))+' ]')
  }
}

exports.resultFace = function(result, border) {
  if ( border.effectable( result ) ) {
    return '効果的成功'
  } else if ( border.success( result ) ) {
    return '成功'
  } else if ( border.fumble( result ) ) {
    return '致命的失敗'
  } else {
    return '失敗'
  }
}

exports.effect = function(result, border, exp) {
  var baseValue = 0
  if ( border.effectable( result ) ) {
    baseValue = ( result%10+Math.floor(result/10) )*2
  } else {
    baseValue = result%10+Math.floor(result/10)
  }
  return dice.roll(baseValue+"+1D10"+exp, '(--FACE--) = (--SUM--)')
}

exports.parser = function(msg) {
  var success = 1*(pattern.exec(msg)[1])
    , effectable = (pattern.exec(msg)[2])
    , exp= (pattern.exec(msg)[3])
  if ( effectable !== '' && effectable != undefined ) {
    if ( effectable[0] == 's' ) effectable = effectable.replace(/^s/, 'c')+"/5"
    if ( effectable[0] == 'c' ) effectable = effectable.replace(/^c/, '')
    var list = (""+effectable).split('/', 2)
    if ( list.length == 2 ) effectable = Math.floor( list[0] / list[1] )
  }
  if ( Number.isNaN( effectable ) || effectable == undefined ) effectable = Math.floor(success / 5)
  if ( exp == undefined ) { exp = "" }
  return {
    success: success,
    effectable: effectable,
    exp: exp,
    border: {
      effectable: function(result) { return result <= effectable },
      success: function(result) { return result <= Math.min( success, 98 ) },
      fumble: function(result) { return ( Math.min(98, success) < result && ( result % 11 ) == 0 || result == 100 ) },
    }
  }
}

exports.buildDiceCode = function(parsedMsg) {
  var diceCode = 'd100'
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
