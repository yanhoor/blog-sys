const { createClient } = require('redis')

class RedisClient{
  redisClient = null
  async initRedis() {
    this.redisClient = createClient()

    this.redisClient.on('error', (err) => console.log('Redis Client Error', err))

    await this.redisClient.connect()
  }
}

const client = new RedisClient()
client.initRedis()
module.exports = client.redisClient
