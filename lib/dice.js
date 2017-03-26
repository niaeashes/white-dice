import RollResult from './rollResult'
import MersenneTwister from 'mersenne-twister'

const DICE_CODE_PATTERN = /^([0-9]*)D([0-9]+)$/

const generator = new MersenneTwister(Date.now())

class Dice {

  constructor(diceCode, options = {}) {
    if ( ! diceCode.match(DICE_CODE_PATTERN) ) {
      throw new InvalidDiceCode(diceCode)
    }
    this.code = diceCode
    let dice = diceCode.split('D')
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
