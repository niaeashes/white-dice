import { Command as CocCommand, Result as CocResult } from '../lib/coc'
import GeneralResponse from '../lib/generalResponse'

import expect from 'expect.js'

describe('CocCommand', () => {

  describe('.suffix', () => {

    it('equals "++" with coc60++', (done) => {
      let command = new CocCommand("coc60++")
      expect(command.suffix).to.eql("++")
      done()
    })

    it('equals "" with coc90', (done) => {
      let command = new CocCommand("coc90")
      expect(command.suffix).to.eql("")
      done()
    })

    it('equals "---" with coc90---', (done) => {
      let command = new CocCommand("coc90---")
      expect(command.suffix).to.eql("---")
      done()
    })

    it('equals "+-+-" with coc20+-+-', (done) => {
      let command = new CocCommand("coc20+-+-")
      expect(command.suffix).to.eql("+-+-")
      done()
    })

  })

  describe('.rate', () => {

    it('equals 60 with coc60', (done) => {
      let command = new CocCommand("coc60")
      expect(command.rate).to.eql(60)
      done()
    })

    it('equals 20 with coc40/2', (done) => {
      let command = new CocCommand("coc40/2")
      expect(command.rate).to.eql(20)
      done()
    })

    it('equals 12 with coc25/2', (done) => {
      let command = new CocCommand("coc25/2")
      expect(command.rate).to.eql(12)
      done()
    })

    it('equals Infinity with coc25/0', (done) => {
      let command = new CocCommand("coc25/0")
      expect(command.rate).to.eql(Infinity)
      done()
    })

  })

  describe('.additionalDices', () => {

    it('equals 2 with coc60++', (done) => {
      let command = new CocCommand("coc60++")
      expect(command.additionalDices).to.eql(2)
      done()
    })

    it('equals 2 with coc60--', (done) => {
      let command = new CocCommand("coc60--")
      expect(command.additionalDices).to.eql(-2)
      done()
    })

    it('equals 0 with coc60++--', (done) => {
      let command = new CocCommand("coc60++--")
      expect(command.additionalDices).to.eql(0)
      done()
    })

  })

  describe('.roll()', () => {

    it('is a CocResult', (done) => {
      let command = new CocCommand("coc60")
      expect(command.roll()).to.be.a(CocResult)
      done()
    })

    it('pass with bonus dices', (done) => {
      let command = new CocCommand("coc60+++++")
      expect(command.roll()).to.be.a(CocResult)
      done()
    })

    it('pass with penalty dices', (done) => {
      let command = new CocCommand("coc60-----")
      expect(command.roll()).to.be.a(CocResult)
      done()
    })

  })

  describe('.run()', () => {

    it('responses GeneralResponse', (done) => {
      let command = new CocCommand("coc60")
      expect(command.run()).to.be.a(GeneralResponse)
      done()
    })

  })

})

describe('CocResult', () => {

  describe('.result', () => {

    it('with bonus dices', (done) => {
      let command = new CocCommand("coc60+++++")
      let result = new CocResult({ results: [9, 1, 8, 7, 6, 2, 1, 0] }, command)
      expect(result.result).to.eql(1)
      done()
    })

    it('with penalty dices', (done) => {
      let command = new CocCommand("coc60-----")
      let result = new CocResult({ results: [1, 0, 3, 4, 5, 6, 7] }, command)
      expect(result.result).to.eql(70)
      done()
    })

    it('with infinity rate', (done) => {
      let command = new CocCommand("coc60/0")
      let result = new CocResult({ results: [1, 0] }, command)
      expect(result.result).to.eql(100)
      done()
    })

  })

})
