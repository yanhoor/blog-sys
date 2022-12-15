const config = require('config-lite')(__dirname)
const { defaultLogger, errorLogger } = require('../log')
const jsonwebtoken = require('jsonwebtoken')
const { websocket, WEBSOCKET_MESSAGE_TYPE } = require('../websocket')
const redisClient = require('../database/redis')
const dayjs = require('dayjs')

class BaseController{
  pageSize = config.pageSize
  globalConfig = config
  defaultLogger = defaultLogger
  errorLogger = errorLogger
  websocket = websocket
  WEBSOCKET_MESSAGE_TYPE = WEBSOCKET_MESSAGE_TYPE
  // 返回的 code
  CODE = {
    NOT_LOGIN: 999, // 未登录/登录异常
    USER_LOCK: 111, // 用户被锁定
  }
  // redis 储存 的 key 的前缀
  REDIS_KEY_PREFIX = {
    TOKEN: 'token_', // 用户登录 token_[userId]
    READ_BLOG_USER: 'read_blog_id_', // 博客的已读用户id集合
    BLOG_CREATE_RANKING: 'blog_create_ranking', // 博客创建数排名有序集合
    BLOG_READ_RANKING: 'blog_read_ranking', // 博客阅读数排名有序集合
    // BLOG_LIKE_RANKING: 'blog_like_ranking', // 博客点赞数排名有序集合
  }

  getAuthUserId = async (ctx, next) => {
    const token = ctx.headers['authorization']
    let userId = undefined
    if(token) {
      try {
        const user = await jsonwebtoken.verify(token.replace(/Bearer /g, ''), this.globalConfig.jwtSecret)
        const clientToken = await redisClient.get(this.REDIS_KEY_PREFIX.TOKEN + user.id)
        if(clientToken) userId = user.id
      }catch (e) {
        this.errorLogger.error('getAuthUserId--------->', e)
      }
    }
    return userId
  }

  createTimeRange = (preDiff, endDiff) => {
    const start = dayjs().subtract(preDiff, 'day')
    const end = dayjs().subtract(endDiff, 'day')
    const gte = new Date(start.startOf('date'))
    const lte = new Date(end.endOf('date'))

    return {
      gte,
      lte,
    }
  }
}

module.exports = BaseController
