const config = require('config-lite')(__dirname)

class BaseController{
  pageSize = config.pageSize
  globalConfig = config

}

module.exports = BaseController
