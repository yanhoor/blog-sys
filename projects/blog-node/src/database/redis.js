const { createClient } = require('redis')
const config = require('config-lite')(__dirname)

class RedisClient{
  redisClient = null
  async initRedis() {
    // this.redisClient = createClient(config.redis)
    const url = `redis://${config.redis.username}:${config.redis.password}@${config.redis.host}:${config.redis.port}`
    console.log('======redis url=======', url)
    this.redisClient = createClient({
      // 格式: redis[s]://[[username][:password]@][host][:port][/db-number]
      url
    })

    this.redisClient.on('error', (err) => console.log('Redis Client Error', err))

    await this.redisClient.connect()
  }
}

const client = new RedisClient()
client.initRedis()
module.exports = client.redisClient
