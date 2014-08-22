var dice = require('./dice.js')

exports.checkLogging = function(msg) {
  return ! exports.hasHelp(msg)
}

exports.hasTitle = function (msg) {
  var titlePattern = /^\/title:(.+)$/ig
  return titlePattern.exec(msg)
}

exports.applyReplacer = function(data) {
  if ( exports.hasCharacter(data.msg) ) { data = exports.runCharacter(data) }
  else if ( exports.hasFortune(data.msg) ) { data = exports.runFortune(data) }
  else if ( exports.hasHelp(data.msg) ) { data = exports.runHelp(data) }
  return data
}

exports.hasCharacter = function(msg) {
  var characterPattern = /^(\/character:\s*).+/ig
  return characterPattern.exec(msg)
}

exports.runCharacter = function(data) {
  var statuses = {
    "str": "3D6",
    "dex": "3D6",
    "app": "3D6",
    "con": "3D6",
    "pow": "3D6",
    "int": "2D6+6",
    "siz": "2D6+6",
    "edu": "3d6+3" }
  data.msg = data.msg.replace(exports.hasCharacter(data.msg)[1], '')
  for ( var i in statuses ) {
    data.dice.push(dice.roll(
      statuses[i],
      "[ "+i.toUpperCase()+" : (--SUM--) ] (--FACE--)"))
  }
  return data
}

exports.hasHelp = function(msg) {
  var helpPattern = /^\/help/ig
  return helpPattern.exec(msg)
}

exports.runHelp = function (data) {
  data.msg = "ヘルプ\n"+
    "メッセージ・ダイスの他に、コマンドを入力することで、いろいろな追加機能を利用することができます。\n"+
    "/title:(任意の文字列) ... タイトルを配信します。リロードするとリセットされます。\n"+
    "/character:(キャラクター名) ... ステータスロールを行ないます。ログにも残ります。\n"+
    "/fortune ... おみくじを引きます。\n"+
    "/help ... このメッセージを表示します。\n"+
    "※ このメッセージはログに残りません。"
  return data
}

exports.hasFortune = function (msg) {
  var fortunePattern = /^\/fortune/ig
  return fortunePattern.exec(msg)
}

exports.runFortune = function (data) {
  var result = 1*dice.roll("d12", '(--SUM--)')
    , list = ['大凶', '凶', '凶', '小吉', '小吉', '中吉', '中吉', '中吉', '吉', '吉', '大吉', '大吉']
  data.msg = "おみくじを引きました"
  data.dice.push('D12: '+result+' [ '+(list[result-1])+' ]')
  return data
}
