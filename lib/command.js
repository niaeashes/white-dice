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
  if ( exports.hasCharacter(data.msg) ) { data = exports.runCharacter(data) }
  else if ( exports.hasSecret(data.msg) ) { data = exports.runSecret(data) }
  else if ( exports.hasTo(data.msg) ) { data = exports.runTo(data) }
  else if ( exports.hasFortune(data.msg) ) { data = exports.runFortune(data) }
  else if ( exports.hasName(data.msg) ) { data = exports.runName(data) }
  else if ( exports.hasHelp(data.msg) ) { data = exports.runHelp(data) }
  return data
}

exports.hasCharacter = function(msg) {
  var characterPattern = /^(\/character).+/ig
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
  data.author = "System"
  data.color = "AAAAAA"
  data.msg = "ヘルプ\n"+
    "ダイスロール\n"+
    "d100 => 100面ダイスを1個振る\n"+
    "2d100 => 100面ダイスを2個振って合計を出す\n"+
    "2rd100 => 100面ダイスを1個振ることを2回繰り返す\n"+
    "d4+d6 => 4面ダイスの出目と6面ダイスの出目を合計する\n"+
    "s75 => 75% の技能ロール \"s75 目星\" みたいにコメントを付けても動作する\n"+
    "\n"+
    "メッセージ・ダイスの他に、コマンドを入力することで、いろいろな追加機能を利用することができます。\n"+
    "/title (任意の文字列) ... タイトルを配信します。リロードするとリセットされます。\n"+
    "/character (キャラクター名) ... ステータスロールを行ないます。ログにも残ります。\n"+
    "/fortune ... おみくじを引きます。\n"+
    "/secret ... ダイスの出目を隠します。リロードすると見えなくなります。ログでは正常に見れます。\n"+
    "/name (名前) (発言内容)... その発言のみ名前を変更します。\n"+
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

exports.hasName = function(msg) {
  return msg.match(/^\/name?[\s　][^\s]+[\s　]/i)
}

exports.runName = function(data) {
  var newName = (/^\/name[\s　]([^\s]+)[\s　]/i).exec(data.msg)[1]
  data.msg = data.msg.replace(/^\/name\s[^\s]+\s/i, '')
  data.author = newName+" ("+data.author+")"
  return data
}
