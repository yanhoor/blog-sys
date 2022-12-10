const BaseController = require('./baseController')
const prisma = require('../database/prisma')
const jsonwebtoken = require('jsonwebtoken')

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
    let id = await this.getAuthUserId(ctx, next)
    try{
      const user = await prisma.user.findUnique({
        where: {
          id
        },
        select: {
          id: true,
          name: true,
          avatar: true,
          mobile: true,
        }
      })
      await prisma.user.update({
        where: { id },
        data: {
          lastActiveAt: new Date()
        }
      })
      return ctx.body = {
        success: true,
        result: user
      }
    }catch (e) {
      this.errorLogger.error('user.info--------->', e)
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
  }

  // 登录
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
    if(user?.password === password) {
      const token = jsonwebtoken.sign({ id: user.id }, this.globalConfig.jwtSecret, { expiresIn: this.globalConfig.jwtTokenExpired }) // expiresIn token过期秒数
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
  }

  // 登出
  logout = async (ctx, next) => {
    ctx.body = {
      success: true,
      msg: '已退出登录'
    }
  }

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

}

module.exports =  new UserController()
