const BaseController = require('./baseController')
const path = require('path')
const config = require('config-lite')(__dirname)
const OSS = require('ali-oss')

class UploadController extends BaseController {
  aliOssClient = new OSS(this.globalConfig.aliOss)

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
    // console.log('======upload========', file.size, file.size > 2 * 1024 * 1024)

    try {
      let fullName
      if (file.size < config.multiPartUploadSwitchSize * 1024 * 1024) {
        fullName = await this.handleUpload(file)
      } else {
        fullName = await this.handleMultipartUpload(file)
      }

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
        msg: e?.message || e || '上传失败'
      })
    }
  }

  // 整体上传
  handleUpload = (file) => {
    return new Promise(async (r, j) => {
      try {
        // console.log('handleUpload')
        const extname = path.extname(file.originalFilename)

        await this.fileCheck(file)

        const hashName = (
          new Date().getTime() + Math.ceil(Math.random() * 10000)
        ).toString(16)
        const fullName = '/blog-sys/' + hashName + extname

        // 填写OSS文件完整路径和本地文件的完整路径。OSS文件完整路径中不能包含Bucket名称。
        // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。
        await this.aliOssClient.put(
          fullName,
          file.filepath
          // 自定义headers
          //,{headers}
        )
        r(fullName)
      } catch (e) {
        j(e)
      }
    })
  }

  // 分片上传
  handleMultipartUpload = (file) => {
    return new Promise(async (r, j) => {
      try {
        // console.log('multipartUpload')
        const extname = path.extname(file.originalFilename)

        await this.fileCheck(file)

        const hashName = (
          new Date().getTime() + Math.ceil(Math.random() * 10000)
        ).toString(16)
        const fullName = '/blog-sys/' + hashName + extname

        const result = await this.aliOssClient.initMultipartUpload(fullName)

        const fileSize = file.size
        const partSize = config.multiPartPerSize * 1024 * 1024
        const partSum = Math.ceil(fileSize / partSize)
        const partList = []
        for (let i = 1; i <= partSum; i++) {
          const start = partSize * (i - 1)
          const end = Math.min(start + partSize, fileSize)
          partList.push(
            this.aliOssClient.uploadPart(
              fullName,
              result.uploadId,
              i,
              file.filepath,
              start,
              end,
              {
                timeout: 1000 * 60 * 10 // 10 min 超时
              }
            )
          )
        }

        // console.log('======切片数量=======', partSum)
        const done = await Promise.all(partList)
        // console.log('======5555=======', done)

        //complete
        const completeData = await this.aliOssClient.completeMultipartUpload(
          fullName,
          result.uploadId,
          done.map((p, i) => ({
            number: i + 1,
            etag: p.res.headers.etag
          }))
        )
        // console.log('==========666666666', completeData)
        r(fullName)
      } catch (e) {
        j(e)
      }
    })
  }
}

module.exports = new UploadController()
