const log4js = require('log4js')

log4js.configure({
  // 输出源
  appenders: {
    console: { type: "console" },
    access: { type: "dateFile", filename: "./logFiles/access.log", pattern: "-yyyy-MM-dd" },
    error: { type: "file", filename: "./logFiles/errors.log" }, // 根目录/logFiles
  },
  // 日志分类
  categories: {
    default: { appenders: ["console"], level: "debug" },
    error: { appenders: ["error"], level: "error" },
    http: { appenders: ["access"], level: "debug" },
  },
  pm2: process.env.NODE_ENV === 'production'
});

const defaultLogger = log4js.getLogger('default')
const errorLogger = log4js.getLogger('error')
const httpLogger = log4js.getLogger('http')

module.exports = { defaultLogger, errorLogger, httpLogger }
