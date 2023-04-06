// config-lite配置文件，默认加载，其他配置会进行深合并
const secret = require('./secret')

module.exports = {
  imgTypeList: [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.bmp',
    '.webp',
    '.avif',
    '.svg'
  ], // 图片上传允许类型
  videoTypeList: ['.mp4', '.mov', '.avi', '.mkv'], // 视频上传允许类型
  uploadImgMaxSize: 5, // 上传图片最大体积, M
  uploadVideoMaxSize: 200, // 上传视频最大体积, M
  multiPartUploadSwitchSize: 20, // 开启分片上传临界体积, M
  multiPartPerSize: 20, // 分片上传每部份体积, M
  uploadDir: './src/assets/upload/', // 上传目录
  jwtSecret: 'jwt-sec',
  jwtTokenExpired: 60 * 60 * 24 * 7, // 秒
  pageSize: 20, // 默认分页大小
  databaseRecordTime: 0, // prisma 查询超过多少毫秒时显示日志
  tencentAddressKey: 'LONBZ-TTL33-B2F3T-YB37Q-A2AUJ-WPBZM', // 腾讯地图开发密钥key
  tencentSK: '94Td8seXgr31YXRYUrptfjGN8j9isS6', // 腾讯地图SK
  adminUser: {
    name: '超级管理员',
    mobile: '12345678900',
    type: 1,
    password: '1q2w3e'
  },
  ...secret
}
