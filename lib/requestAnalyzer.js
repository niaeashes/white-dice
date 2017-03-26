class RequestAnalyzer {

  constructor(raw, options = { autoparse: true }) {
    this.raw = raw
    this.content = null
    if ( options.autoparse ) {
      this.parse()
    }
  }

  parse() {
    this.content = this.raw
      .replace(/・/g, '/')
      .replace(/[！-～]/g, (tmp) => String.fromCharCode( tmp.charCodeAt(0) - 0xFEE0 ))
      .replace(/(\u3000|\uA0|[\u2002-\u200B])/g, ' ')
      .replace(/\s\s+/g, ' ')
  }
}

export default RequestAnalyzer
