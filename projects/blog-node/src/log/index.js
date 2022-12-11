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
    // level 指最低的级别，低于这个级别的都不会显示
    // 所有级别：ALL < TRACE < DEBUG < INFO < WARN < ERROR < FATAL < MARK < OFF
    default: { appenders: ["console"], level: "debug" },
    error: { appenders: ["error", "console"], level: "error" }, // 这样使用 error 分类时，错误也会在 console 输出
    http: { appenders: ["access"], level: "debug" },
  },
  pm2: process.env.NODE_ENV === 'production'
});

console.log('==========process.env.NODE_ENV===========', process.env.NODE_ENV)
const defaultLogger = log4js.getLogger('default')
const errorLogger = log4js.getLogger('error')
const httpLogger = log4js.getLogger('http')

module.exports = { defaultLogger, errorLogger, httpLogger }
