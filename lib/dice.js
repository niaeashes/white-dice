exports.hasDice = function(msg) {
  var dicePattern = /^([0-9]+r)?([\+\-]?[0-9]*d[0-9]+|[\+\-]?[0-9]+)+$/i
  var dices = dicePattern.exec(msg)
  return !! dices
}

exports.getRollCount = function (msg) {
  var diceString = msg
    , rollCount = 1
    , rollCountMatchPattern = /^([0-9]+)r/i
    , rollCountMatch = rollCountMatchPattern.exec(diceString)
  if ( rollCountMatch ) {
    rollCount = 1*rollCountMatch[1]
    diceString = diceString.substring(rollCountMatch[0].length)
  }
  return { count: rollCount, dice: diceString }
}

exports.roll = function (diceString) {
  var result = 0
    , tmpDiceString = diceString
    , log = ""
  do {
  var singleDicePattern = /^([\+\-]?[0-9]*d[0-9]*)/i
    , singleDiceMatch = singleDicePattern.exec(tmpDiceString)
    , singleScalarPattern = /^([\+\-]?[0-9]+)/i
    , singleScalarMatch = singleScalarPattern.exec(tmpDiceString)
    if ( singleDiceMatch ) {
      var dice = singleDiceMatch[1]
        , signMatchPattern = /^[\+\-]/
        , diceCountMatchPattern = /^[0-9]+d/i
        , diceSizeMatchPattern = /^d[0-9]+/i
      var sign = 1
        , signMatch = signMatchPattern.exec(dice)
      if ( signMatch ) {
        if ( signMatch[0] == '-' ) { sign = -1; }
        dice = dice.substring(signMatch[0].length);
      }
      var diceCount = 1
        , diceCountMatch = diceCountMatchPattern.exec(dice);
      if ( diceCountMatch ) {
        diceCount = 1*diceCountMatch[0].substring(0, diceCountMatch[0].length-1);
        dice = dice.substring(diceCountMatch[0].length-1);
      }
      var diceSize = 100
        , diceSizeMatch = diceSizeMatchPattern.exec(dice);
      if ( diceSizeMatch ) {
        diceSize = 1*diceSizeMatch[0].substring(1);
      }
      if ( ( sign == 1 || sign == -1 ) && diceCount > 0 && diceSize > 0 ) {
        for ( var d = 0; d < diceCount; d++ ) {
          var value = ( sign * (Math.floor(Math.random() * diceSize) + 1) )
          log += " [ "+singleDiceMatch[1]+": "+value+" ]"
          result += value
        }
      }
      tmpDiceString = tmpDiceString.substring(singleDiceMatch[1].length)
    } else if ( singleScalarMatch ) {
      var scalar = singleScalarMatch[1]
        , signMatchPattern = /^[\+\-]/
        , valueMatchPattern = /^[0-9]+/i
      var sign = 1
        , signMatch = signMatchPattern.exec(scalar)
      if ( signMatch ) {
        if ( signMatch[0] == '-' ) { sign = -1; }
        scalar = scalar.substring(signMatch[0].length);
      }
      value = 1*scalar
      result += (sign * value)
      log += " "+value
      tmpDiceString = tmpDiceString.substring(singleScalarMatch[1].length)
    }
  } while ( tmpDiceString != '' );
  console.log("Dice: "+diceString+" => "+log)
  return result;
}
