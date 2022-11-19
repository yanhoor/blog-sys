const config = require('config-lite')(__dirname)
const { defaultLogger, errorLogger } = require('../log')

class BaseController{
  pageSize = config.pageSize
  globalConfig = config
  defaultLogger = defaultLogger
  errorLogger = errorLogger
}

module.exports = BaseController
