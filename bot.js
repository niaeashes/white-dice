import "./lib/string.extend"
import "./lib/array.extend"

import Discord from 'discord.js';
import Command from './lib/command'
import DiscordMessage from './lib/discordMessage'
import NextRollContainer from './lib/nextRollContainer'

const SPACES_PATTERN = /(\s|\t|\u3000|\uA0|[\u2002-\u200B])/

import parameterSpace from './lib/parameterSpace'

let client = new Discord.Client()
let nextRolls = new NextRollContainer()

client.on('message', function(message) {
  if ( message.author.bot ) return;

  const lines = message.content.split(/\n/)
  const channel = message.channel
  const send = (content, options={}) => {
    channel.send(content, options)
      .then((doc) => {
        console.log("Done:", doc.content)
      })
      .catch(console.error)
  }

  const uid = `${channel.id}.${message.author.id}`

  const commandRunner = (command) => {
    let newMessage = new DiscordMessage()
    let response = command.run(uid)

    newMessage.push(response)
    nextRolls.register(uid, response.nextCommand)

    send(newMessage.content, newMessage.options)
  }

  let afterRunner = null

  let lineRunner = (line) => {

    let commandBody = line.split(SPACES_PATTERN, 2)[0]
    if ( commandBody.requestParse().match(/^p(ush)?$/) ) {
      console.log("Match push roll command:", commandBody.requestParse())
      commandBody = nextRolls.find(uid)
      if ( commandBody != "" ) send(commandBody)
    }

    commandBody = parameterSpace.apply(commandBody, uid).requestParse()
    const command = new Command(commandBody)

    if ( ! command.valid ) return

    console.log("Command:", command)

    if ( command.multiline ) {
      lineRunner = ( line => command.write(line) )
      afterRunner = () => commandRunner(command)
    } else {
      commandRunner(command)
    }
  }

  lines.forEach( line => lineRunner(line) )
  if ( typeof afterRunner == 'function') afterRunner()
})

client.login(process.env.TOKEN)
