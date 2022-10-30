const BaseController = require('./baseController')
const prisma = require('../database/prisma')
const jsonwebtoken = require('jsonwebtoken')
const config = require('config-lite')(__dirname)

class UserController extends BaseController{
  // 注册
  register = async (ctx, next) => {
    const req = ctx.request;
    const { password, mobile } = req.body
    try{
      if(!password) throw new Error('密码不能为空')
      if(!mobile) throw new Error('手机号不能为空')

      const u = await prisma.user.findFirst({where: {mobile}})
      if(u) throw new Error('该手机号已注册')
    }catch(e){
      console.log('=======user.register  11=========', e)
      ctx.body = {
        success: false,
        msg: e.message
      }
      return false
    }

    try{
      const user = await prisma.user.create({data: req.body})
      return ctx.body = {
        success: true,
        result: '注册成功'
      }
    }catch (e) {
      console.log('=======user.register=========', e)
    }
  }

  // 获取登录用户信息
  info = async (ctx, next) => {
    const id = ctx.state.user.id
    console.log('=======user.info=========', id)
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
      return ctx.body = {
        success: true,
        result: user
      }
    }catch (e) {
      console.log('=======user.info=========', e)
    }
  }

  // 登录
  login = async(ctx, next) => {
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
      const token = jsonwebtoken.sign({ id: user.id }, config.jwtSecret, { expiresIn: 60 * 60 *24 * 7 }) // expiresIn token过期秒数
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

  logout = async (ctx, next) => {
    // 设置为不同值，使登录的 token 失效
    jsonwebtoken.sign('', config.jwtSecret)
    ctx.body = {
      success: true,
      msg: '已退出登录'
    }
  }
}

module.exports =  new UserController()
