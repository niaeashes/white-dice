import { Matcher as DiceMatcher, Command as DiceCommand } from './dice'
import { Matcher as CocMatcher, Command as CocCommand } from './coc'
import { Matcher as KeyNoMatcher, Command as KeyNoCommand } from './keyNo'
import { Matcher as DxMatcher, Command as DxCommand } from './dx'
import { Matcher as ParametersMatcher, Command as ParametersCommand } from './parameters'

const pairs = [
  { matcher: DiceMatcher, command: DiceCommand },
  { matcher: CocMatcher, command: CocCommand },
  { matcher: KeyNoMatcher, command: KeyNoCommand },
  { matcher: DxMatcher, command: DxCommand },
  { matcher: ParametersMatcher, command: ParametersCommand }
]

class Command {

  constructor(command, options={}) {
    this.raw = command
    this.options = options
    this.target = null
    pairs.forEach(pair => {
      if ( this.target ) return
      if ( pair.matcher.match(this.raw) ) this.target = new pair.command(this.raw)
    })
  }

  get valid() {
    return !! this.target
  }

  get multiline() {
    return this.target.multiline
  }

  run(uid = null) {
    if ( ! this.valid ) return
    return this.target.run(uid)
  }

  write(line) {
    console.log(line)
    if ( ! this.valid ) return
    return this.target.write(line)
  }
}

export default Command
