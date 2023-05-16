const info = require('./info')
const BaseController = require('../baseController')

class MediaController extends BaseController {
  constructor() {
    super()
    this.info = info.bind(this)
  }
}

module.exports = new MediaController()
