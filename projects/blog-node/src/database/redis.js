const { createClient } = require('redis')
const config = require('config-lite')(__dirname)

class RedisClient{
  redisClient = null
  async initRedis() {
    this.redisClient = createClient(config.redis)

    this.redisClient.on('error', (err) => console.log('Redis Client Error', err))

    await this.redisClient.connect()
  }
}

const client = new RedisClient()
client.initRedis()
module.exports = client.redisClient
