const BaseController = require('../baseController')
const notificationList = require('./list')
const count = require('./count')
const nInfo = require('./info')
const read = require('./read')

class NotificationController extends BaseController{
  constructor() {
    super()
    this.list = notificationList.bind(this)
    this.count = count.bind(this)
    this.info = nInfo.bind(this)
    this.read = read.bind(this)
  }
}

module.exports = new NotificationController()
