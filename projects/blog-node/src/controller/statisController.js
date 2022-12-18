const BaseController = require('./baseController')
const prisma = require('../database/prisma')
const dayjs = require('dayjs')
const redisClient = require("../database/redis");

class StatisController extends BaseController{
  weekDetail = async (ctx, next) => {
    let rangeList = []
    for(let i = 6; i >= 0; i--){
      const date = dayjs().subtract(i, 'day')
      rangeList.push({
        createdAt: this.createTimeRange(i + 1, i),
        date: dayjs(date).format('YYYY-MM-DD')
      })
    }
    try {
      let result = {}
      for (let range of rangeList){
        const [blogCount, userRegisterCount] = await prisma.$transaction([
          prisma.blog.count({
            where: {
              createdAt: range.createdAt
            }
          }),
          prisma.user.count({
            where: {
              createdAt: range.createdAt
            }
          })
        ])
        result[range.date] = {
          blogCount,
          userRegisterCount
        }
      }
      return ctx.body = {
        success: true,
        result
      }
    }catch (e) {
      this.errorLogger.error('statis.weekDetail---------->', e)
    }
  }

  totalCount = async (ctx, next) => {
    try {
      const date = dayjs()
      const gte = new Date(date.startOf('date'))
      const lte = new Date(date.endOf('date'))
      const [blogCount, userRegisterCount, userActiveCount, userRegisterTodayCount] = await prisma.$transaction([
        prisma.blog.count(),
        prisma.user.count({
          where: {
            type: 2
          }
        }),
        prisma.user.count({
          where: {
            type: 2,
            lastActiveAt: {
              gte,
              lte
            }
          }
        }),
        prisma.user.count({
          where: {
            type: 2,
            createdAt: {
              gte,
              lte
            }
          }
        })
      ])

      return ctx.body = {
        success: true,
        result: {
          blogCount,
          userRegisterCount,
          userActiveCount,
          userRegisterTodayCount,
        }
      }
    }catch (e) {
      this.errorLogger.error('statis.totalCount---------->', e)
    }
  }

  user = async (ctx, next) => {
    const { id } = ctx.request.body
    try {
      const u = await prisma.user.findUnique({
        where: { id }
      })
      if(!u) throw new Error('用户不存在')
    } catch (e) {
      ctx.body = {
        success: false,
        msg: e.message
      }
      return false
    }

    try {
      const readList = await redisClient.hVals(this.REDIS_KEY_PREFIX.EVERY_BLOG_READ_USER + id)
      const readCount = readList.reduce((pre, cur) => Number(pre) + Number(cur), 0)

      const likeList = await redisClient.hVals(this.REDIS_KEY_PREFIX.EVERY_BLOG_LIKE_USER + id)
      const likeCount = likeList.reduce((pre, cur) => Number(pre) + Number(cur), 0)

      const collectList = await redisClient.hVals(this.REDIS_KEY_PREFIX.EVERY_BLOG_COLLECT_USER + id)
      const collectCount = collectList.reduce((pre, cur) => Number(pre) + Number(cur), 0)

      return ctx.body = {
        success: true,
        result: {
          readCount,
          likeCount,
          collectCount,
        }
      }
    }catch (e) {
      this.errorLogger.error('statis.user---------->', e)
    }
  }
}

module.exports = new StatisController()
