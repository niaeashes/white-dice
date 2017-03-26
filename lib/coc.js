import './array.extend'

import Dice from './dice'
import math from 'mathjs'

const COC_PATTERN = /^coc[0-9\+\-\*\/\(\)]+$/

class CocMatcher {

  match(str) {
    return !! str.match(COC_PATTERN)
  }

}

const matcher = new CocMatcher()

class CocCommand {

  constructor(raw, parameters = []) {
    if ( ! matcher.match(raw) ) {
      throw `Invalid Command Face: ${raw}`
    }
    this.raw = raw
    this.parameters = parameters
  }

  get rate() {
    const match = this.raw.match(/^coc([0-9]+(?:[\+\-\*\/\(\)][0-9]+)*)/)
    if ( match ) {
      return Math.floor( math.eval(match[1]) )
    } else {
      return 0
    }
  }

  get hasBonus() {
    return this._hasBonus = this._hasBonus || !! this.suffix.match(/\+/)
  }

  get hasPenalty() {
    return this._hasPenalty = this._hasPenalty || !! this.suffix.match(/\-/)
  }

  get bonus() {
    if ( ! this.hasBonus ) return 0
    return ( this.suffix.match(/\+/g) || [] ).length
  }

  get penalty() {
    if ( ! this.hasPenalty ) return 0
    return ( this.suffix.match(/\-/g) || [] ).length
  }

  get additionalDices() {
    return this.bonus - this.penalty
  }

  get suffix() {
    return this._suffix = this._suffix || (match => match ? match[0] : "" )(this.raw.match(/[\+\-]*$/))
  }

  get fields() {
  }

  get totalDices() {
    return 2 + Math.abs(this.additionalDices) 
  }

  roll() {
    const dice = new Dice(`${this.totalDices}D10`, { zero: true })
    const rollResult = dice.roll()
    return new CocResult(rollResult, this)
  }

  run() {
    const result = this.roll()
    let response = {
      content: `( ${result.savedRate}% ) ${ result.result } \u2192 **${ result.humanize }**`,
    }
    if ( result.rate != Infinity && this.additionalDices != 0 ) {
      response.fields = [
        { name: "Dices", value: result.humanizeDices.join(', ') }
      ]
    }
    return response
  }

}

class CocResult {

  constructor(rollResult, command) {
    this.rollResult = rollResult
    this.rate = command.rate
    this.additionalDices = command.additionalDices
  }

  get savedRate() {
    if ( this.rate == Infinity ) return Infinity
    return Math.max(Math.min(this.rate, 99), 0)
  }

  get dices() {
    return this.rollResult.results.slice(0)
  }

  get humanizeDices() {
    let humanizeDices = []
    this.dices.forEach((dice, index) => {
      humanizeDices.push( index == 1 ? dice : dice + '0' )
    })
    return humanizeDices
  }

  get result() {

    if ( this._result ) return this._result

    if ( this.rate == Infinity ) return this._result = 100

    let dices = this.dices
      , tenPlace = dices.shift()
      , onePlace = dices.shift() 
      , tmpResult = tenPlace * 10 + onePlace

    if ( tmpResult == 0 ) tmpResult = 100

    if ( this.additionalDices != 0 ) {
      let nextTenPlace = null
      while ( typeof ( nextTenPlace = dices.shift() ) != 'undefined' ) {
        let newResult = ( nextTenPlace * 10 + onePlace )
        if ( newResult == 0 ) newResult = 100
        tmpResult = this.additionalDices * ( newResult - tmpResult ) < 0 ? newResult : tmpResult
      }
    }

    this._result = tmpResult

    return this._result

  }

  get success() {
    return this.rate != Infinity && this.result <= this.rate
  }

  get failure() {
    return this.rate == Infinity || this.result > this.rate
  }

  get humanize() {
    if ( this.rate == Infinity ) {
      return `Summon ${ ['Azathoth', 'Cthulhu', 'Yog-Sothoth'].sample() }`
    } else if ( this.result > this.rate ) {
      return "Failure..."
    } else if ( this.result <= this.rate / 5 ) {
      return "Special !!!!"
    } else {
      return "Success !"
    }
  }

}

export const Matcher = matcher
export const Command = CocCommand
export const Result = CocResult
