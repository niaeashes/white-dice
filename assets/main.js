var s = io.connect($('#connect').attr('data-url'))

s.on("connect", function () {})
s.on("disconnect", function (client) {})
s.on("log", function (data) {
  for ( var i in data ) { addMessage(data[i], false) }
})
s.on("message", function (data) {
  addMessage(data, true);
});

$(document).ready(function() {
  var cookies = GetCookies()
  $("#author").val(cookies.author)
  $("#color").val(cookies.color)
  $("#audio").attr('checked', cookies.audio == 'true' )
  s.emit("room", {room: $("#room").attr('data-id')})
  s.emit("log", {room: $("#room").attr('data-id')});
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
  var msg = Sanitize(data.msg)
    , author = Sanitize(data.author)
    , hash = data.hash
    , diceTag = ''
  if ( data.dice.length > 0 && now ) { DiceRollSound() }
  for ( var i in data.dice) {
    diceTag = diceTag + "<div class='dice'>"+(1+(1*i))+"回目: "+data.dice[i]+"</div>";
  }
  $("#msg-list").prepend("<div class='line'>"+
    "<div class='author' style='color: #"+data.color+"'>"+author+
    "<span class='datetime'>"+data.datetime+"</span>"+
    "<span class='hash'>"+hash+"</span></div>"+
    "<div class='msg'>" + msg + "</div>"+diceTag+"</div>");
}

function Sanitize(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
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
