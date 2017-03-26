import { Matcher as DxMatcher, Command as DxCommand, Result as DxResult } from '../lib/dx'
import Dice from '../lib/dice'
import RollResult from '../lib/rollResult'

import expect from 'expect.js'

describe('DxResult', () => {

  describe('.dices', () => {

    it('returns passed result', (done) => {
      const result = new DxResult(new RollResult([10, 5, 1], new Dice("3D10")))
      expect(result.dices).to.be.a(Array)
      done()
    })

  })

  describe('.max', () => {

    it('returns 10 with [10, 5, 1]', (done) => {
      const result = new DxResult(new RollResult([10, 5, 1], new Dice("3D10")), new DxCommand(3, 11))
      expect(result.max).to.eql(10)
      done()
    })

    it('returns 8 with [8, 5, 1]', (done) => {
      const result = new DxResult(new RollResult([8, 5, 1], new Dice("3D10")), new DxCommand(3, 11))
      expect(result.max).to.eql(8)
      done()
    })

  })

  describe('.value', () => {

    it('returns 10 with [10, 5, 1]', (done) => {
      const result = new DxResult(new RollResult([10, 5, 1], new Dice("3D10")), new DxCommand(3, 11, "+10"))
      expect(result.value).to.eql(20)
      done()
    })

    it('returns 8 with [8, 5, 1]', (done) => {
      const result = new DxResult(new RollResult([8, 5, 1], new Dice("3D10")), new DxCommand(3, 11))
      expect(result.value).to.eql(8)
      done()
    })

    it('returns 10 with [8, 5, 1] and critical', (done) => {
      const result = new DxResult(new RollResult([8, 5, 1], new Dice("3D10")), new DxCommand(3, 7))
      expect(result.value).to.eql(10)
      done()
    })

  })

})

describe('DxMatcher', () => {

  it('.match 10dx10+10', (done) => {
    expect(DxMatcher.match("10dx10+10")).to.be(true)
    done()
  })

})
