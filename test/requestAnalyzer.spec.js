import RequestAnalyzer from '../lib/requestAnalyzer'
import "../lib/string.extend"

import expect from 'expect.js'

describe('RequestAnalyzer', () => {

  describe('.content', () => {

    it('converts ＡＢ（Ｃ） => AB(C)', (done) => {
      let request = new RequestAnalyzer("ＡＢ（Ｃ）")
      expect(request.content).to.eql("AB(C)")
      done()
    })

    it('converts ・ｓａｍｐｌｅ => /sample', (done) => {
      let request = new RequestAnalyzer("・ｓａｍｐｌｅ")
      expect(request.content).to.eql("/sample")
      done()
    })

    it('converts {many spaces} => " "', (done) => {
      let request = new RequestAnalyzer("\u3000\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u200B")
      expect(request.content).to.eql(" ")
      done()
    })

  })

})

describe('String', () => {

  describe('.requestParse', () => {

    it('converts ＡＢ（Ｃ） => AB(C)', (done) => {
      expect("ＡＢ（Ｃ）".requestParse()).to.eql("AB(C)")
      done()
    })

  })

})
