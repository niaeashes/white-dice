var s = io.connect($('#connect').attr('data-url'))

s.on("connect", function () {})
s.on("disconnect", function (client) {
  addMessage({
    author: 'System',
    msg: 'サーバーがダウンしたかなにかで接続が切れました。リロードしてください。',
    color: 'aaaaaa',
    dice: [],
    datetime: '???',
    hash: ''
  }, true);
})
s.on("log", function (data) { for ( var i in data ) { addMessage(data[i], false) } })
s.on("message", function (data) { addMessage(data, true) })
s.on("title", function(data) { $('title').text(data.title.sanitize()) })

$(document).ready(function() {
  $('textarea').on('keydown', function(event) {
    if (event.keyCode == 13 && ! event.shiftKey) {
      sendMessage()
      return false;
    }
  })
  var cookies = GetCookies()
  $("#author").val(cookies.author)
  $("#color").val(cookies.color)
  $("#audio").attr('checked', cookies.audio == 'true' )
  $(document).on("click", ".copy", function() {
    var text = $(this).text()
    $("#message").val(text).focus()
  })
  s.emit("room", {room: $("#room").attr('data-id')})
})

function sendMessage() {
  var msg = $("#message").val()
  var author = $("#author").val()
  var color = $("#color").val()
  if ( msg == "" || author == "" ) return;
  if ( ! color.match(/^([a-f0-9]{6}|[a-f0-9]{3})$/i) ) {
    color = Math.ceil((Math.random())*0x999999).toString(16)
    $("#color").val(color)
  }
  $("#message").val("");
  SetCookies({author: author, color: color, audio: $("#audio").is(':checked')})
  s.emit("message", {"msg":msg, "author":author, "color":color});
}

function addMessage (data, now) {
  var msg = data.msg.sanitize().br()
    , author = data.author.sanitize()
    , hash = data.hash
    , diceTag = ''
  if ( data.dice.length > 0 && now ) { DiceRollSound() }
  for ( var i in data.dice) {
    var diceFace = data.dice[i].sanitize()
      .strong('[', ']')
      .color('Success!', '1aa565')
      .color('Finish!', '1aa565')
      .color('Critical!', '1a6da5')
      .color('効果的成功', '1aa565')
      .color('成功', '1aa565')
      .color('Failure...', 'b51d3b')
      .color('致命的失敗', 'b51d3b')
      .color('失敗', 'b51d3b')
      .copyTag()
    if ( data.secret ) { diceFace = '[ 秘密のダイス ]' }
    diceTag = diceTag + "<div class='dice'>"+(1+(1*i))+": (ｺﾛｺﾛ…) "+diceFace+"</div>";
  }
  $("#msg-list").prepend("<div class='line'>"+
    "<div class='author' style='color: #"+data.color+"'>"+author+
    "<span class='datetime'>"+data.datetime+"</span>"+
    "<span class='hash'>"+hash+"</span></div>"+
    "<div class='msg'>" + msg + "</div>"+diceTag+"</div>");
}

String.prototype.sanitize = function() {
  return this
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

String.prototype.strong = function(start, stop) {
  return this.replace(new RegExp(escapeRegExp(start), 'g'), '<strong>'+start).replace(new RegExp(escapeRegExp(stop), 'g'), stop+'</strong>')
}

String.prototype.br = function() {
  return this.replace(/\n/g, '<br>')
}

String.prototype.color = function(target, color) {
  return this.replace(target, "<span style='color: #"+color.sanitize()+"'>"+target+"</span>")
}

String.prototype.copyTag = function() {
  return this.replace('{', '<span class="copy">').replace('}', '</span>')
}

function escapeRegExp(str) {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function DiceRollSound() {
  if ( ! $("#audio").is(':checked') ) { return }
  var audio = new Audio("/nc42339.wav")
  audio.volume = 0.2;
  audio.play()
}

function SetCookies(data) {
  for ( var i in data ) {
    document.cookie = i+"="+encodeURIComponent(data[i])+"; path=/room:"+$("#room").attr("data-id")+";"
  }
}

function GetCookies() {
  var result = {};
  var allcookies = document.cookie;
  if ( allcookies != '' )
  {
    var cookies = allcookies.split( ';' );
    for ( var i = 0; i < cookies.length; i++ )
    {
      var cookie = cookies[ i ].split( '=' );
      result[ cookie[0].trim() ] = decodeURIComponent( cookie[1] );
    }
  }
  return result;
} 
