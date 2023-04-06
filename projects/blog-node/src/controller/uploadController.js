const BaseController = require('./baseController')
const path = require('path')
const config = require('config-lite')(__dirname)
const OSS = require('ali-oss')

class UploadController extends BaseController {
  AliOssClient = new OSS(this.globalConfig.aliOss)
  async aliUpload(target, source) {
    try {
      // 填写OSS文件完整路径和本地文件的完整路径。OSS文件完整路径中不能包含Bucket名称。
      // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。
      const result = await this.AliOssClient.put(
        target,
        source
        // 自定义headers
        //,{headers}
      )
      // console.log(result)
      return result.url
    } catch (e) {
      console.log('=============aliUpload===========', e)
    }
  }

  upload = async (ctx, next) => {
    const req = ctx.request
    const { lastFilePath, md5 } = req.body
    const file = req.files.file
    // console.log('======upload========', req, req.body)

    try {
      const extname = path.extname(file.originalFilename)
      // console.log('======file========', file)
      // if(!config.imgTypeList.includes(extname.toLowerCase())){
      //   return reject(`仅允许以下格式：${config.imgTypeList.join('/')}`)
      // }

      if (
        config.imgTypeList.includes(extname.toLowerCase()) &&
        file.size > config.uploadImgMaxSize * 1024 * 1024
      ) {
        throw new Error(`图片最大不能超过${config.uploadImgMaxSize}M`)
      }

      if (
        config.videoTypeList.includes(extname.toLowerCase()) &&
        file.size > config.uploadVideoMaxSize * 1024 * 1024
      ) {
        throw new Error(`视频最大不能超过${config.uploadVideoMaxSize}M`)
      }

      const hashName = (
        new Date().getTime() + Math.ceil(Math.random() * 10000)
      ).toString(16)
      const fullName = '/blog-sys/' + hashName + extname

      await this.aliUpload(fullName, file.filepath)

      return (ctx.body = {
        success: true,
        result: {
          path: fullName
        }
      })
    } catch (e) {
      this.errorLogger.error('upload--------->', e)
      return (ctx.body = {
        success: false,
        msg: e.message || '上传失败'
      })
    }
  }
}

module.exports = new UploadController()
