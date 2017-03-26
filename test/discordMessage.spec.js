import Dice from '../lib/dice'
import RollResult from '../lib/rollResult'
import DiscordMessage from '../lib/discordMessage'

import expect from 'expect.js'

describe('DiscordMessage', () => {

  describe('.content', () => {

    it('equals "ok" when pushed "ok"', (done) => {
      let message = new DiscordMessage()
      message.push({ content: "ok" })
      expect(message.content).to.eql(["ok"])
      done()
    })

  })

})
