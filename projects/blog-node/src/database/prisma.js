const { PrismaClient } = require('@prisma/client')
const config = require('config-lite')(__dirname)

const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
})

createAdmin()

// 创建超级管理员
async function createAdmin(){
  const admin = await prisma.user.findUnique({
    where: { type: 1 }
  })

  if(!admin){
    await prisma.user.create({
      data: config.adminUser
    })
  }
}

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
  let where
  if(params.args?.where){
    // 避免 findMany/count 使用相同的 where 查询时，ALL_DATA 被删除
    where = JSON.parse(JSON.stringify(params.args?.where))
  }
  // 有 ALL_DATA 说明不需要添加 deletedAt 参数，比如硬删除的不会有这个参数
  if(params.args?.where?.ALL_DATA) {
    delete where.ALL_DATA
    params.args.where = where
    return next(params)
  }

  if (params.action == 'findUnique') {
    // 更改为 findFirst - 无法过滤
    // 除 ID / unique 和 findUnique 之外的任何内容
    params.action = 'findFirst'
    // 添加 'deleted' 过滤器
    // 保持 ID 过滤器
    if (!params.args.where.deletedAt) params.args.where['deletedAt'] = null
  }
  if (['findMany', 'count'].includes(params.action)) {
    // 查找许多查询
    if (params.args?.where != undefined) {
      if (!params.args.where.deletedAt) {
        // 如果未明确要求删除记录，则将其排除在外
        params.args.where['deletedAt'] = null
      }
    } else {
      params.args = {...params.args}
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
