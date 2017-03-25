require('./lib/string.extend.js')
require('./lib/date.extend.js')

var listen = require('./lib/listen')
  , messageParser = require('./lib/messageParser.js')
  , parameterSpace = require('./lib/parameterSpace.js')

var Discord = require('discord.js');
var client = new Discord.Client();

client.on('message', function(message) {
  console.log(message);
  data = {
    author: message.author.username,
    msg: message.content,
    usedParameters: []
  };
  var loadedParameter = parameterSpace.load(message.author.username);
  if ( loadedParameter ) {
    data.parameters = loadedParameter.parameters;
  }
  messageParser(data, function(data) {
    console.log(data);
    if ( data.dice.length == 0 ) return;
    var msg = data.dice;
    if ( data.usedParameters.length > 0 ) {
      msg.push('')
    }
    for ( var i in data.usedParameters ) {
      var parameter = data.usedParameters[i]
      msg.push(parameter.name+": "+parameter.value);
    }
    for ( var i in msg ) {
      message.channel.sendMessage(msg[i])
        .then(function(err, doc) {
          console.log("Response:", err, doc);
        })
    }
  });
});

client.login(process.env.TOKEN);
