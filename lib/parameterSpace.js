import fs from 'fs'
import path from 'path'

class ParameterSpace {

  constructor() {
    this.parameters = []
  }

  push(name, parameter) {
    if ( ! this.parameters[name] ) {
      this.parameters[name] = []
    }
    this.parameters[name].push(parameter)
    console.log("Register Parameter:", name, parameter)
  }

  load(name) {
    return this.parameters[name] || []
  }

  apply(str, name) {
    let parameters = this.load(name)
    parameters.forEach(_ => str = str.replace(_.name, _.value))
    return str
  }

}

export default new ParameterSpace()
