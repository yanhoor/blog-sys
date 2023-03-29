module.exports = {
  wechat: {
    appid: 'wx00a09e9676bb0927',
    secret: '23ca458c9f3537908eae10a7e4a536b3',
  },
  redis: {
    host: '127.0.0.1',
    port: '6379',
    username: 'default',
    password: '1q2w3e4r'
  },
  aliOss: {
    // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
    region: 'oss-cn-shenzhen',
    // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
    accessKeyId: 'LTAI5tGuiNYrgpEGjmSGq2G3',
    accessKeySecret: 'NnJOIoFqphr54lTyHrnTgg1gtfe3t3',
    bucket: 'static-buck',
    endpoint: 'oss-cn-shenzhen.aliyuncs.com'
  },
}
