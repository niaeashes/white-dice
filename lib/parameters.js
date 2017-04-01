import GeneralResponse from './generalResponse'
import parameterSpace from './parameterSpace'

const PARAMETERS_PATTERN = /^\/parameters$/

class ParametersMatcher {
  match(str) {
    return !! str.match(PARAMETERS_PATTERN)
  }
}

const matcher = new ParametersMatcher()

class ParametersCommand {

  constructor(code) {
    this.multiline = true
    this.fields = []
  }

  write(line) {
    const parser = new ParameterParser(line)
    parser.parse()
    console.log("Parsed:", parser.name, parser.value)
    if ( parser.success ) {
      this.fields.push({ name: parser.name, value: parser.value })
    }
  }

  run(uid = null) {
    let fields = []
    this.fields.forEach(field => {
      parameterSpace.push(uid, field)
      fields.push({ name: field.name, value: field.value, inline: true })
    })
    return new GeneralResponse("", { fields })
  }

}

const PARSEABLE_PARAMETER_PATTERN = /^([^\s]+)\s?\:?=\s?([^\s]+)$/
const STATIC_PATTERN = /^([^\s]+)\s?\=\s?(\-?[0-9]+)/

class ParameterParser {

  constructor(input) {
    this.input = input
    this.name = null
    this.value = null
  }

  get valid() {
    return !! this.input.match(PARSEABLE_PARAMETER_PATTERN)
  }

  get success() {
    return this.name != null && this.value != null
  }

  get isStatic() {
    return !! this.input.match(STATIC_PATTERN)
  }

  get isExpression() {
    return !! this.input.match(/^([^\s]+)\s?\:=/)
  }

  parse() {
    if ( this.isStatic ) {
      this.staticParse()
    }
    if ( this.isExpression ) {
      this.expressionParse()
    }
  }

  staticParse() {
    let splited = this.input.match(STATIC_PATTERN)
      , rawName = splited[1]
      , rawValue = splited[2]
    this.name = rawName
    this.value = isNaN(rawValue) ? null : parseInt(rawValue)
  }

  expressionParse() {
  }

}

export const Matcher = matcher
export const Command = ParametersCommand
export const Parser = ParameterParser
