class RollResult {

  constructor(results, dice) {
    this.results = results
    this.dice = dice
    this.size = this.results.length
  }

  get sum() {
    return this.results.reduce((sum, num) => sum + num, 0)
  }

}

export default RollResult
