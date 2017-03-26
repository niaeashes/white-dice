import { Matcher as CocMatcher, Command as CocCommand } from './coc'
import { Matcher as KeyNoMatcher, Command as KeyNoCommand } from './keyNo'
import { Matcher as DxMatcher, Command as DxCommand } from './dx'

const pairs = [
  { matcher: CocMatcher, command: CocCommand },
  { matcher: KeyNoMatcher, command: KeyNoCommand },
  { matcher: DxMatcher, command: DxCommand }
]

class Command {

  constructor(command) {
    this.raw = command
  }

  get valid() {
    return this.targets.length > 0
  }

  get targets() {
    let targets = []
    pairs.forEach(pair => {
      if ( pair.matcher.match(this.raw) ) targets.push(new pair.command(this.raw))
    })
    return targets
  }
}

export default Command
