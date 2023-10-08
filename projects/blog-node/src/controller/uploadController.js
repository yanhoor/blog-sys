const BaseController = require('./baseController')
const path = require('path')
const config = require('config-lite')(__dirname)
const OSS = require('ali-oss')
const prisma = require('../database/prisma')
const md5File = require('md5-file')
const { FileType } = require('@prisma/client')
const fs = require('fs')

class UploadController extends BaseController {
  aliOssClient = new OSS(this.globalConfig.aliOss)

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

  // 根据 md5 获取已上传的文件，或已上传的分片
  checkFile = async (ctx, next) => {
    const req = ctx.request
    const { md5 } = req.body
    // console.log('======upload========', file.size, file.size > 2 * 1024 * 1024)

    let userId = await this.getAuthUserId(ctx, next)
    try {
      if (!userId) throw new Error('未登录')
      if (!md5) throw new Error('md5 不存在')
    } catch (e) {
      ctx.body = {
        success: false,
        msg: e.message
      }
      return false
    }

    try {
      let fileRes = await prisma.file.findUnique({
        where: {
          md5,
          createById: userId
        },
        select: {
          id: true,
          md5: true,
          url: true,
          createById: true
        }
      })

      const filesList = await fs.promises.readdir(config.uploadDir)
      const chunkList = filesList.filter((f) => f.startsWith(md5))

      if (fileRes) {
        return (ctx.body = {
          success: true,
          result: {
            isChunk: false,
            file: fileRes
          }
        })
      } else if (chunkList.length) {
        return (ctx.body = {
          success: true,
          result: {
            isChunk: true,
            chunkList
          }
        })
      } else {
        return (ctx.body = {
          success: true,
          msg: '文件不存在'
        })
      }
    } catch (e) {
      this.errorLogger.error('checkFile--------->', e)
      return (ctx.body = {
        success: false,
        msg: e?.message || e
      })
    }
  }

  upload = async (ctx, next) => {
    const req = ctx.request
    const { type, isPartFile = 0 } = req.body
    const file = req.files.file
    // console.log('======upload========', file.size, file.size > 2 * 1024 * 1024)

    this.defaultLogger.info('=========接收到文件========')
    let userId = await this.getAuthUserId(ctx, next)
    try {
      if (!userId) throw new Error('未登录')
    } catch (e) {
      ctx.body = {
        success: false,
        msg: e.message
      }
      return false
    }

    let fileRes

    try {
      // 分片上传
      if (isPartFile) {
        return this.handleLocalUploadPart(ctx, next)
      }

      // 其他单文件
      const m5 = await md5File(file.filepath)
      fileRes = await prisma.file.findUnique({
        where: {
          md5: m5,
          createById: userId
        },
        select: {
          id: true,
          md5: true,
          url: true,
          createById: true
        }
      })
      if (!fileRes) {
        // if (file.size < config.multiPartUploadSwitchSize * 1024 * 1024) {
        //   fullName = await this.handleUpload(file, m5)
        // } else {
        //   fullName = await this.handleMultipartUpload(file, m5)
        // }
        const idx = file.filepath.lastIndexOf('/')
        const localName = file.filepath.slice(idx + 1)
        // const fileType = type || this.getFileType(fullName)
        const fileType = type || this.getFileType(localName)
        console.log('=======新建上传文件信息=======', file.filepath, localName)
        fileRes = await prisma.file.create({
          data: {
            createById: userId,
            md5: m5,
            // url: fullName,
            url: localName,
            type: fileType
          },
          select: {
            id: true,
            md5: true,
            url: true,
            createById: true
          }
        })
      }

      return (ctx.body = {
        success: true,
        result: fileRes
      })
    } catch (e) {
      this.errorLogger.error('upload--------->', e)
      return (ctx.body = {
        success: false,
        msg: e?.message || e || '上传失败'
      })
    }
  }

  // 对分片文件改名
  handleLocalUploadPart = async (ctx, next) => {
    const req = ctx.request
    const { chunkPath } = req.body
    const file = req.files.file

    try {
      const fp = file.filepath
      const idx = fp.lastIndexOf('/')
      await fs.promises.rename(fp, fp.slice(0, idx + 1) + chunkPath)
      return (ctx.body = {
        success: true
      })
    } catch (e) {
      this.errorLogger.error('分片上传处理失败--------->', e)
      return (ctx.body = {
        success: false,
        msg: e?.message || e || '上传失败'
      })
    }
  }

  // 将分片合并成完整文件
  mergeMultiPart = async (ctx, next) => {
    const req = ctx.request
    const { fileName, ext, type } = req.body
    let userId = await this.getAuthUserId(ctx, next)

    try {
      if (!userId) throw new Error('未登录')
      if (!ext || !fileName) throw new Error('参数错误')
    } catch (e) {
      ctx.body = {
        success: false,
        msg: e.message
      }
      return false
    }

    try {
      const outputPath = config.uploadDir + fileName + '.' + ext
      const filesList = await fs.promises.readdir(config.uploadDir)
      const chunkList = filesList
        .filter((f) => f.startsWith(fileName))
        .sort((a, b) => {
          const idxa = a.lastIndexOf('-')
          const idxb = b.lastIndexOf('-')
          return Number(a.slice(idxa + 1)) - Number(b.slice(idxb + 1))
        })
      this.defaultLogger.info(
        '========mergeMultiPart=========',
        chunkList,
        outputPath
      )
      if (!chunkList.length) {
        return (ctx.body = {
          success: false,
          msg: '分片不存在'
        })
      }

      const writeStream = fs.createWriteStream(outputPath)
      for (const chunk of chunkList) {
        const chunkPath = config.uploadDir + chunk
        const readStream = fs.createReadStream(chunkPath)
        await new Promise((resolve, reject) => {
          readStream.pipe(writeStream, { end: false })
          readStream.on('end', () => {
            fs.promises.unlink(chunkPath)
            resolve()
          })
          readStream.on('error', reject)
        })
      }

      writeStream.end()

      const fileType = type || this.getFileType(ext)
      const m5 = await md5File(outputPath)
      this.defaultLogger.info('=======新建上传文件信息=======', m5)
      let fileRes = await prisma.file.create({
        data: {
          createById: userId,
          md5: m5,
          url: fileName + '.' + ext,
          type: fileType
        },
        select: {
          id: true,
          md5: true,
          url: true,
          createById: true
        }
      })

      return (ctx.body = {
        success: true,
        result: fileRes
      })
    } catch (e) {
      this.errorLogger.error('mergeMultiPart--------->', e)
      return (ctx.body = {
        success: false,
        msg: e?.message || e || '合并文件失败'
      })
    }
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

module.exports = new UploadController()
