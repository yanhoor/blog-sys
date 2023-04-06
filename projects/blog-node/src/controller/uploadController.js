const BaseController = require('./baseController')
const path = require('path')
const config = require('config-lite')(__dirname)
const OSS = require('ali-oss')

class UploadController extends BaseController {
  AliOssClient = new OSS(this.globalConfig.aliOss)

  fileCheck = async (file) => {
    return new Promise((r, j) => {
      const extname = path.extname(file.originalFilename)
      // console.log('======file========', file)
      // if(!config.imgTypeList.includes(extname.toLowerCase())){
      //   return reject(`仅允许以下格式：${config.imgTypeList.join('/')}`)
      // }

      if (
        config.imgTypeList.includes(extname.toLowerCase()) &&
        file.size > config.uploadImgMaxSize * 1024 * 1024
      ) {
        j({
          message: `图片最大不能超过${config.uploadImgMaxSize}M`
        })
      }

      if (
        config.videoTypeList.includes(extname.toLowerCase()) &&
        file.size > config.uploadVideoMaxSize * 1024 * 1024
      ) {
        j({
          message: `视频最大不能超过${config.uploadVideoMaxSize}M`
        })
        // throw new Error(`视频最大不能超过${config.uploadVideoMaxSize}M`)
      }

      r()
    })
  }

  upload = async (ctx, next) => {
    const req = ctx.request
    const { lastFilePath, md5 } = req.body
    const file = req.files.file
    // console.log('======upload========', req, req.body)

    try {
      const extname = path.extname(file.originalFilename)

      await this.fileCheck(file)

      const hashName = (
        new Date().getTime() + Math.ceil(Math.random() * 10000)
      ).toString(16)
      const fullName = '/blog-sys/' + hashName + extname

      // 填写OSS文件完整路径和本地文件的完整路径。OSS文件完整路径中不能包含Bucket名称。
      // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。
      await this.AliOssClient.put(
        fullName,
        file.filepath
        // 自定义headers
        //,{headers}
      )

      // 断点续传
      // let checkpoint
      //
      // // 重试五次。
      // for (let i = 0; i < 5; i++) {
      //   try {
      //     const result = await this.AliOssClient.multipartUpload(
      //       fullName,
      //       file.filepath,
      //       {
      //         checkpoint,
      //         async progress(percentage, cpt) {
      //           checkpoint = cpt
      //           console.log('=====232323======', percentage, checkpoint)
      //         }
      //       }
      //     )
      //     console.log('////////', result)
      //     break // 跳出当前循环。
      //   } catch (e) {
      //     console.log(e)
      //   }
      // }

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
