import Command from '../lib/command'

import { Command as CocCommand } from '../lib/coc'

import expect from 'expect.js'

describe('Command', () => {

  describe('.targets', () => {

    it('returns Array', (done) => {
      let command = new Command('sample')
      expect(command.targets).to.be.a(Array)
      done()
    })

    it('includes CocCommand', (done) => {
      let command = new Command('coc60')
      command.targets.forEach(target => {
        expect(target).to.be.a(CocCommand)
      })
      done()
    })

    it('does NOT include CocCommand', (done) => {
      let command = new Command('sample')
      command.targets.forEach(target => {
        expect(target).not.to.be.a(CocCommand)
      })
      done()
    })

  })
})
