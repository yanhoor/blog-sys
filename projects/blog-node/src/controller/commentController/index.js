const BaseController = require('../baseController')
const commit = require('./commit')
const manageList = require('./manageList')
const commentList = require('./list')
const info = require('./info')
const replyList = require('./replyList')
const deleteComment = require('./delete')
const audit = require('./audit')
const like = require('./like')

class CommentController extends BaseController {
  constructor() {
    super()
    this.commit = commit.bind(this)
    this.manageList = manageList.bind(this)
    this.list = commentList.bind(this)
    this.info = info.bind(this)
    this.replyList = replyList.bind(this)
    this.delete = deleteComment.bind(this)
    this.audit = audit.bind(this)
    this.like = like.bind(this)
  }
}

module.exports = new CommentController()
