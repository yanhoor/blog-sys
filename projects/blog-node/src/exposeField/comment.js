const authorFieldExpose = require('./user')
const fileFieldExpose = require('./file')

const commonExpose = {
  id: true,
  createdAt: true,
  content: true,
  blogId: true,
  topCommentId: true,
  replyCommentId: true,
  createById: true,
  imageId: true,
  createBy: authorFieldExpose,
  replyTo: authorFieldExpose,
  image: fileFieldExpose
}

module.exports = {
  select: {
    ...commonExpose,
    replyComment: {
      select: {
        ...commonExpose
      }
    }
  }
}
