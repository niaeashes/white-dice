import Command from '../lib/command'

import { Command as CocCommand } from '../lib/coc'

import expect from 'expect.js'

describe('Command', () => {

  describe('.targets', () => {

    it('returns Array', (done) => {
      let command = new Command('sample')
      expect(command.target).to.be(null)
      done()
    })

    it('includes CocCommand', (done) => {
      let command = new Command('coc60')
      expect(command.target).to.be.a(CocCommand)
      done()
    })

    it('does NOT include CocCommand', (done) => {
      let command = new Command('sample')
      expect(command.target).not.to.be.a(CocCommand)
      done()
    })

  })
})
