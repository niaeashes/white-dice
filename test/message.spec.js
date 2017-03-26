import Dice from '../lib/dice'
import RollResult from '../lib/rollResult'
import Message from '../lib/message'

import expect from 'expect.js'

describe('Message', () => {

  describe('.content', () => {

    it('equals "ok" when pushed "ok"', (done) => {
      let message = new Message()
      message.push({ content: "ok" })
      expect(message.content).to.eql(["ok"])
      done()
    })

  })

})
