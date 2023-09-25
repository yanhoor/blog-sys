const BaseController = require('../baseController')
const itemList = require('./list')
const manageList = require('./manageList')

class TopicController extends BaseController {
  constructor() {
    super()
    this.list = itemList.bind(this)
    this.manageList = manageList.bind(this)
  }
}

module.exports = new TopicController()
