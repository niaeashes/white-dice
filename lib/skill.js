var pattern = /^s([0-9]+)/i
  , dice = require('./dice.js')

exports.isSkill = function(msg) {
  return !! pattern.exec(msg)
}

exports.apply = function(data) {
  var result = 1*dice.roll("D100", '(--SUM--)')
    , border = 1*(pattern.exec(data.msg)[1])
  data.dice.push("Judge: "+border+"% ... [ 出目 : "+
    +result+" "+
    (border >= result ? "Success!" : "Failure..." )+" ]")
  return data
}
