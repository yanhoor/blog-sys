const BaseController = require('../baseController')
const edit = require('./edit')
const groupList = require('./list')
const all = require('./all')
const sort = require('./sort')
const groupInfo = require('./info')
const deleteGroup = require('./delete')
const containList = require('./containList')

class FollowGroupController extends BaseController {
  constructor() {
    super()
    this.edit = edit.bind(this)
    this.list = groupList.bind(this)
    this.all = all.bind(this)
    this.sort = sort.bind(this)
    this.info = groupInfo.bind(this)
    this.delete = deleteGroup.bind(this)
    this.containList = containList.bind(this)
  }
}

module.exports = new FollowGroupController()
