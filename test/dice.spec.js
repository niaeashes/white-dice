import Dice, { Command as DiceCommand } from '../lib/dice'
import RollResult from '../lib/rollResult'

import expect from 'expect.js'

describe('Dice', () => {

  describe('.code', () => {

    it('equals setted code', (done) => {
      let dice = new Dice("2D6")
      expect(dice.code).to.eql("2D6")
      done()
    })

  })

  describe('.number', () => {

    it('equals 2 with 2D6', (done) => {
      let dice = new Dice("2D6")
      expect(dice.number).to.eql(2)
      done()
    })

    it('equals 1 with D100', (done) => {
      let dice = new Dice("D100")
      expect(dice.number).to.eql(1)
      done()
    })

  })

  describe('.sides', () => {

    it('equals 6 with 2D6', (done) => {
      let dice = new Dice("2D6")
      expect(dice.sides).to.eql(6)
      done()
    })

    it('equals 100 with D100', (done) => {
      let dice = new Dice("D100")
      expect(dice.sides).to.eql(100)
      done()
    })

  })

  describe('.roll()', () => {

    it('returns RollResult instance', (done) => {
      let dice = new Dice("2D6")
      let roll = dice.roll()
      expect(roll).to.be.a(RollResult)
      expect(roll.size).to.eql(2)
      done()
    })

    it('returns 1 ~ 6 results', (done) => {
      let dice = new Dice("24D6")
      let roll = dice.roll()
      roll.results.forEach((result) => {
        expect(result).to.greaterThan(0)
        expect(result).to.lessThan(7)
      })
      done()
    })

    it('returns 0 ~ 9 results with zero options', (done) => {
      let dice = new Dice("30D10", { zero: true })
      let roll = dice.roll()
      roll.results.forEach((result) => {
        expect(result).to.greaterThan(-1)
        expect(result).to.lessThan(10)
      })
      done()
    })

  })

})

describe('DiceCommand', () => {

  describe('.roll()', () => {

    it('roll 2D6', (done) => {
      let command = new DiceCommand('2D6')
      let results = command.roll()
      expect(results.length).to.eql(1)
      expect(results[0].size).to.eql(2)
      done()
    })

  })

  describe('.run()', () => {

    it('roll 2D6', (done) => {
      let command = new DiceCommand('2D6')
      let result = command.run()
      done()
    })

    it('roll 2D6+6', (done) => {
      let command = new DiceCommand('2D6+6')
      let result = command.run()
      done()
    })

  })

})
