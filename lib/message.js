class Message {

  constructor(options = {}) {
    this.rawContent = []
    this.rawOptions = options
  }

  get content() {
    return this.rawContent
  }

  get options() {
    return this.rawOptions
  }

  push(result) {
    if ( typeof result.content == 'string' ) {
      this.rawContent.push(result.content)
    }
    if ( typeof result.fields == 'object' ) {
      if ( typeof this.rawOptions.embed == 'undefined' ) {
        this.rawOptions.embed = {}
      }
      this.rawOptions.embed.fields = ( this.rawOptions.embed.fields || [] ).concat(result.fields)
    }
  }

}

export default Message
