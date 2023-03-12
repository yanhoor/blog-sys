const BaseController = require('./baseController')
const prisma = require('../database/prisma')
const jsonwebtoken = require('jsonwebtoken')
const redisClient = require('../database/redis')
const path = require("path")
const config = require('config-lite')(__dirname)

class UserController extends BaseController{
  // 注册
  register = async (ctx, next) => {
    const req = ctx.request;
    const { password, mobile, name } = req.body
    try{
      if(!name) throw new Error('名称不能为空')
      if(!password) throw new Error('密码不能为空')
      if(!mobile) throw new Error('手机号不能为空')

      if(name.length > 8) throw new Error('用户名不能超过8个字符')
      const u1 = await prisma.user.findFirst({where: {name}})
      if(u1) throw new Error('该用户名已存在')

      const u = await prisma.user.findFirst({where: {mobile}})
      if(u) throw new Error('该手机号已注册')
    }catch(e){
      ctx.body = {
        success: false,
        msg: e.message
      }
      return false
    }

    try{
      const user = await prisma.user.create({
        data: {
          password,
          mobile,
          name,
          birthday: null,
          followGroups: {
            create: [
              { name: '特别关注', system: 1 }
            ]
          }
        }
      })
      return ctx.body = {
        success: true,
        result: '注册成功'
      }
    }catch (e) {
      this.errorLogger.error('user.register--------->', e)
    }
  }

  // 获取登录用户信息
  info = async (ctx, next) => {
    let id
    try{
      id = await this.getAuthUserId(ctx, next)
      const t = await redisClient.get(this.REDIS_KEY_PREFIX.TOKEN + id)
      if(!t){
        return ctx.body = {
          success: false,
          code: this.CODE.USER_NOT_LOGIN,
          msg: '登录信息已过期，请重新登录'
        }
      }

      const xprisma = prisma.$extends({
        result: {
          user: {
            followerCount: {
              needs: { followers: true },
              compute(user) {
                return user.followers.length
              }
            },
            followingCount: {
              needs: { followings: true },
              compute(user) {
                return user.followings.length
              }
            }
          }
        }
      })
      const user = await xprisma.user.findUnique({
        where: {
          id
        },
        select: {
          id: true,
          name: true,
          avatar: true,
          profileCardBg: true,
          // mobile: true,
          createdAt: true,
          lock: true,
          introduce: true,
          gender: true,
          birthday: true,
          followerCount: true,
          followingCount: true,
        }
      })
      await prisma.user.update({
        where: { id },
        data: {
          lastActiveAt: new Date()
        }
      })
      if(user.lock === 1){
        return ctx.body = {
          success: false,
          code: this.CODE.USER_LOCK,
          msg: '您的账号已经被锁定，请联系管理员解锁'
        }
      }

      // 收到的点赞数
      const likeList = await redisClient.hVals(this.REDIS_KEY_PREFIX.EVERY_BLOG_LIKE_USER + user.id)
      const likedCount = likeList.reduce((pre, cur) => Number(pre) + Number(cur), 0)
      user.likedCount = likedCount

      return ctx.body = {
        success: true,
        result: user
      }
    }catch (e) {
      this.errorLogger.error('user.info--------->', e)
    }
  }

  // 博客端用户信息
  userInfo = async (ctx, next) => {
    const { id } = ctx.request.params
    let currentUserId = await this.getAuthUserId(ctx, next)
    try {
      const xprisma = prisma.$extends({
        result: {
          user: {
            followerCount: {
              needs: { followers: true },
              compute(user) {
                return user.followers.length
              }
            },
            followingCount: {
              needs: { followings: true },
              compute(user) {
                return user.followings.length
              }
            },
            isFollowing: {
              needs: { followers: true },
              compute(user) {
                return user.followers.some(u => u.followById === currentUserId)
              }
            },
            isMyFan: {
              needs: { followings: true },
              compute(user) {
                return user.followings.some(u => u.userId === currentUserId)
              }
            },
            // 是否互相关注
            isMutualFollowing: {
              needs: { followers: true, followings: true },
              compute(user) {
                const isFollowing = user.followers.some(u => u.followById === currentUserId)
                const isFollowed = user.followings.some(u => u.userId === currentUserId)
                return isFollowed && isFollowing
              }
            }
          }
        }
      })
      const user = await xprisma.user.findUnique({
        where: {
          id: Number(id)
        },
        select: {
          id: true,
          name: true,
          avatar: true,
          profileCardBg: true,
          // mobile: true,
          createdAt: true,
          lock: true,
          introduce: true,
          gender: true,
          birthday: true,
          followerCount: true,
          followingCount: true,
          isFollowing: true,
          isMyFan: true,
          isMutualFollowing: true,
          // blogs: {
          //   select: {
          //     id: true,
          //     updatedAt: true,
          //     title: true,
          //     content: true,
          //     cate: {
          //       select: {
          //         id: true,
          //         name: true
          //       }
          //     }
          //   }
          // }
        }
      })

      if(!user){
        return ctx.body = {
          success: false,
          code: this.CODE.USER_NOT_FOUND,
          msg: '用户不存在'
        }
      }

      // 收到的点赞数
      const likeList = await redisClient.hVals(this.REDIS_KEY_PREFIX.EVERY_BLOG_LIKE_USER + user.id)
      const likedCount = likeList.reduce((pre, cur) => Number(pre) + Number(cur), 0)
      user.likedCount = likedCount

      return ctx.body = {
        success: true,
        result: user
      }
    }catch (e) {
      this.errorLogger.error('user.userInfo--------->', e)
    }
  }

  // 更新用户信息
  update = async (ctx, next) => {
    const req = ctx.request
    const { name, avatar, introduce, gender, birthday, profileCardBg } = req.body
    let id = await this.getAuthUserId(ctx, next)
    try{
      if(!name) throw new Error('名称不能为空')
      if(name.length > 8) throw new Error('用户名不能超过8个字符')
      const u1 = await prisma.user.findFirst({where: {name}})
      if(u1 && id !== u1.id) throw new Error('该用户名已存在')
    }catch(e){
      ctx.body = {
        success: false,
        msg: e.message
      }
      return false
    }
    const form = { name, avatar, introduce, gender: Number(gender), birthday: new Date(birthday), profileCardBg }
    try {
      const result = await prisma.user.update({
        where: { id },
        data: form
      })
      return ctx.body = {
        success: true
      }
    }catch (e) {
      this.errorLogger.error('user.update--------->', e)
    }
  }

  // 管理端登录
  adminLogin = async (ctx, next) => {
    const req = ctx.request;
    const { password, mobile } = req.body
    try{
      if(!password) throw new Error('密码不能为空')
      if(!mobile) throw new Error('手机号不能为空')
    }catch(e){
      ctx.body = {
        success: false,
        msg: e.message
      }
      return false
    }

    try {
      const user = await prisma.user.findUnique({
        where: {
          mobile
        }
      })
      if(!user){
        return ctx.body = {
          success: false,
          msg: '该手机号未注册'
        }
      }
      if(user.type !== 1){
        return ctx.body = {
          success: false,
          msg: '用户不存在'
        }
      }
      if(user?.password === password) {
        const token = jsonwebtoken.sign({ id: user.id }, this.globalConfig.jwtSecret, { expiresIn: this.globalConfig.jwtTokenExpired }) // expiresIn token过期秒数
        await redisClient.set(this.REDIS_KEY_PREFIX.TOKEN + user.id, token, { EX: this.globalConfig.jwtTokenExpired })
        ctx.body = {
          success: true,
          msg: '登录成功',
          result: token
        }
      }else{
        ctx.body = {
          success: false,
          msg: '密码错误'
        }
      }
    }catch (e) {
      this.errorLogger.error('user.adminLogin--------->', e)
    }
  }

  // 博客端登录
  login = async (ctx, next) => {
    const req = ctx.request;
    const { password, mobile } = req.body
    try{
      if(!password) throw new Error('密码不能为空')
      if(!mobile) throw new Error('手机号不能为空')
    }catch(e){
      ctx.body = {
        success: false,
        msg: e.message
      }
      return false
    }

    try {
      const user = await prisma.user.findUnique({
        where: {
          mobile
        }
      })
      if(!user){
        return ctx.body = {
          success: false,
          msg: '该手机号未注册'
        }
      }
      if(user.lock === 1){
        return ctx.body = {
          success: false,
          code: 111,
          msg: '您的账号已经被锁定，请联系管理员解锁'
        }
      }
      if(user?.password === password) {
        const token = jsonwebtoken.sign({ id: user.id }, this.globalConfig.jwtSecret, { expiresIn: this.globalConfig.jwtTokenExpired }) // expiresIn token过期秒数
        await redisClient.set(this.REDIS_KEY_PREFIX.TOKEN + user.id, token, { EX: this.globalConfig.jwtTokenExpired })
        ctx.body = {
          success: true,
          msg: '登录成功',
          result: token
        }
      }else{
        ctx.body = {
          success: false,
          msg: '密码错误'
        }
      }
    }catch (e) {
      this.errorLogger.error('user.login--------->', e)
    }
  }

  // 登出
  logout = async (ctx, next) => {
    try {
      let id = await this.getAuthUserId(ctx, next)
      await redisClient.del(this.REDIS_KEY_PREFIX.TOKEN + id)
      ctx.body = {
        success: true,
        msg: '已退出登录'
      }
    }catch (e) {
      this.errorLogger.error('user.logout--------->', e)
    }
  }

  // 所有普通用户
  all = async (ctx, next) => {
    try {
      const result = await prisma.user.findMany({
        where: {
          type: 2
        },
        select: {
          id: true,
          name: true,
          mobile: true
        },
        orderBy: {createdAt: 'desc'}
      })
      ctx.body = {
        success: true,
        result
      }
    }catch (e) {
      this.errorLogger.error('user.all--------->', e)
    }
  }

  // 普通用户列表
  list = async (ctx, next) => {
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

  // 锁定
  operateLock = async (ctx, next) => {
    const { type, id } = ctx.request.body
    try{
      if(!type) throw new Error('缺少参数 type')
      if(!id) throw new Error('缺少参数 id')
    }catch(e){
      ctx.body = {
        success: false,
        msg: e.message
      }
      return false
    }
    try{
      const user = await prisma.user.update({
        where: {
          id
        },
        data: {
          lock: type
        }
      })
      return ctx.body = {
        success: true
      }
    }catch (e) {
      this.errorLogger.error('user.operateLock--------->', e)
    }
  }

  // 更新头像
  updateAvatar = async (ctx, next) => {
    const { avatar } = ctx.request.body
    const id = ctx.state.user.id
    try{
      const user = await prisma.user.update({
        where: {
          id
        },
        data: {
          avatar
        }
      })
      return ctx.body = {
        success: true
      }
    }catch (e) {
      this.errorLogger.error('user.edit--------->', e)
    }
  }

  // 关注
  operateFollow = async (ctx, next) => {
    const { type, id } = ctx.request.body
    let userId = await this.getAuthUserId(ctx, next)
    try{
      if(!type) throw new Error('缺少参数 type')
      if(!id) throw new Error('缺少参数 id')
    }catch(e){
      ctx.body = {
        success: false,
        msg: e.message
      }
      return false
    }

    try {
      // 关注
      if(Number(type) === 1){
        const user = await prisma.user.update({
          where: {
            id: userId
          },
          data: {
            followings: {
              create: [
                {
                  user: {
                    connect: {
                      id: Number(id)
                    }
                  }
                }
              ]
            }
          }
        })
      }

      // 取消关注
      if(Number(type) === 2){
        const gList = await prisma.followGroup.findMany({
          where: {
            createById: userId
          },
          select: {
            id: true
          }
        })

        await prisma.$transaction([
          prisma.user.update({
            where: {
              id // 关注的用户id
            },
            data: {
              inFollowGroups: {
                disconnect: gList
              }
            }
          }),
          prisma.user.update({
            where: {
              id: userId
            },
            data: {
              followings: {
                delete: [
                  {
                    userId_followById: {
                      userId:  Number(id),
                      followById: userId
                    }
                  }
                ]
              }
            }
          })
        ])
      }

      return ctx.body = {
        success: true
      }
    }catch (e) {
      this.errorLogger.error('user.operateFollow--------->', e)
    }
  }

  // 设置关注的用户组。todo: 可能放在 followGroupController 比较合理，但是那样不能直接使用 set 覆盖关系
  setGroup = async (ctx, next) => {
    const {groupId, userId} = ctx.request.body
    try {
      if (!groupId || !userId) throw new Error('参数不全')
    } catch (e) {
      ctx.body = {
        success: false,
        msg: e.message
      }
      return false
    }

    try {
      const idList = groupId.split(',').map(i => ({ id: Number(i) }))
      const res = await prisma.user.update({
        where: {
          id: userId // 关注的用户id
        },
        data: {
          inFollowGroups: {
            set: idList
          }
        }
      })

      return ctx.body = {
        success: true
      }
    } catch (e) {
      this.errorLogger.error('user.setGroup--------->', e)
    }
  }

  // 获取视频或图片
  getMediaList = async (ctx, next) => {
    const {type, userId, page = 1, pageSize = this.pageSize } = ctx.request.body
    const skip = pageSize * (page - 1)
    let filter = { createById: userId }
    try{
      if(!type || !userId) throw new Error('缺少参数')
    }catch(e){
      ctx.body = {
        success: false,
        msg: e.message
      }
      return false
    }

    switch (Number(type)) {
      // 图片
      case 1:
        filter.OR = config.imgTypeList.map(t => ({
          url: {
            endsWith: t
          }
        }))
        break
      // 视频
      case 2:
        filter.OR = config.videoTypeList.map(t => ({
          url: {
            endsWith: t
          }
        }))
        break
    }

    try {
      const [list, total] = await prisma.$transaction([
        prisma.media.findMany({
          skip,
          take: pageSize,
          where: filter,
          orderBy: {
            createdAt: 'desc'
          },
          select: {
            id: true,
            url: true,
            blogId: true,
            blog: {
              select: {
                id: true,
                content: true
              }
            }
          }
        }),
        prisma.media.count({ where: filter })
      ])

      return ctx.body = {
        success: true,
        result: {
          list,
          total
        }
      }
    }catch (e) {
      this.errorLogger.error('user.getMediaList--------->', e)
    }
  }

  friends = async (ctx, next) => {
    let {relateType, uid, page = 1, pageSize = this.pageSize } = ctx.request.body
    const skip = pageSize * (page - 1)
    let filter = { ALL_DATA: true }
    let orderBy = { }
    try{
      if(!relateType || !uid) throw new Error('缺少参数')
    }catch(e){
      ctx.body = {
        success: false,
        msg: e.message
      }
      return false
    }

    uid = Number(uid)
    switch (Number(relateType)) {
      // 关注
      case 1:
        filter.followById = uid
        orderBy.assignedAt = {
          assignedAt: 'desc'
        }
        break
      // 粉丝
      case 2:
        filter.userId = uid
        orderBy.followings = {
          assignedAt: 'desc'
        }
        break
    }

    try {
      const xprisma = prisma.$extends({
        result: {
          user: {
            // 是否互相关注
            isMutualFollowing: {
              needs: { followers: true, followings: true },
              compute(user) {
                const isFollowing = user.followers.some(u => u.followById === uid)
                const isFollowed = user.followings.some(u => u.userId === uid)
                return isFollowed && isFollowing
              }
            },
            isFollowing: {
              needs: { followers: true },
              compute(result){
                return result.followers.some(u => u.followById === uid)
              }
            },
            followersCount: {
              needs: { followers: true },
              compute(result){
                return result.followers.length
              }
            },
          }
        }
      })

      // 先查出对应关系
      const [refList, total] = await prisma.$transaction([
        prisma.followRelation.findMany({
          skip,
          take: pageSize,
          where: JSON.parse(JSON.stringify(filter)),
          orderBy: {
            assignedAt: 'desc'
          },
          select: {
            assignedAt: true,
            userId: true,
            followById: true,
          }
        }),
        prisma.followRelation.count({ where: filter })
      ])

      // 再用关系查找用户信息
      const list = await xprisma.user.findMany({
        where: {
          id: {
            in: refList.map(ref => Number(relateType) === 1 ? ref.userId : ref.followById)
          }
        },
        select: {
          id: true,
          name: true,
          avatar: true,
          introduce: true,
          followersCount: true,
          isFollowing: true,
          isMutualFollowing: true,
        }
      })

      return ctx.body = {
        success: true,
        result: {
          list,
          total
        }
      }
    }catch (e) {
      this.errorLogger.error('user.friends--------->', e)
    }
  }

  markBlogList = async (ctx, next) => {
    // type: 1--点赞，2--收藏
    const { type, page = 1, pageSize = this.pageSize } = ctx.request.body
    try{
      if(!type) throw new Error('缺少参数')
    }catch(e){
      ctx.body = {
        success: false,
        msg: e.message
      }
      return false
    }
    let userId = await this.getAuthUserId(ctx, next)
    const skip = pageSize * (page - 1)
    let filter = {
      userId,
      ALL_DATA: true
    }
    try {
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

      let refList = [], total = 0

      if(Number(type) === 1){
        [refList, total] = await prisma.$transaction([
          xprisma.LikeBlogRelation.findMany({
            skip,
            take: pageSize,
            where: JSON.parse(JSON.stringify(filter)),
            select: {
              userId: true,
              blogId: true,
            },
            orderBy: {
              assignedAt: 'desc'
            }
          }),
          prisma.LikeBlogRelation.count({ where: filter })
        ])
      }

      if(Number(type) === 2){
        [refList, total] = await prisma.$transaction([
          xprisma.userCollectBlogs.findMany({
            skip,
            take: pageSize,
            where: JSON.parse(JSON.stringify(filter)),
            select: {
              userId: true,
              blogId: true,
            },
            orderBy: {
              assignedAt: 'desc'
            }
          }),
          prisma.userCollectBlogs.count({ where: filter })
        ])
      }

      const list = await xprisma.blog.findMany({
        where: {
          id: {
            in: refList.map(ref => ref.blogId)
          }
        },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          createById: true,
          status: true,
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

      return ctx.body = {
        success: true,
        result: {
          list,
          total
        }
      }
    }catch (e) {
      this.errorLogger.error('user.markBlogList--------->', e)
    }
  }

  // 我的评论列表
  myCommentList = async (ctx, next) => {
    const { page = 1, pageSize = this.pageSize } = ctx.request.body
    let userId = await this.getAuthUserId(ctx, next)
    const skip = pageSize * (page - 1)
    let filter = {
      createById: userId,
    }

    try {
      const [list, total] = await prisma.$transaction([
        prisma.comment.findMany({
          skip,
          take: pageSize,
          where: filter,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            createdAt: true,
            content: true,
            blogId: true,
            topCommentId: true,
            createById: true,
            status: true,
            createBy: {
              select: {
                id: true,
                name: true,
                avatar: true,
              }
            },
            replyToId: true,
            replyTo: {
              select: {
                id: true,
                name: true,
                avatar: true,
              }
            },
            blog: {
              select: {
                id: true,
                content: true,
                deletedAt: true,
              }
            }
          }
        }),
        prisma.comment.count({where: filter})
      ])

      return ctx.body = {
        success: true,
        result: {
          list,
          total
        }
      }
    }catch (e) {
      this.errorLogger.error('user.myCommentList--------->', e)
    }
  }

}

module.exports =  new UserController()
