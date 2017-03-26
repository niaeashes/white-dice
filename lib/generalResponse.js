class GeneralResponse {

  constructor(content, options = {}) {
    this.content = content
    this.options = options
  }

  get fields() {
    return this.options.fields || []
  }

  get hasFields() {
    return this.fields.length != 0
  }

  get nextCommand() {
    return this.options.nextCommand || null
  }

  get hasNextCommand() {
    return !! this.nextCommand
  }

}

export default GeneralResponse
