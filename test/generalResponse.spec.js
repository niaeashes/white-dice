import GeneralResponse from '../lib/generalResponse'

import expect from 'expect.js'

describe('GeneralResponse', () => {

  describe('.hasFields', () => {

    it('is true with any fields', (done) => {
      let response = new GeneralResponse("Sample", { fields: ["---"] })
      expect(response.hasFields).to.be(true)
      done()
    })

    it('is false with empty fields', (done) => {
      let response = new GeneralResponse("Sample", { fields: [] })
      expect(response.hasFields).to.be(false)
      done()
    })

  })

})
