const authorFieldExpose = require('./user')
const topicFieldExpose = require('./topic')
const mediaFieldExpose = require('./media')

const blogBaseFieldExpose = {
  select: {
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    createById: true,
    status: true,
    content: true,
    address: true,
    addressName: true,
    latitude: true,
    longitude: true,
    createBy: authorFieldExpose,
    medias: mediaFieldExpose,
    topics: topicFieldExpose
  }
}

const blogFieldExpose = {
  select: {
    ...blogBaseFieldExpose.select,
    referenceBlogs: blogBaseFieldExpose,
    retweetOriginBlogId: true,
    retweetOriginBlog: {
      select: {
        ...blogBaseFieldExpose.select,
        _count: {
          select: {
            comments: {
              where: {
                // topCommentId: blogId,
                deletedAt: null,
                status: {
                  notIn: [3, 4]
                }
              }
            },
            referrerBlogs: {
              where: {
                deletedAt: null,
                status: {
                  notIn: [3, 4]
                }
              }
            },
            likedBy: true
          }
        }
      }
    }
  }
}

module.exports = {
  blogBaseFieldExpose,
  blogFieldExpose
}
