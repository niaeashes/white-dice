import RollResult from './rollResult'
import MersenneTwister from 'mersenne-twister'

import GeneralResponse from './generalResponse'
import math from 'mathjs'

const DICE_CODE_PATTERN = /^([0-9]*)[Dd]([0-9]+)$/

const generator = new MersenneTwister(Date.now())

class DiceMatcher {

  match(str) {
    return str.match(/^(?:[0-9]+[Dd][0-9]+)(?:[\+\-\*\/](?:[0-9]+[Dd][0-9]+|[0-9]+))*$/)
  }

}

class DiceCommand {

  constructor(msg) {
    this.msg = msg
    this.codes = msg.match(/([0-9]+[Dd][0-9]+)/g)
  }

  roll() {
    let results = []
    this.codes.forEach((code) => {
      let dice = new Dice(code)
      results.push(dice.roll())
    })
    return results
  }

  run() {
    const results = this.roll()
    let exp = this.msg
    let dices = []
    results.forEach((result) => {
      dices = dices.concat(result.results)
      exp = exp.replace(result.dice.code, result.results.join('+'))
    })
    const content = `( ${dices.join(', ')} ) \u2192 ${exp} = ${math.eval(exp)}`
    return new GeneralResponse(content)
  }

}

class Dice {

  constructor(diceCode, options = {}) {
    if ( ! diceCode.match(DICE_CODE_PATTERN) ) {
      throw new InvalidDiceCode(diceCode)
    }
    this.code = diceCode
    let dice = diceCode.split(/[Dd]/)
    this.number = Math.max(parseInt(dice[0] || 1), 1)
    this.sides = parseInt(dice[1])
    this.options = options
  }

  roll() {
    let results = []
    for ( let i = 0; i < this.number; i++) {
      results.push(this.zeroShift( Math.floor( generator.random() * this.sides ) ))
    }
    return new RollResult(results, this)
  }

  zeroShift(result) {
    if ( this.options.zero ) {
      // 10 sided die has 0 ~ 9.
      return result
    } else {
      // Another sided die ( example: 6 sided ) has 1 ~.
      return result + 1
    }
  }

}

class InvalidDiceCode {

  constructor(diceCode) {
    this.message = `Invalid DiceCode: ${diceCode}`
  }

}

export default Dice
export const Command = DiceCommand
export const Matcher = new DiceMatcher()
