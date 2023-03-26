const { createClient } = require('redis')
const config = require('config-lite')(__dirname)

class RedisClient{
  redisClient = null
  async initRedis() {
    // this.redisClient = createClient(config.redis)
    this.redisClient = createClient({
      // 格式: redis[s]://[[username][:password]@][host][:port][/db-number]
      url: `redis://${config.redis.username}:${config.redis.password}@${config.redis.host}:${config.redis.port}`
    })

    this.redisClient.on('error', (err) => console.log('Redis Client Error', err))

    await this.redisClient.connect()
  }
}

const client = new RedisClient()
client.initRedis()
module.exports = client.redisClient
