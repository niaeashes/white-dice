import { Matcher as KeyNoMatcher, Command as KeyNoCommand } from '../lib/keyNo'
import GeneralResponse from '../lib/generalResponse'

import expect from 'expect.js'

describe('KeyNoCommand', () => {

  describe('.no', () => {

    it('equals 10 with k10', (done) => {
      let keyNo = new KeyNoCommand("k10")
      expect(keyNo.no).to.eql(10)
      done()
    })

    it('equals 10 with 10', (done) => {
      let keyNo = new KeyNoCommand(10)
      expect(keyNo.no).to.eql(10)
      done()
    })

  })

  describe('.critical', () => {

    it('equals 10 with k21', (done) => {
      let keyNo = new KeyNoCommand("k21")
      expect(keyNo.critical).to.eql(10)
      done()
    })

    it('equals 8 with 10, 8', (done) => {
      let keyNo = new KeyNoCommand(10, 8)
      expect(keyNo.critical).to.eql(8)
      done()
    })

  })

  describe('.exp', () => {

    it('is empty with k21', (done) => {
      let keyNo = new KeyNoCommand("k21")
      expect(keyNo.exp).to.eql("")
      done()
    })

    it('equals +8 with k10+8', (done) => {
      let keyNo = new KeyNoCommand("k10+8")
      expect(keyNo.exp).to.eql("+8")
      done()
    })

  })

  describe('.run()', () => {

    it('responses GeneralResponse', (done) => {
      let command = new KeyNoCommand("k10c8")
      expect(command.run()).to.be.a(GeneralResponse)
      done()
    })

  })

})

describe('KeyNoMatcher', () => {

  it('.match k10@8+10', (done) => {
    expect(KeyNoMatcher.match("k10@8+10")).to.be(true)
    done()
  })

})
