import "./lib/string.extend"
import "./lib/array.extend"

import Discord from 'discord.js';
import Command from './lib/command'
import Message from './lib/message'

const SPACES_PATTERN = /(\s|\t|\u3000|\uA0|[\u2002-\u200B])/

let client = new Discord.Client();

client.on('message', function(message) {
  if ( message.author.bot ) return;

  const lines = message.content.split(/\n/)

  lines.forEach((line) => {

    const commandBody = line.split(SPACES_PATTERN, 2)[0]
    let command = new Command(commandBody.requestParse())
    if ( ! command.valid ) return

    let newMessage = new Message()
    command.targets.forEach(targetCommand => {
      newMessage.push(targetCommand.run())
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
