import { Parser as ParameterParser } from '../lib/parameters'

import expect from 'expect.js'

describe('ParameterParser', () => {

  describe('.valid', () => {

    it('returns true with "STR = 10"', (done) => {
      let parser = new ParameterParser("STR = 10")
      expect(parser.valid).to.be(true)
      done()
    })

    it('returns true with "アイディア := INT*5"', (done) => {
      let parser = new ParameterParser("アイディア := INT*5")
      expect(parser.valid).to.be(true)
      done()
    })

    it('returns false with "Invalid"', (done) => {
      let parser = new ParameterParser("Invalid")
      expect(parser.valid).to.be(false)
      done()
    })

  })

  describe('.isStatic', () => {

    it('returns true with "STR = 10"', (done) => {
      let parser = new ParameterParser("STR = 10")
      expect(parser.isStatic).to.be(true)
      done()
    })

    it('returns false with "アイディア := INT*5"', (done) => {
      let parser = new ParameterParser("アイディア := INT*5")
      expect(parser.isStatic).to.be(false)
      done()
    })

  })

  describe('.isExpression', () => {

    it('returns false with "STR = 10"', (done) => {
      let parser = new ParameterParser("STR = 10")
      expect(parser.isExpression).to.be(false)
      done()
    })

    it('returns true with "アイディア := INT*5"', (done) => {
      let parser = new ParameterParser("アイディア := INT*5")
      expect(parser.isExpression).to.be(true)
      done()
    })

  })

})
