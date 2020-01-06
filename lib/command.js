var dice = require('./dice.js')
  , md5 = require("md5")

exports.checkLogging = function(msg) {
  return ! exports.hasHelp(msg)
}

exports.applyReplacer = function(data) {
  var commands = [
    exports.runCharacter,
    exports.runFortune,
    exports.runSelect,
  ]
  for ( var i in commands ) { data = commands[i].call(exports, data) }
  return data
}

exports.hasCharacter = function(msg) {
  var characterPattern = /^(\/character).*/ig
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
    "edu": "2d6+6" }
  data.msg = data.msg.replace(exports.hasCharacter(data.msg)[1], '').trim()
  data.multiline = true
  for ( var i in statuses ) {
    data.dice.push(dice.roll(
      statuses[i],
      "**"+i.toUpperCase()+" = (--SUM--) × 5** / *(--FACE--)*"))
  }
  return data
}

exports.buildHash = function(room) {
  return md5(room).substring(8,24)
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
