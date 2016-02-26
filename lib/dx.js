var pattern = /^([0-9]+)dx([0-9]+)?(?:\+([0-9]+))?/i
  , dice = require('./dice.js')

exports.isMatch = function(msg) {
  return !! pattern.exec(msg)
}

exports.resultFunction = function(critical, staticValue) {
  return function(dices, log) {
    var resultFace = dices.join(", ")
      , criticalCount = 0
    dices.forEach(function(d) {
      if ( critical <= d ) { criticalCount += 1 }
    })
    if ( criticalCount == 0 ) {
      var result = 1*staticValue
      result += Math.max.apply(null, dices.map(function(d){
        return parseInt(d)
      }))
      return ("DoubleCross: "+resultFace+" [ Finish! - Result: "+result+" ]")
    } else {
      return ("DoubleCross: "+resultFace+" [ Critical! ( "+criticalCount+" ) - Next: {"+criticalCount+"dx"+critical+"+"+(staticValue+10)+"} ]")
    }
  }
}

exports.apply = function(data) {
  var count = 1*pattern.exec(data.msg)[1]
    , critical = pattern.exec(data.msg)[2]
    , staticValue = pattern.exec(data.msg)[3]
  if ( critical == undefined ) { critical = 10 }
  if ( staticValue == undefined ) { staticValue = 0 }
  critical = parseInt(critical)
  staticValue = parseInt(staticValue)
  var resultFunction = this.resultFunction(critical, staticValue);
  data.dice.push(dice.roll(count+"d10", resultFunction))
  return data
}
