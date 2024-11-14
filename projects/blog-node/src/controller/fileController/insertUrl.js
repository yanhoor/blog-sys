/*
 * @Author: yanhao yanhao@smallrig.com
 * @Date: 2024-11-13 18:38:51
 * @LastEditors: yanhao yanhao@smallrig.com
 * @LastEditTime: 2024-11-14 11:10:27
 * @FilePath: projects/blog-node/src/controller/fileController/insertUrl.js
 * @Description: 添加外部文件的链接，如阿里云
 */

const prisma = require('../../database/prisma')

module.exports = async function (ctx, next) {
  const req = ctx.request
  const { fileList = [] } = req.body
  // console.log('======upload========', file.size, file.size > 2 * 1024 * 1024)

  let userId = await this.getAuthUserId(ctx, next)
  try {
    if (!userId) throw new Error('未登录')
    fileList.forEach((file) => {
      const { url, md5, fileType } = file
      if (!url) throw new Error('文件 url 不存在')
      if (!md5) throw new Error('文件 md5 不存在')
      if (!fileType) throw new Error('文件类型不存在')
    })
  } catch (e) {
    ctx.body = {
      success: false,
      msg: e.message
    }
    return false
  }

  try {
    const resList = await Promise.all(
      fileList.map((file) => {
        const { url, md5, fileType } = file
        return prisma.file.create({
          data: {
            createById: userId,
            md5,
            url,
            type: fileType
          },
          select: {
            id: true,
            md5: true,
            url: true,
            createById: true
          }
        })
      })
    )
    return (ctx.body = {
      success: true,
      result: resList
    })
  } catch (e) {
    this.errorLogger.error('checkFile--------->', e)
    return (ctx.body = {
      success: false,
      msg: e?.message || e
    })
  }
}
