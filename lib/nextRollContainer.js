class NextRollContainer {

  constructor() {
    this.rolls = {}
  }

  register(id, command) {
    this.rolls[id] = command
  }

  find(id) {
    return this.rolls[id] || ""
  }
}

export default NextRollContainer
