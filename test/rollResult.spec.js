import Dice from '../lib/dice'
import RollResult from '../lib/rollResult'

import expect from 'expect.js'

describe('RollResult', () => {

  describe('.size', () => {

    it('equals 2 with [1, 6]', (done) => {
      let rollResult = new RollResult([1, 6], new Dice("2D6"))
      expect(rollResult.size).to.eql(2)
      done()
    })

    it('equals 2 with [25, 75]', (done) => {
      let rollResult = new RollResult([25, 75], new Dice("2D100"))
      expect(rollResult.size).to.eql(2)
      done()
    })

  })

  describe('.sum', () => {

    it('equals 7 with [1, 6]', (done) => {
      let rollResult = new RollResult([1, 6], new Dice("2D6"))
      expect(rollResult.sum).to.eql(7)
      done()
    })

    it('equals 100 with [25, 75]', (done) => {
      let rollResult = new RollResult([25, 75], new Dice("2D100"))
      expect(rollResult.sum).to.eql(100)
      done()
    })

  })

})
