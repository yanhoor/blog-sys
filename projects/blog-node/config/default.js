// config-lite配置文件，默认加载

module.exports = {
    imgTypeList: ['.jpg', '.jpeg', '.png', '.gif', '.bmp'], // 图片上传允许类型
    uploadDir: './src/assets/upload/', // 上传目录
    jwtSecret: 'jwt-sec',
    jwtTokenExpired: 60 * 60 * 24 * 7, // 秒
    pageSize: 20, // 默认分页大小
    databaseRecordTime: 0, // prisma 查询超过多少毫秒时显示日志
    tencentAddressKey: 'LONBZ-TTL33-B2F3T-YB37Q-A2AUJ-WPBZM', // 腾讯地图开发密钥key
    tencentSK: '94Td8seXgr31YXRYUrptfjGN8j9isS6', // 腾讯地图SK
    aliOss: {
        // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
        region: 'oss-cn-shenzhen',
        // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
        accessKeyId: 'LTAI5t7dHCyYkdiQEGSqzGCs',
        accessKeySecret: 'kKGSBlGPzDv7JBqspDGdB8dpqCdLkE',
        bucket: 'static-buck',
        endpoint: 'oss-cn-shenzhen.aliyuncs.com'
    }
};
