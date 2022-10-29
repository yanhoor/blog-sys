// config-lite配置文件，默认加载

module.exports = {
    imgTypeList: ['.jpg', '.jpeg', '.png', '.gif', '.bmp'], // 图片上传允许类型
    uploadDir: './src/assets/upload/', // 上传目录
    jwtSecret: 'jwt-sec',
    pageSize: 20, // 默认分页大小
    databaseRecordTime: 0, // prisma 查询超过多少毫秒时显示日志
    tencentAddressKey: 'LONBZ-TTL33-B2F3T-YB37Q-A2AUJ-WPBZM', // 腾讯地图开发密钥key
    tencentSK: '94Td8seXgr31YXRYUrptfjGN8j9isS6', // 腾讯地图SK
};
