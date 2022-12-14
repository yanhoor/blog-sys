const config = require('config-lite')(__dirname)
const { defaultLogger, errorLogger } = require('../log')
const jsonwebtoken = require('jsonwebtoken')
const { websocket, WEBSOCKET_MESSAGE_TYPE } = require('../websocket')

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
  // redis 储存用户 token 的 key 的前缀，token_[userId]
  TOKEN_PREFIX = 'token_'

  getAuthUserId = async (ctx, next) => {
    const token = ctx.headers['authorization']
    let userId = undefined
    if(token) {
      try {
        const user = await jsonwebtoken.verify(token.replace(/Bearer /g, ''), this.globalConfig.jwtSecret)
        userId = user.id
      }catch (e) {
        this.errorLogger.error('getAuthUserId--------->', e)
      }
    }
    return userId
  }
}

module.exports = BaseController
