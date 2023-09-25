const mediaFieldExpose = require('./media')
const fileFieldExpose = require('./file')
const topicFieldExpose = require('./topic')
const { blogFieldExpose, blogBaseFieldExpose } = require('./blog')
const commentFieldExpose = require('./comment')
const authorFieldExpose = require('./user')

module.exports = {
  authorFieldExpose,
  blogBaseFieldExpose,
  blogFieldExpose,
  commentFieldExpose,
  mediaFieldExpose,
  topicFieldExpose,
  fileFieldExpose
}
