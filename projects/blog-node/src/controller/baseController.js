const config = require('config-lite')(__dirname)
const { defaultLogger, errorLogger } = require('../log')
const jsonwebtoken = require('jsonwebtoken')
const { websocket, WEBSOCKET_MESSAGE_TYPE } = require('../websocket')
const redisClient = require('../database/redis')
const dayjs = require('dayjs')
const Axios = require('axios')
const { NotificationType } = require('@prisma/client')

class BaseController {
  pageSize = config.pageSize
  globalConfig = config
  defaultLogger = defaultLogger
  errorLogger = errorLogger
  websocket = websocket
  WEBSOCKET_MESSAGE_TYPE = WEBSOCKET_MESSAGE_TYPE
  // 返回的 code
  CODE = {
    USER_NOT_LOGIN: 999, // 未登录/登录异常
    USER_LOCK: 111, // 用户被锁定
    USER_NOT_FOUND: 222 // 用户不存在
  }
  // redis 储存 的 key 的前缀
  REDIS_KEY_PREFIX = {
    TOKEN: 'token_', // 用户登录 token_[userId]

    // 博客数据记录
    READ_BLOG_USER: 'read_blog_id_', // 单个博客的已读用户id集合
    LIKE_BLOG_USER: 'like_blog_id_', // 单个博客的点赞用户id集合
    COLLECT_BLOG_USER: 'collect_blog_id_', // 单个博客的收藏用户id集合
    BLOG_READ_RANKING: 'blog_read_ranking', // 博客阅读数排名有序集合
    BLOG_LIKE_RANKING: 'blog_like_ranking', // 博客点赞数排名有序集合
    BLOG_COLLECT_RANKING: 'blog_collect_ranking', // 博客收藏数排名有序集合

    // 用户数据记录
    BLOG_CREATE_RANKING: 'blog_create_ranking', // 博客创建数排名有序集合
    EVERY_BLOG_LIKE_USER: 'every_blog_like_user_', // 所有博客分别被点赞数量 hash
    EVERY_BLOG_READ_USER: 'every_blog_read_user_', // 所有博客分别被阅读数量 hash
    EVERY_BLOG_COLLECT_USER: 'every_blog_collect_user_' // 所有博客分别被收藏数量 hash
  }
  NOTIFICATION_TYPE = NotificationType

  getAuthUserId = async (ctx, next) => {
    const token = ctx.headers['authorization']
    let userId = undefined
    if (token) {
      try {
        const user = await jsonwebtoken.verify(
          token.replace(/Bearer /g, ''),
          this.globalConfig.jwtSecret
        )
        const clientToken = await redisClient.get(
          this.REDIS_KEY_PREFIX.TOKEN + user.id
        )
        if (clientToken) userId = user.id
      } catch (e) {
        this.errorLogger.error('getAuthUserId--------->', e)
      }
    }
    return userId
  }

  createTimeRange = (preDiff, endDiff) => {
    const start = dayjs().subtract(preDiff, 'day')
    const end = dayjs().subtract(endDiff, 'day')
    // 注意都是 endOf()
    const gte = new Date(start.endOf('date'))
    const lte = new Date(end.endOf('date'))

    return {
      gte,
      lte
    }
  }

  $get = async (url, params) => {
    return new Promise((r, j) => {
      Axios.get(url, {
        params
      }).then((res) => {
        r(res.data)
      })
    })
  }
}

module.exports = BaseController
