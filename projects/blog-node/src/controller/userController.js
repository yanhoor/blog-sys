const BaseController = require('./baseController')
const prisma = require('../database/prisma')
const jsonwebtoken = require('jsonwebtoken')
const redisClient = require('../database/redis')

class UserController extends BaseController{
  // 注册
  register = async (ctx, next) => {
    const req = ctx.request;
    const { password, mobile, name } = req.body
    try{
      if(!name) throw new Error('名称不能为空')
      if(!password) throw new Error('密码不能为空')
      if(!mobile) throw new Error('手机号不能为空')

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
      const user = await prisma.user.create({data: { password, mobile, name }})
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

      const user = await prisma.user.findUnique({
        where: {
          id
        },
        select: {
          id: true,
          name: true,
          avatar: true,
          profileCardBg: true,
          mobile: true,
          lock: true,
          introduce: true,
          sign: true,
          gender: true,
          birthday: true,
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
                return user.followers.some(u => u.id === currentUserId)
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
          sign: true,
          gender: true,
          birthday: true,
          followerCount: true,
          followingCount: true,
          isFollowing: true,
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
    const { name, avatar, introduce, sign, gender, birthday, profileCardBg } = req.body
    try{
      if(!name) throw new Error('名称不能为空')
    }catch(e){
      ctx.body = {
        success: false,
        msg: e.message
      }
      return false
    }
    const form = { name, avatar, introduce, sign, gender, birthday: new Date(birthday), profileCardBg }
    try {
      let id = await this.getAuthUserId(ctx, next)
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
      if(Number(type) === 1){
        const user = await prisma.user.update({
          where: {
            id: userId
          },
          data: {
            followings: {
              connect: { id: Number(id) }
            }
          }
        })
      }

      if(Number(type) === 2){
        const user = await prisma.user.update({
          where: {
            id: userId
          },
          data: {
            followings: {
              disconnect: { id: Number(id) }
            }
          }
        })
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
    const {id, userId} = ctx.request.body
    try {
      if (!id || !userId) throw new Error('参数不全')
    } catch (e) {
      ctx.body = {
        success: false,
        msg: e.message
      }
      return false
    }

    try {
      const idList = id.split(',').map(i => ({ id: Number(i) }))
      const res = await prisma.user.update({
        where: {
          id: userId
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

}

module.exports =  new UserController()
