const BaseController = require('../baseController')
const manageList = require('./manageList')
const postList = require('./list')
const edit = require('./edit')
const manageInfo = require('./manageInfo')
const postInfo = require('./info')
const deletePost = require('./delete')
const audit = require('./audit')
const like = require('./like')
const actionUserList = require('./actionUserList')
const collect = require('./collect')

class BlogController extends BaseController {
  constructor() {
    super()
    this.manageList = manageList.bind(this)
    this.list = postList.bind(this)
    this.edit = edit.bind(this)
    this.manageInfo = manageInfo.bind(this)
    this.info = postInfo.bind(this)
    this.delete = deletePost.bind(this)
    this.audit = audit.bind(this)
    this.like = like.bind(this)
    this.actionUserList = actionUserList.bind(this)
    this.collect = collect.bind(this)
  }
}

module.exports = new BlogController()
