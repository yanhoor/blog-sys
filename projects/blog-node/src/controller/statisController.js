const BaseController = require('./baseController')
const prisma = require('../database/prisma')
const dayjs = require('dayjs')

class StatisController extends BaseController{
  weekDetail = async (ctx, next) => {
    let rangeList = []
    for(let i = 6; i >= 0; i--){
      const date = dayjs().subtract(i, 'day')
      const gte = new Date(date.startOf('date'))
      const lte = new Date(date.endOf('date'))
      rangeList.push({
        createdAt: {
          gte,
          lte
        },
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
}

module.exports = new StatisController()
