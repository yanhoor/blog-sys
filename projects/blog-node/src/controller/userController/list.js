const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function (ctx, next) {
  const {name, mobile, page = 1, pageSize = this.pageSize} = ctx.request.body
  const skip = pageSize * (page - 1)
  const filter = { type: 2 }
  if (name) filter.name = {contains: name}
  if (mobile) filter.mobile = mobile
  try {
    const xprisma = prisma.$extends({
      result: {
        user: {
          // 在返回的结果新增自定义字段
          blogCount: {
            // 计算这个新字段值需要依赖的真实字段
            needs: { blogs: true },
            compute(user) {
              // 计算获取这个新字段值的逻辑，即从何处来
              return user.blogs.length
            },
          },
          likeBlogCount: {
            needs: { likeBlogs: true },
            compute(blog) {
              return blog.likeBlogs.length
            },
          }
        },
      },
    })

    const [list, total] = await prisma.$transaction([
      xprisma.user.findMany({
        skip,
        take: pageSize,
        where: filter,
        select: {
          id: true,
          createdAt: true,
          lastActiveAt: true,
          name: true,
          avatar: true,
          introduce: true,
          mobile: true,
          birthday: true,
          blogCount: true,
          lock: true,
          likeBlogCount: true,
        },
        orderBy: {createdAt: 'desc'}
      }),
      prisma.user.count({where: filter})
    ])

    return ctx.body = {
      success: true,
      result: {
        list,
        total
      }
    }
  } catch (e) {
    this.errorLogger.error('user.list--------->', e)
  }
}
