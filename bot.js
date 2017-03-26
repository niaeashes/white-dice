import "./lib/string.extend"
import "./lib/array.extend"

import Discord from 'discord.js';
import Command from './lib/command'
import DiscordMessage from './lib/discordMessage'
import NextRollContainer from './lib/nextRollContainer'

const SPACES_PATTERN = /(\s|\t|\u3000|\uA0|[\u2002-\u200B])/

let client = new Discord.Client()
let nextRolls = new NextRollContainer()

client.on('message', function(message) {
  if ( message.author.bot ) return;

  const lines = message.content.split(/\n/)
  const uid = `${message.channel.id}.#{message.author.id}`

  lines.forEach((line) => {

    let commandBody = line.split(SPACES_PATTERN, 2)[0].requestParse()
    if ( !! commandBody.match(/^p(ush)?/) ) {
      commandBody = nextRolls.find(uid)
      message.channel.send(commandBody)
    }
    let command = new Command(commandBody)

    if ( ! command.valid ) return

    let newMessage = new DiscordMessage()
    command.targets.forEach(targetCommand => {
      let response = targetCommand.run()
      newMessage.push(response)
      nextRolls.register(uid, response.nextCommand)
    })

    message.channel.send(newMessage.content, newMessage.options)
      .then((doc) => {
        console.log("Done: ", newMessage)
      })
      .catch((err) => {
        console.log("Error: ", newMessage, err)
      })

  })

  return
  message.channel.send("", {
    embed: {
      title: "Title",
      description: "This is a description",
      url: "https://nianote.com",
      timestamp: ( new Date() ),
      color: 456789,
      fields: [
        { name: "Field A", value: "Value", inline: true },
        { name: "Field B", value: "Value", inline: true },
        { name: "Field C", value: "Value", inline: true }
      ],
      footer: {
        text: "Footer Text",
        title: "Title",
        icon_url: "https://pbs.twimg.com/profile_images/749831918766608384/SkVxv_2A.jpg"
      },
      author: {
        name: "Nia",
        icon_url: "https://pbs.twimg.com/profile_images/749831918766608384/SkVxv_2A.jpg"
      },
      image: {
        url: "https://pbs.twimg.com/profile_images/749831918766608384/SkVxv_2A.jpg"
      }
    },
    disableEveryone: true
  })
  .then(function(doc) {
    console.log("Response:", doc);
  })
  .catch(function(err) {
    console.log("Response:", err);
  })
});

client.login(process.env.TOKEN);
