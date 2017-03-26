const DX_PATTERN = /^([0-9]+)dx([0-9]+)?((?:\+|\-)(?:[0-9]+))?/i
const DEFAULT_CRITICAL = 10

import Dice from './dice'
import math from 'mathjs'

class DxMatcher {

  match(str) {
    return !! str.match(DX_PATTERN)
  }

}

const matcher = new DxMatcher()

class DxCommand {

  constructor(code) {
    if ( typeof code == 'string' && matcher.match(code) ) {
      this.initByCode(code)
    } else {
      this.initByValue(arguments[0], arguments[1], arguments[2])
    }
  }

  initByCode(code) {
    const match = code.match(DX_PATTERN)
    this.initByValue(match[1], match[2], match[3])
  }

  initByValue(number, critical, exp="") {
    this.number = parseInt(number)
    this.critical = parseInt(critical || DEFAULT_CRITICAL)
    this.exp = exp
  }

  roll() {
    const dice = new Dice(`${this.number}D10`)
    return new DxResult(dice.roll(), this)
  }

  run() {
    const result = this.roll()
    let response = {
      content: `${result.humanize} \u2192 ${result.value}`,
      fields: [
        { name: "出目", value: result.dices.join(', '), inline: true }
      ]
    }
    if ( result.isCritical ) {
      response.fields.push({ name: "追加ロール", value: `\`\`\`${result.nextCommand}\`\`\``, inline: false })
    }
    return response
  }
}

class DxResult {

  constructor(rollResult, command) {
    this.rollResult = rollResult
    this.command = command
  }

  get dices() {
    return this.rollResult.results
  }

  get max() {
    return Math.max.apply(null, this.rollResult.results)
  }

  get isCritical() {
    return this.criticalCount > 0
  }

  get criticalCount() {
    if ( this._counter ) return this._counter
    this._counter = 0
    this.rollResult.results.forEach((result) => {
      if ( result >= this.command.critical ) this._counter++
    })
    return this._counter
  }

  get value() {
    console.log(`${ this.isCritical ? 10 : this.max }${this.command.exp}`)
    return math.eval(`${ this.isCritical ? 10 : this.max }${this.command.exp}`)
  }

  get humanize() {
    if ( this.isCritical ) {
      return "クリティカル！"
    }
    return ""
  }

  get nextCommand() {
    if ( ! this.isCritical ) return null
    return `${this.criticalCount}dx${this.command.critical}+${this.nextExp}`
  }

  get nextExp() {
    return math.eval(`10${this.command.exp}`)
  }

}

export const Matcher = matcher
export const Command = DxCommand
export const Result = DxResult
