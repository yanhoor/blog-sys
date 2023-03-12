const BaseController = require('../baseController')
const commit = require('./commit')
const manageList = require('./manageList')
const commentList = require('./list')
const replyList = require('./replyList')
const deleteComment = require('./delete')
const audit = require('./audit')

class CommentController extends BaseController{
  constructor() {
    super();
    this.commit = commit.bind(this)
    this.manageList = manageList.bind(this)
    this.list = commentList.bind(this)
    this.replyList = replyList.bind(this)
    this.delete = deleteComment.bind(this)
    this.audit = audit.bind(this)
  }
}

module.exports = new CommentController()
