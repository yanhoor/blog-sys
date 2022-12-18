const BaseController = require('./baseController')
const prisma = require('../database/prisma')
const redisClient = require('../database/redis')
const dayjs = require("dayjs")

class BlogController extends BaseController{
  // 管理端列表
  manageList = async (ctx, next) => {
    const {title, createById, page = 1, pageSize = this.pageSize} = ctx.request.body
    const skip = pageSize * (page - 1)
    const filter = {}
    if (title) filter.title = {contains: title}
    if (createById) filter.createById = createById
    try {
      const [list, total] = await prisma.$transaction([
        prisma.blog.findMany({
          skip,
          take: pageSize,
          where: filter,
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            launch: true,
            createBy: {
              select: {
                id: true,
                name: true
              }
            },
            cate: {
              select: {
                id: true,
                name: true
              }
            },
            title: true
          },
          orderBy: {updatedAt: 'desc'}
        }),
        prisma.blog.count({where: filter})
      ])

      return ctx.body = {
        success: true,
        result: {
          list,
          total
        }
      }
    } catch (e) {
      this.errorLogger.error('blog.list--------->', e)
    }
  }

  list = async (ctx, next) => {
    try {
      let { keyword, time, sort, uid, page = 1, pageSize = this.pageSize } = ctx.request.body
      sort = sort?.toString()
      const skip = pageSize * (page - 1)
      const filter = { launch: 1 }
      if(uid) filter.createById = Number(uid)
      if (keyword) filter.OR = [
        {
          title: {
            contains: keyword
          }
        },
        {
          content: {
            contains: keyword
          }
        }
      ]
      if(time){
        let timeRange
        switch (time) {
          case '0':
            timeRange = undefined
            break
          case '1':
            const start = dayjs().subtract(24, 'h')
            const lte = new Date()
            timeRange = {
              gte: new Date(start),
              lte
            }
            break
          case '2':
            timeRange = this.createTimeRange(7, 0)
            break
          case '3':
            timeRange = this.createTimeRange(90, 0)
            break
        }
        filter.createdAt = timeRange
      }
      let orderBy = []
      if(sort){
        switch (sort) {
          // 综合排序
          case '1':
            orderBy.push({ updatedAt: 'desc' }, { comments: { _count: 'desc' } })
            break
          // 最新优先
          case '2':
            orderBy.push({ updatedAt: 'desc' })
            break
          // 最热优先
          case '3':
            orderBy.push({ comments: { _count: 'desc' } })
            break
        }
      }else{
        orderBy.push({ updatedAt: 'desc' }, { comments: { _count: 'desc' } })
      }
      let userId = await this.getAuthUserId(ctx, next)
      const xprisma = prisma.$extends({
        result: {
          blog: {
            // 在返回的结果新增自定义字段
            commentsCount: {
              // 计算这个新字段值需要依赖的真实字段
              needs: { comments: true },
              compute(blog) {
                // 计算获取这个新字段值的逻辑，即从何处来
                const list = blog.comments.filter(item => !item.replyCommentId)
                return list.length
              },
            },
            likedByCount: {
              needs: { likedBy: true },
              compute(blog) {
                return blog.likedBy.length
              },
            },
            isLike: {
              needs: { likedBy: true },
              compute(blog) {
                return blog.likedBy.some(item => item.userId == userId)
              },
            },
            collectedByCount: {
              needs: { collectedBy: true },
              compute(blog) {
                return blog.collectedBy.length
              },
            },
            isCollect: {
              needs: { collectedBy: true },
              compute(blog) {
                return blog.collectedBy.some(item => item.userId == userId)
              },
            }
          },
        },
      })
      const [list, total] = await prisma.$transaction([
        xprisma.blog.findMany({
          skip,
          take: pageSize,
          where: filter,
          select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true,
            launch: true,
            likedByCount: true,
            collectedByCount: true,
            commentsCount: true,
            isLike: true,
            isCollect: true,
            cate: {
              select: {
                id: true,
                name: true
              }
            },
            createBy: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            },
          },
          orderBy
        }),
        prisma.blog.count({ where: filter })
      ])

      return ctx.body = {
        success: true,
        result: {
          list,
          total
        }
      }

    } catch (e) {
      this.errorLogger.error('blog.list2--------->', e)
    }
  }

  edit = async (ctx, next) => {
    const {title, content, cateId, id, isPost = 0} = ctx.request.body
    let userId = await this.getAuthUserId(ctx, next)
    try {
      if (!title) throw new Error('标题不能为空')
      if (!content) throw new Error('内容不能为空')
    } catch (e) {
      ctx.body = {
        success: false,
        msg: e.message
      }
      return false
    }

    const newItem = {
      title,
      content,
      cateId
    }
    if (id) {
      const blog = await prisma.blog.findUnique({
        where: {id}
      })
      if (!blog) {
        return ctx.body = {
          success: false,
          msg: '博客不存在'
        }
      }
      if (blog.launch) {
        return ctx.body = {
          success: false,
          msg: '博客已发布，不能修改'
        }
      }
      try {
        const res = await prisma.blog.update({
          where: {id},
          data: newItem
        })
        return ctx.body = {
          success: true,
          result: res
        }
      } catch (e) {
        this.errorLogger.error('blog.update--------->', e)
      }
    } else {
      try {
        newItem.createById = userId
        if(isPost) newItem.launch = 1
        const res = await prisma.blog.create({
          data: newItem
        })
        // 创建博客数递增
        await redisClient.zIncrBy(this.REDIS_KEY_PREFIX.BLOG_CREATE_RANKING, 1, userId.toString())
        return ctx.body = {
          success: true,
          result: res
        }
      } catch (e) {
        this.errorLogger.error('blog.create--------->', e)
      }
    }
  }

  manageInfo = async (ctx, next) => {
    return this.info(ctx, next, true)
  }

  info = async (ctx, next, isManage = false) => {
    const {id} = ctx.request.body
    let userId = await this.getAuthUserId(ctx, next)
    try {
      const xprisma = prisma.$extends({
        result: {
          blog: {
            // 在返回的结果新增自定义字段
            isLike: {
              // 计算这个新字段值需要依赖的真实字段
              needs: { title: true, likedBy: true},
              compute(blog) {
                // 计算获取这个新字段值的逻辑，即从何处来
                return blog.likedBy.some(item => item.userId == userId)
              },
            },
            likedByCount: {
              needs: { likedBy: true },
              compute(blog) {
                return blog.likedBy.length
              },
            },
            collectedByCount: {
              needs: { collectedBy: true },
              compute(blog) {
                return blog.collectedBy.length
              },
            },
            isCollect: {
              needs: { collectedBy: true },
              compute(blog) {
                return blog.collectedBy.some(item => item.userId == userId)
              },
            }
          },
        },
      })
      const result = await xprisma.blog.findUnique({
        where: {
          id: Number(id)
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          launch: true,
          content: true,
          isLike: true,
          likedByCount: true,
          collectedByCount: true,
          isCollect: true,
          cate: {
            select: {
              id: true,
              name: true
            }
          },
          createById: true,
          createBy: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      })

      if(!result || (!isManage && result.launch === 0)){
        return ctx.body = {
          success: false,
          code: 1,
          msg: '博客不存在'
        }
      }

      const num = await redisClient.sCard(this.REDIS_KEY_PREFIX.READ_BLOG_USER + id)
      result.readCount = num

      if(userId) {
        const isRead = await redisClient.sIsMember(this.REDIS_KEY_PREFIX.READ_BLOG_USER + id, userId.toString())
        if(!isRead){
          // 当前用户未读，记录阅读数
          await redisClient.zIncrBy(this.REDIS_KEY_PREFIX.BLOG_READ_RANKING, 1, id.toString())
        }
        // 记录已读用户
        await redisClient.sAdd(this.REDIS_KEY_PREFIX.READ_BLOG_USER + id, userId.toString())
      }
      await redisClient.hSet(this.REDIS_KEY_PREFIX.EVERY_BLOG_READ_USER + result.createById, id, num)

      return ctx.body = {
        success: true,
        result
      }
    } catch (e) {
      this.errorLogger.error('blog.info--------->', e)
    }
  }

  delete = async (ctx, next) => {
    const {id} = ctx.request.body
    try {
      await prisma.blog.update({
        where: {
          id: Number(id)
        },
        data: {
          deletedAt: new Date()
        }
      })

      return ctx.body = {
        success: true
      }
    } catch (e) {
      this.errorLogger.error('blog.delete--------->', e)
    }
  }

  // 发布/取消发布
  operate = async (ctx, next) => {
    const {id, launch} = ctx.request.body
    try {
      if (launch === undefined) throw new Error('缺少参数 launch')
    } catch (e) {
      return ctx.body = {
        success: false,
        msg: e.message
      }
    }

    try {
      const blog = await prisma.blog.findUnique({
        where: {id}
      })
      if (!blog) {
        return ctx.body = {
          success: false,
          msg: '博客不存在'
        }
      }
      const t = new Date()
      await prisma.blog.update({
        where: {
          id: Number(id)
        },
        data: {
          operateAt: t,
          launch
        }
      })

      return ctx.body = {
        success: true
      }
    } catch (e) {
      this.errorLogger.error('blog.operate--------->', e)
    }
  }

  // 点赞博客
  like = async (ctx, next) => {
    const { id, isLike } = ctx.request.body
    let userId = await this.getAuthUserId(ctx, next)
    try{
      if(!id) throw new Error('博客id不能为空')
      if(!userId) throw new Error('用户未登录')
      if(isLike === undefined) throw new Error('isLike不能为空')
    }catch(e){
      ctx.body = {
        success: false,
        msg: e.message
      }
      return false
    }

    let currentBlog
    try{
      currentBlog = await prisma.blog.findUnique({
        where: { id }
      })
      if(isLike){
        await prisma.blog.update({
          where: { id },
          data: {
            likedBy: {
              create: [
                // 创建 UserLikeBlogs
                {
                  user: {
                    // 连接到操作的 user
                    connect: {
                      id: userId
                    }
                  }
                }
              ]
            }
          }
        })

        await redisClient.sAdd(this.REDIS_KEY_PREFIX.LIKE_BLOG_USER + id, userId.toString())

        const notification = await prisma.notification.create({
          data: {
            createById: Number(userId),
            receiveUserId: currentBlog.createById,
            content: JSON.stringify({
              type: 'like_blog',
              blogId: Number(id),
            })
          }
        })
        this.websocket.sendWsMessage(currentBlog.createById, JSON.stringify({
          type: this.WEBSOCKET_MESSAGE_TYPE.like_blog,
          id: notification.id
        }))
      }else{
        // 这样好像也可以
        // await prisma.userLikeBlogs.delete({
        //   where: {
        //     userId_blogId: {
        //       userId,
        //       blogId: id
        //     }
        //   }
        // })
        await prisma.blog.update({
          where: { id },
          data: {
            likedBy: {
              delete: [
                // 删除相关 UserLikeBlogs
                {
                  userId_blogId: {
                    userId,
                    blogId: id
                  }
                }
              ]
            }
          }
        })

        await redisClient.sRem(this.REDIS_KEY_PREFIX.LIKE_BLOG_USER + id, userId.toString())
      }

      // 更新被点赞数
      const num = await redisClient.sCard(this.REDIS_KEY_PREFIX.LIKE_BLOG_USER + id)
      await redisClient.zAdd(this.REDIS_KEY_PREFIX.BLOG_LIKE_RANKING, { score: num, value: id.toString() })
      await redisClient.hSet(this.REDIS_KEY_PREFIX.EVERY_BLOG_LIKE_USER + currentBlog.createById, id, num)
      return ctx.body = {
        success: true
      }
    }catch (e) {
      this.errorLogger.error('blog.like--------->', e)
    }
  }

  // 收藏
  collect = async (ctx, next) => {
    const { id, isCollect } = ctx.request.body
    let userId = await this.getAuthUserId(ctx, next)
    try{
      if(!id) throw new Error('博客id不能为空')
      if(!userId) throw new Error('用户未登录')
      if(isCollect === undefined) throw new Error('isCollect不能为空')
    }catch(e){
      ctx.body = {
        success: false,
        msg: e.message
      }
      return false
    }

    let currentBlog
    try{
      currentBlog = await prisma.blog.findUnique({
        where: { id }
      })
      if(isCollect){
        await prisma.blog.update({
          where: { id },
          data: {
            collectedBy: {
              create: [
                // 创建 UserLikeBlogs
                {
                  user: {
                    // 连接到操作的 user
                    connect: {
                      id: userId
                    }
                  }
                }
              ]
            }
          }
        })

        await redisClient.sAdd(this.REDIS_KEY_PREFIX.COLLECT_BLOG_USER + id, userId.toString())

        const notification = await prisma.notification.create({
          data: {
            createById: Number(userId),
            receiveUserId: currentBlog.createById,
            content: JSON.stringify({
              type: 'collect_blog',
              blogId: Number(id),
            })
          }
        })
      }else{
        // 这样好像也可以
        // await prisma.userLikeBlogs.delete({
        //   where: {
        //     userId_blogId: {
        //       userId,
        //       blogId: id
        //     }
        //   }
        // })
        await prisma.blog.update({
          where: { id },
          data: {
            collectedBy: {
              delete: [
                // 删除相关 UserLikeBlogs
                {
                  userId_blogId: {
                    userId,
                    blogId: id
                  }
                }
              ]
            }
          }
        })

        await redisClient.sRem(this.REDIS_KEY_PREFIX.COLLECT_BLOG_USER + id, userId.toString())
      }

      // 更新被收藏数
      const num = await redisClient.sCard(this.REDIS_KEY_PREFIX.COLLECT_BLOG_USER + id)
      await redisClient.zAdd(this.REDIS_KEY_PREFIX.BLOG_COLLECT_RANKING, { score: num, value: id.toString() })
      await redisClient.hSet(this.REDIS_KEY_PREFIX.EVERY_BLOG_COLLECT_USER + currentBlog.createById, id, num)

      return ctx.body = {
        success: true
      }
    }catch (e) {
      this.errorLogger.error('blog.collect--------->', e)
    }
  }
}

module.exports = new BlogController()
