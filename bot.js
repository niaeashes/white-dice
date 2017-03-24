require('./lib/string.extend.js')
require('./lib/date.extend.js')

var listen = require('./lib/listen')
  , messageParser = require('./lib/messageParser.js')

var Discord = require('discord.js');
var client = new Discord.Client();

client.on('message', function(message) {
  console.log(message);
  data = {
    author: message.author.username,
    msg: message.content
  };
  messageParser(data, function(data) {
    console.log(data);
    if ( data.dice.length == 0 ) return;
    message.channel.sendMessage("Dice: " + data.dice.join(', '));
  });
});

client.login(process.env.TOKEN);
