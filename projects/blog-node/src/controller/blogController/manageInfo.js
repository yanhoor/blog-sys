const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function(ctx, next) {
  return this.info(ctx, next, true)
}
