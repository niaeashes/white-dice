var pattern = /^([0-9]+)u(?:c([1-6]))?/i
  , dice = require('./dice.js')

exports.isMatch = function(msg) {
  return !! pattern.exec(msg)
}

exports.resultFunction = function(critical) {
  return function(dices, log) {
    var resultFace = dices.join(", ")
      , set = 0
      , success = 0
    var counter = [0, 0, 0, 0, 0, 0]
    dices.forEach(function(d) { counter[d-1] += 1 })
    if ( critical == 0 ) {
      var set = counter.filter(function(v) { return v >= 2 }).length
      var success = Math.max( Math.max.apply(null, counter), 2)
    } else {
      var value = counter[critical-1]
      var success = value * 2
      var set = ( success == 0 ? 0 : 1 )
    }
    return ("Utakaze: "+resultFace+" [ Success: "+success+", Set: "+set+" ]")
  }
}

exports.apply = function(data) {
  var count = 1*pattern.exec(data.msg)[1]
    , critical = pattern.exec(data.msg)[2]
  if ( critical == undefined ) { critical = 0 }
  var resultFunction = this.resultFunction(parseInt(critical));
  data.dice.push(dice.roll(count+"d6", resultFunction))
  return data
}
