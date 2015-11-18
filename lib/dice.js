module.exports = {
  hasDice: function(msg) {
    var diceString = msg.match(/^([0-9]+r)?([\+\-]?[0-9]*d[0-9]*|[\+\-]?[0-9]+)+(\s|$)/i)
    return !! diceString && diceString[0].match(/d/i)
  }

, getRollCount: function (msg) {
    var diceString = msg.match(/^([0-9]+r)?([\+\-]?[0-9]*d[0-9]*|[\+\-]?[0-9]+)+/i)[0]
      , rollCount = 1
      , rollCountMatchPattern = /^([0-9]+)r/i
      , rollCountMatch = rollCountMatchPattern.exec(diceString)
    if ( rollCountMatch ) {
      rollCount = 1*rollCountMatch[1]
      diceString = diceString.substring(rollCountMatch[0].length)
    }
    return { count: rollCount, dice: diceString }
  }

, roll: function (diceString, format) {
    if ( typeof format == 'undefined' ) { format = "(--FACE--) [ 計: (--SUM--) ]" }
    var result = 0
      , tmpDiceString = diceString
      , dices = []
      , log = []
    do {
      var nextIsDice = this.nextIsDiceSection(tmpDiceString)
        , nextIsScalar = this.nextIsScalarSection(tmpDiceString)
      if ( nextIsDice ) {
        var parser = new DiceParser(nextIsDice[1])
        parser.roll()
        log = log.concat(parser.allFaces())
        result += parser.sum()
        var list = parser.list()
        for ( var i in list ) { dices.push(list[i]) }
        tmpDiceString = tmpDiceString.substring(nextIsDice[1].length)
      } else if ( nextIsScalar ) {
        var scalar = nextIsScalar[1]
          , signMatchPattern = /^[\+\-]/
          , valueMatchPattern = /^[0-9]+/i
        var sign = 1
          , signMatch = signMatchPattern.exec(scalar)
        if ( signMatch ) {
          if ( signMatch[0] == '-' ) { sign = -1; }
          scalar = scalar.substring(signMatch[0].length);
        }
        value = 1*scalar
        log = log.concat([(sign < 0 ? '- ' : '')+value])
        result += (sign * value)
        tmpDiceString = tmpDiceString.substring(nextIsScalar[1].length)
      } else {
        tmpDiceString = tmpDiceString.substring(1)
      }
    } while ( tmpDiceString != '' )

    if ( typeof format == 'function' ) {
      return format(dices, log)
    } else {
      return format
        .replace("(--FACE--)", log.join(' + ').replace('+ -', '-'))
        .replace("(--SUM--)", result)
    }
  }

, nextIsDiceSection: function(diceString) {
    // Example) 2d100, d, d5, +2d6
    var singleDicePattern = /^([\+\-]?[0-9]*d[0-9]*)/i
    return singleDicePattern.exec(diceString)
  }

, nextIsScalarSection: function(diceString) {
    // Example) +10, -23, 12
    var singleScalarPattern = /^([\+\-]?[0-9]+)/i
    return singleScalarPattern.exec(diceString)
  }
}

var DiceParser = function(diceString) {
  this.sign = 1
  this.count = 1
  this.size = 100
  this.string = diceString
  this.results = []
}

DiceParser.prototype = {
  roll: function() {
    this.parse()
    if ( ( this.sign == 1 || this.sign == -1 ) && this.count > 0 && this.size > 0 ) {
      for ( var d = 0; d < this.count; d++ ) {
        var value = ( this.sign * (Math.floor(Math.random() * this.size) + 1) )
        this.results.push(value)
      }
    }
  }

, parseSign: function(tmpString) {
    if ( typeof tmpString == 'undefined' ) { tmpString = this.string }
    var signMatchPattern = /^[\+\-]/
      , signMatch = signMatchPattern.exec(tmpString)
    if ( signMatch ) {
      if ( signMatch[0] == '-' ) { this.sign = -1 }
      return tmpString.substring(signMatch[0].length)
    }
    return tmpString
  }

, parseCount: function(tmpString) {
    if ( typeof tmpString == 'undefined' ) { tmpString = this.string }
    var diceCountMatchPattern = /^[0-9]+d/i
      , diceCountMatch = diceCountMatchPattern.exec(tmpString)
    if ( diceCountMatch ) {
      this.count = 1*diceCountMatch[0].substring(0, diceCountMatch[0].length-1)
      return tmpString.substring(diceCountMatch[0].length-1)
    }
    return tmpString
  }

, parseSize: function(tmpString) {
    if ( typeof tmpString == 'undefined' ) { tmpString = this.string }
    var diceSizeMatchPattern = /^d[0-9]+/i
      , diceSizeMatch = diceSizeMatchPattern.exec(tmpString);
    if ( diceSizeMatch ) {
      this.size = 1*diceSizeMatch[0].substring(1);
    }
  }

, parse: function() {
    this.parseSize(this.parseCount(this.parseSign(this.string)))
  }

, sum: function() {
    return this.results.reduce(function(a, b) { return a+b })
  }

, list: function() {
    return this.results
  }

, face: function() {
    return (this.sign < 0 ? '- ' : '')+"D"+this.size
  }

, allFaces: function() {
    var result = []
    for ( var i in this.results ) {
      result.push(this.face()+" : "+this.results[i])
    }
    return result
  }
}
