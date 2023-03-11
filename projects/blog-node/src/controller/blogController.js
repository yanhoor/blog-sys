const BaseController = require('./baseController')
const prisma = require('../database/prisma')
const redisClient = require('../database/redis')
const dayjs = require("dayjs")

class BlogController extends BaseController{
  // 管理端列表
  manageList = async (ctx, next) => {
    try {
      const requestBody = ctx.request.body
      if(!requestBody) return ctx.body = 500

      let {uid, uname, keyword, status, startTime, endTime, page = 1, pageSize = this.pageSize} = ctx.request.body
      uid = Number(uid)
      status = Number(status)
      const skip = pageSize * (page - 1)
      const filter = { }

      // 作者
      if (uid) filter.createById = uid
      // 作者名
      if (uname) filter.createBy = {
        name: {
          contains: uname
        }
      }

      // 1--已删除
      if (status === 1) {
        filter.deletedAt = { not: null }
      }else if(status === 2){
        // 发布
        filter.deletedAt = null
        filter.launch = 1
      }else if(status === 3){
        // 下架
        filter.launch = 0
        filter.ALL_DATA = true
      }else{
        filter.ALL_DATA = true
      }

      // 关键词
      if (keyword) filter.content = {
        contains: keyword
      }

      // 创建时间
      filter.createdAt = {}
      if(startTime) filter.createdAt.gte = new Date(startTime)
      if(endTime) filter.createdAt.lte = new Date(endTime)

      const [list, total] = await prisma.$transaction([
        prisma.blog.findMany({
          skip,
          take: pageSize,
          where: filter,
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
            createById: true,
            createBy: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            },
            launch: true,
            content: true,
            address: true,
            addressName: true,
            latitude: true,
            longitude: true,
            medias: {
              select: {
                id: true,
                url: true,
                blogId: true,
              }
            }
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
      this.errorLogger.error('blog.manageList--------->', e)
    }
  }

  list = async (ctx, next) => {
    try {
      const requestBody = ctx.request.body
      if(!requestBody) return ctx.body = 500

      let { keyword, startTime, endTime, sort, uid, gid, page = 1, pageSize = this.pageSize } = requestBody
      sort = Number(sort)
      uid = Number(uid)
      gid = Number(gid)
      const skip = pageSize * (page - 1)
      const filter = { launch: 1 }
      let userId = await this.getAuthUserId(ctx, next)
      if(uid) filter.createById = uid
      if (keyword) filter.OR = [
        {
          content: {
            contains: keyword
          }
        }
      ]
      filter.createdAt = {}
      if(startTime) filter.createdAt.gte = new Date(startTime)
      if(endTime) filter.createdAt.lte = new Date(endTime)
      let orderBy = []
      if(sort){
        switch (sort) {
          // 综合排序
          case 1:
            orderBy.push({ updatedAt: 'desc' }, { comments: { _count: 'desc' } }, { likedBy: { _count: 'desc' } }, { collectedBy: { _count: 'desc' } })
            break
          // 最新优先
          case 2:
            orderBy.push({ updatedAt: 'desc' })
            break
          // 最热优先
          case 3:
            orderBy.push({ comments: { _count: 'desc' } }, { comments: { _count: 'desc' } }, { likedBy: { _count: 'desc' } }, { collectedBy: { _count: 'desc' } })
            break
        }
      }else{
        orderBy.push({ updatedAt: 'desc' }, { comments: { _count: 'desc' } })
      }
      if(gid && userId){
        const group = await prisma.followGroup.findUnique({
          where: {
            id: gid
          },
          select: {
            createById: true,
            containUsers: {
              select: {
                id: true
              }
            }
          }
        })
        if(group && group.createById === userId){
          filter.createById = {
            in: group.containUsers.map(item => item.id)
          }
        }else{
          return ctx.body = {
            success: false,
            code: 12,
            msg: '分组不存在'
          }
        }
      }
      const xprisma = prisma.$extends({
        result: {
          blog: {
            // 在返回的结果新增自定义字段
            commentsCount: {
              // 计算这个新字段值需要依赖的真实字段
              needs: { comments: true },
              compute(blog) {
                // 计算获取这个新字段值的逻辑，即从何处来
                const list = blog.comments.filter(item => !item.replyCommentId && !item.deletedAt)
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
            createdAt: true,
            updatedAt: true,
            createById: true,
            launch: true,
            likedByCount: true,
            collectedByCount: true,
            commentsCount: true,
            isLike: true,
            isCollect: true,
            content: true,
            address: true,
            addressName: true,
            latitude: true,
            longitude: true,
            createBy: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            },
            medias: {
              select: {
                id: true,
                url: true,
                blogId: true,
              }
            }
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
    let {medias = [], content, id, address, addressName, latitude, longitude, isPost = 1} = ctx.request.body
    latitude = Number(latitude)
    longitude = Number(longitude)
    let userId = await this.getAuthUserId(ctx, next)
    try {
      if (!content) throw new Error('内容不能为空')
    } catch (e) {
      ctx.body = {
        success: false,
        msg: e.message
      }
      return false
    }

    const newItem = {
      content,
    }
    if(latitude){
      newItem.address = address
      newItem.addressName = addressName
      newItem.latitude = latitude
      newItem.longitude = longitude
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
      // if (blog.launch) {
      //   return ctx.body = {
      //     success: false,
      //     msg: '博客已发布，不能修改'
      //   }
      // }
      try {
        const oldList = await prisma.media.findMany({
          where: {
            blogId: id
          }
        })
        const editList = []
        const addList = []
        medias.forEach(item => {
          item.id ? editList.push(item) : addList.push(item)
        })
        const notList = editList.filter(item => oldList.every(old => old.id !== item.id))
        if(notList.length){
          const notIdList = notList.map(item => item.id)
          return ctx.body = {
            success: false,
            msg: `以下媒体id不存在：${notIdList.toString()}`
          }
        }
        addList.forEach(item => {
          item.createById = userId
        })
        const deleteList = oldList.filter(old => editList.every(item => item.id !== old.id))
        const res = await prisma.blog.update({
          where: {id},
          data: {
            ...newItem,
            medias: {
              updateMany: {
                where: {
                  id: {
                    in: deleteList.map(item => item.id)
                  }
                },
                data: {
                  deletedAt: new Date()
                }
              }
            }
          }
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
        medias.forEach(item => {
          item.createById = userId
        })
        newItem.createById = userId
        if(isPost) newItem.launch = 1
        const res = await prisma.blog.create({
          data: {
            ...newItem,
            medias: {
              create: medias
            }
          },
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            createById: true,
            launch: true,
            content: true,
            address: true,
            addressName: true,
            latitude: true,
            longitude: true,
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
            medias: {
              where: {
                deletedAt: null
              },
              select: {
                id: true,
                url: true
              }
            }
          }
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
    let {id} = ctx.request.body
    id = Number(id)
    let userId = await this.getAuthUserId(ctx, next)
    try {
      const xprisma = prisma.$extends({
        result: {
          blog: {
            // 在返回的结果新增自定义字段
            isLike: {
              // 计算这个新字段值需要依赖的真实字段
              needs: { likedBy: true},
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
            },
            // 在返回的结果新增自定义字段
            commentsCount: {
              // 计算这个新字段值需要依赖的真实字段
              needs: { comments: true },
              compute(blog) {
                // 计算获取这个新字段值的逻辑，即从何处来
                const list = blog.comments.filter(item => !item.replyCommentId && !item.deletedAt)
                return list.length
              },
            },
          },
        },
      })
      const result = await xprisma.blog.findUnique({
        where: {
          id
        },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          launch: true,
          content: true,
          isLike: true,
          likedByCount: true,
          collectedByCount: true,
          commentsCount: true,
          isCollect: true,
          address: true,
          addressName: true,
          latitude: true,
          longitude: true,
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
          },
          medias: {
            where: {
              deletedAt: null
            },
            select: {
              id: true,
              url: true
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
        await prisma.blog.update({
          where: { id },
          data: {
            readBy: {
              // 存在就连接，否则创建
              connectOrCreate: {
                where: {
                  userId_blogId: {
                    userId,
                    blogId: id
                  }
                },
                create: {
                  userId
                }
              }
            }
          }
        })
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
      await prisma.$transaction([
        prisma.blog.update({
          where: {
            id: Number(id)
          },
          data: {
            deletedAt: new Date()
          }
        }),
        prisma.media.updateMany({
          where: {
            blogId: Number(id)
          },
          data: {
            deletedAt: new Date()
          }
        })
      ])

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

        if(Number(userId) !== currentBlog.createById){
          const notification = await prisma.notification.create({
            data: {
              createById: Number(userId),
              receiveUserId: currentBlog.createById,
              type: this.NOTIFICATION_TYPE.like_blog,
              blogId: Number(id),
            }
          })
          this.websocket.sendWsMessage(currentBlog.createById, JSON.stringify({
            type: this.WEBSOCKET_MESSAGE_TYPE.like_blog,
            id: notification.id
          }))
        }
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

  // 点赞/收藏的用户列表
  actionUserList = async (ctx, next) => {
    // type: 1--点赞,2--收藏
    const { blogId, page = 1, pageSize = this.pageSize } = ctx.request.body
    const { type } = ctx.request.params
    const skip = pageSize * (page - 1)
    try{
      if(!blogId) throw new Error('博客id不能为空')
      if(!type) throw new Error('type不能为空')
    }catch(e){
      ctx.body = {
        success: false,
        msg: e.message
      }
      return false
    }

    try {
      let userId = await this.getAuthUserId(ctx, next)
      const blog = await prisma.blog.findUnique({
        where: {
          id: Number(blogId)
        },
        select: {
          likedBy: {
            skip,
            take: pageSize,
            select: {
              userId: true,
            }
          },
          collectedBy: {
            skip,
            take: pageSize,
            select: {
              userId: true,
            }
          }
        }
      })

      const xprisma = prisma.$extends({
        result: {
          user: {
            followersCount: {
              needs: { followers: true },
              compute(result){
                return result.followers.length
              }
            },
            isFollowing: {
              needs: { followers: true },
              compute(result){
                return result.followers.some(u => u.followById === userId)
              }
            }
          }
        }
      })
      let idList = []
      if(Number(type) === 1){
        idList = blog.likedBy.map(i => i.userId)
      }
      if(Number(type) === 2){
        idList = blog.collectedBy.map(i => i.userId)
      }
      const list = await xprisma.user.findMany({
        where: {
          id: {
            in: idList
          }
        },
        select: {
          id: true,
          name: true,
          avatar: true,
          introduce: true,
          followersCount: true,
          isFollowing: true,
        }
      })

      return ctx.body = {
        success: true,
        result: {
          list
        }
      }
    }catch (e) {
      this.errorLogger.error('blog.likeList--------->', e)
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

        if(Number(userId) !== currentBlog.createById){
          const notification = await prisma.notification.create({
            data: {
              createById: Number(userId),
              receiveUserId: currentBlog.createById,
              type: this.NOTIFICATION_TYPE.collect_blog,
              blogId: Number(id),
            }
          })
        }
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
