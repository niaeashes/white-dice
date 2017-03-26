import RequestAnalyzer from './requestAnalyzer'

String.prototype.requestParse = function() {
  let request = new RequestAnalyzer(this)
  return request.content
}
