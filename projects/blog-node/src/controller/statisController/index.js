const BaseController = require('../baseController')
const weekDetail = require('./weekDetail')
const totalCount = require('./totalCount')
const user = require('./user')

class StatisController extends BaseController {
  constructor() {
    super()
    this.weekDetail = weekDetail.bind(this)
    this.totalCount = totalCount.bind(this)
    this.user = user.bind(this)
  }
}

module.exports = new StatisController()
