const fileFieldExpose = require('./file')
module.exports = {
  select: {
    id: true,
    blogId: true,
    fileId: true,
    file: fileFieldExpose,
    coverId: true,
    cover: fileFieldExpose
  }
}
