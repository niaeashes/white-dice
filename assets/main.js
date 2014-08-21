//  var s = io.connect(); //リモート
var s = io.connect('http://localhost:3000'); //ローカル

//サーバから受け取るイベント
s.on("connect", function () {
  s.emit("room", {room: $("#room").attr('data-id')});
});  // 接続時
s.on("log", function (data) {
  for ( var i in data ) {
    console.log(data[i])
    addMessage(data[i])
  }
})
s.on("disconnect", function (client) {});  // 切断時
s.on("message", function (data) {
  addMessage(data);
});

$(document).ready(function() {
  var cookies = GetCookies()
  $("#author").val(cookies.author)
  $("#color").val(cookies.color)
  s.emit("log", {room: $("#room").attr('data-id')});
})

function sendMessage() {
  var msg = $("#message").val()
  var author = $("#author").val()
  var color = $("#color").val()
  if ( msg == "" || author == "" ) return;
  if ( ! color.match(/^([a-f0-9]{6}|[a-f0-9]{3})$/i) ) {
    color = Math.ceil((Math.random())*0x999999).toString(16)
    console.log(color)
    $("#color").val(color)
  }
  $("#message").val("");
  document.cookie = "author="+author+"; color="+color+"; path=/room:"+$("#room").attr("data-id")+";"
  document.cookie = "color="+color+"; path=/room:"+$("#room").attr("data-id")+";"
  s.emit("message", {"msg":msg, "author":author, "color":color}); //サーバへ送信
}

//jqueryでメッセージを追加
function addMessage (data) {
  var msg = data.msg.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  var author = data.author.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  var hash = data.hash
  var diceTag = '';
  if ( data.dice ) {
    for ( var i in data.dice) {
      diceTag = diceTag + "<div class='dice'>"+(1+(1*i))+"回目: "+data.dice[i]+"</div>";
    }
  }
  $("#msg-list").prepend("<div class='line'>"+
    "<div class='author' style='color: #"+data.color+"'>"+author+
    "<span class='datetime'>"+data.datetime+"</span>"+
    "<span class='hash'>"+hash+"</span></div>"+
    "<div class='msg'>" + msg + "</div>"+diceTag+"</div>");
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
