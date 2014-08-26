var dice = require('./dice.js')

String.prototype.isDice = function() {
  return !! dice.hasDice(this)
}

String.prototype.sanitize = function() {
  return this
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

String.prototype.lpad = function(padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
}

String.prototype.br = function() {
  return this.replace(/\n/g, '<br>')
}
