const BaseController = require('../baseController')
const itemList = require('./list')

class TopicController extends BaseController {
  constructor() {
    super()
    this.list = itemList.bind(this)
  }
}

module.exports = new TopicController()
