class DiscordMessage {

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

  /**
   * @param GeneralResponse response
   */
  push(response) {
    if ( typeof response.content == 'string' ) {
      this.rawContent.push(response.content)
    }
    if ( response.hasFields || response.hasNextCommand ) {
      this.rawOptions.embed = this.rawOptions.embed || {}
    }
    if ( response.hasFields ) {
      this.rawOptions.embed.fields = ( this.rawOptions.embed.fields || [] ).concat(response.fields)
    }
    if ( response.hasNextCommand ) {
      this.rawOptions.embed.description = `追加ロール: \`${response.nextCommand}\``
    }
  }

}

export default DiscordMessage
