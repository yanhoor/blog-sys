const config = require('config-lite')(__dirname)
const { defaultLogger, errorLogger } = require('../log')
const jsonwebtoken = require('jsonwebtoken')

class BaseController{
  pageSize = config.pageSize
  globalConfig = config
  defaultLogger = defaultLogger
  errorLogger = errorLogger

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
