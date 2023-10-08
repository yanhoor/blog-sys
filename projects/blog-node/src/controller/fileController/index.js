const BaseController = require('../baseController')
const upload = require('./upload')
const checkFile = require('./checkFile')
const mergeMultiPart = require('./mergeMultiPart')
const OSS = require('ali-oss')
const { FileType } = require('@prisma/client')
const path = require('path')
const fs = require('fs')
const config = require('config-lite')(__dirname)

class FileController extends BaseController {
  aliOssClient = new OSS(this.globalConfig.aliOss)

  constructor() {
    super()
    this.upload = upload.bind(this)
    this.checkFile = checkFile.bind(this)
    this.mergeMultiPart = mergeMultiPart.bind(this)
  }

  getFileType = (url) => {
    const idx = url.lastIndexOf('.')
    const extname = idx > -1 ? url.slice(idx) : '.' + url
    if (config.imgTypeList.includes(extname.toLowerCase())) {
      return FileType.image
    } else if (config.videoTypeList.includes(extname.toLowerCase())) {
      return FileType.video
    } else if (config.audioTypeList.includes(extname.toLowerCase())) {
      return FileType.audio
    }
  }

  fileCheck = async (file) => {
    return new Promise((r, j) => {
      const extname = path.extname(file.originalFilename)
      const fileType = this.getFileType(file.originalFilename)
      if (!fileType) {
        j({
          message: `不支持的文件格式`
        })
      }
      // console.log('======file========', file)
      // if(!config.imgTypeList.includes(extname.toLowerCase())){
      //   return reject(`仅允许以下格式：${config.imgTypeList.join('/')}`)
      // }

      if (
        fileType === FileType.image &&
        file.size > config.uploadImgMaxSize * 1024 * 1024
      ) {
        j({
          message: `图片最大不能超过${config.uploadImgMaxSize}M`
        })
      }

      if (
        fileType === FileType.video &&
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

  // 保存文件到本地目录
  async saveFileToLocal(file) {
    return new Promise(async (resolve, reject) => {
      const ext = path.extname(file.originalFilename)
      // console.log('======file========', file)
      // if(!config.imgTypeList.includes(ext)){
      //   return reject(`仅允许以下格式：${config.imgTypeList.join('/')}`)
      // }

      const hashName = Number(
        new Date().getTime() + '' + Math.ceil(Math.random() * 10000)
      ).toString(16)
      const extname = path.extname(file.originalFilename)
      const fullName = hashName + extname
      const savePath = path.join(
        __dirname,
        '../../../',
        config.uploadDir,
        fullName
      ) // 相对项目运行的根目录路径
      try {
        console.log('=======文件本地路径1111=======', file.filepath, savePath)
        fs.renameSync(file.filepath, savePath)
        console.log('=======文件本地路径=======', savePath)
        // const r = await this.aliUpload(fullName, file.filepath)
        // return resolve(savePath)
        return resolve(fullName)
      } catch (e) {
        console.log('保存图片失败--------------', e.message)
        return reject('保存图片失败')
      }
    })
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

        console.log('=======handleMultipartUpload start=========')
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

module.exports = new FileController()
