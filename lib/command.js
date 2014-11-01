var dice = require('./dice.js')
  , md5 = require("MD5")

exports.checkLogging = function(msg) {
  return ! exports.hasHelp(msg)
}

exports.hasTitle = function (msg) {
  var titlePattern = /^\/title(.+)$/ig
  return titlePattern.exec(msg)
}

exports.applyReplacer = function(data) {
  var commands = [ exports.runCharacter
  , exports.runSecret
  , exports.runTo
  , exports.runFortune
  , exports.runSelect
  , exports.runName
  , exports.runHelp
  ]
  for ( var i in commands ) { data = commands[i].call(exports, data) }
  return data
}

exports.hasCharacter = function(msg) {
  var characterPattern = /^(\/character).+/ig
  return characterPattern.exec(msg)
}

exports.runCharacter = function(data) {
  if ( ! exports.hasCharacter(data.msg) ) { return data }
  var statuses = {
    "str": "3D6",
    "dex": "3D6",
    "app": "3D6",
    "con": "3D6",
    "pow": "3D6",
    "int": "2D6+6",
    "siz": "2D6+6",
    "edu": "3d6+3" }
  data.msg = data.msg.replace(exports.hasCharacter(data.msg)[1], '').trim()
  for ( var i in statuses ) {
    data.dice.push(dice.roll(
      statuses[i],
      "[ "+i.toUpperCase()+" : (--SUM--) ] (--FACE--)"))
  }
  return data
}

exports.hasSecret = function(msg) {
  return !! msg.match(/^\/(secret|hidden)/ig)
}

exports.runSecret = function(data) {
  if ( ! exports.hasSecret(data.msg) ) { return data }
  data.msg = data.msg.replace(/^\/(secret|hidden)\s/i, '')
  data.secret = true
  return data
}

exports.hasTo = function(msg) {
  return !! msg.match(/^\/to\s[0-9a-f]{16}/i)
}

exports.buildHash = function(room) {
  return md5(room).substring(8,24)
}

exports.runTo = function(data) {
  if ( ! exports.hasTo(data.msg) ) { return data }
  var target = (/^\/to\s([0-9a-f]{16})/i).exec(data.msg)[1]
  data.msg = data.msg.replace(/^\/to\s([0-9a-f]{16})/i, '')
  data.to = function(socket, sockets) {
    console.log(sockets)
    for ( var i = 0; i < sockets.length; i++ ) {
      if ( exports.buildHash(sockets[i].rooms[0]) == target ) {
        return sockets[i].rooms[0]
      }
    }
    return socket.rooms[1]
  }
  return data
}

exports.hasHelp = function(msg) {
  var helpPattern = /^\/help/ig
  return helpPattern.exec(msg)
}

exports.runHelp = function (data) {
  if ( ! exports.hasHelp(data.msg) ) { return data }
  data.author = "System"
  data.color = "AAAAAA"
  data.msg = "ヘルプ\n"+require('fs').readFileSync('./files/help.txt')
  return data
}

exports.hasFortune = function (msg) {
  var fortunePattern = /^\/fortune/ig
  return fortunePattern.exec(msg)
}

exports.runFortune = function (data) {
  if ( ! exports.hasFortune(data.msg) ) { return data }
  var result = 1*dice.roll("d12", '(--SUM--)')
    , list = ['大凶', '凶', '凶', '小吉', '小吉', '中吉', '中吉', '中吉', '吉', '吉', '大吉', '大吉']
  data.msg = "おみくじを引きました"
  data.dice.push('D12: '+result+' [ '+(list[result-1])+' ]')
  return data
}

exports.runSelect = function (data) {
  if ( ! data.msg.match(/^\/select[\s　](?:(?:[^\s\n　]+)[\s\n　]?)+$/ig) ) { return data }
  var listString = data.msg.replace(/^\/select[\s　]/gi, '').replace(/[　\t\n]/g, ' ')
    , list = listString.split(' ')
    , result = 1*dice.roll('d'+list.length, '(--SUM--)')
  data.msg = data.msg.replace(/^\/select[\s　]/gi, 'ランダムに選択: ')
  console.log(list)
  data.dice.push('D'+list.length+': '+result+' [ 結果: '+list[result-1]+" ]")
  return data
}

exports.hasName = function(msg) {
  return msg.match(/^\/name?[\s　][^\s]+[\s　]/i)
}

exports.runName = function(data) {
  if ( ! exports.hasName(data.msg) ) { return data }
  var newName = (/^\/name[\s　]([^\s]+)[\s　]/i).exec(data.msg)[1]
  data.msg = data.msg.replace(/^\/name\s[^\s]+\s/i, '')
  data.author = newName+" ("+data.author+")"
  return data
}
