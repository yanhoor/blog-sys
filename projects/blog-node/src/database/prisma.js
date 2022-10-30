const { PrismaClient } = require('@prisma/client')
const config = require('config-lite')(__dirname)

const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
})

// 日志中间件
prisma.$use(async (params, next) => {
  const before = Date.now()

  const result = await next(params)

  const after = Date.now()

  if((after - before) > config.databaseRecordTime){
    console.log(`查询 ${params.model}.${params.action} 时间----> ${after - before}ms`)
  }

  return result
})

// 拦截软删除数据的查询
prisma.$use(async (params, next) => {
  if (params.action == 'findUnique') {
    // 更改为 findFirst - 无法过滤
    // 除 ID / unique 和 findUnique 之外的任何内容
    params.action = 'findFirst'
    // 添加 'deleted' 过滤器
    // 保持 ID 过滤器
    params.args.where['deletedAt'] = null
  }
  if (['findMany', 'count'].includes(params.action)) {
    // 查找许多查询
    if (params.args.where != undefined) {
      if (!params.args.where.deletedAt) {
        // 如果未明确要求删除记录，则将其排除在外
        params.args.where['deletedAt'] = null
      }
    } else {
      params.args['where'] = { deletedAt: null }
    }
  }
  return next(params)
})

// 软删除
// prisma.$use(async (params, next) => {
//   const actionTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
//   if (params.action == 'delete') {
//     // 删除查询
//     // 将操作更改为更新
//     params.action = 'update'
//     params.args['data'] = { deletedAt: actionTime }
//   }
//   if (params.action == 'deleteMany') {
//     // 删除许多查询
//     params.action = 'updateMany'
//     if (!params.args.data) {
//       params.args.data['deletedAt'] = actionTime
//     } else {
//       params.args['data'] = { deletedAt: actionTime }
//     }
//   }
//   return next(params)
// })

module.exports = prisma
