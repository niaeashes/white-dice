Date.prototype.toStringTime = function() {
  return this.getHours().toString().lpad('0', 2)+
    ":"+this.getMinutes().toString().lpad('0', 2)
}

Date.prototype.toStringDateHour = function() {
  return (this.getMonth()+1)+"/"+this.getDate()+" "+this.getHours()+"時"
}
