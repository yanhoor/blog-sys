const BaseController = require('./baseController')
const path = require('path')
const config = require('config-lite')(__dirname)
const OSS = require('ali-oss')

class UploadController extends BaseController{
  AliOssClient = new OSS(this.globalConfig.aliOss)

  async aliUpload (target, source) {
    try {
      // 填写OSS文件完整路径和本地文件的完整路径。OSS文件完整路径中不能包含Bucket名称。
      // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。
      const result = await this.AliOssClient.put(target, source
        // 自定义headers
        //,{headers}
      );
      // console.log(result)
      return result.url
    } catch (e) {
      console.log('=============aliUpload===========', e)
    }
  }

  upload = async(ctx, next) => {
    const req = ctx.request
    const { lastFilePath } = req.body
    // console.log('======upload========', req, req.body)
    let res
    try{
      res = await this.saveLocalFile(req.files.file)
    }catch(e){
      console.log('======upload========', e)
      return ctx.body = {
        success: false,
        msg: '上传失败'
      }
    }

    if(lastFilePath){
      // await this.deleteFile(lastFilePath)
      await this.deleteAliFile(lastFilePath)
    }
    ctx.body = {
      success: true,
      result: {
        path: res
      }
    }
  }

  // 保存文件到本地目录
  async saveLocalFile(file) {
    return new Promise(async (resolve, reject) => {
      const ext = path.extname(file.originalFilename)
      // console.log('======file========', file)
      // if(!config.imgTypeList.includes(ext)){
      //   return reject(`仅允许以下格式：${config.imgTypeList.join('/')}`)
      // }

      const hashName = (new Date().getTime() + Math.ceil(Math.random()*10000)).toString(16)
      const extname = path.extname(file.originalFilename)
      const fullName = '/blog-sys/' + hashName + extname
      const savePath = config.uploadDir + fullName // 相对项目运行的根目录路径
      try{
        // fs.renameSync(file.filepath, savePath)
        const r = await this.aliUpload(fullName, file.filepath)
        // return resolve(savePath)
        return resolve(fullName)
      }catch(e){
        console.log('保存图片失败--------------', e.message)
        return reject('保存图片失败')
      }
    })
  }

  async deleteAliFile(path) {
    try {
      // 填写Object完整路径。Object完整路径中不能包含Bucket名称。
      let result = await this.AliOssClient.delete(path);
      console.log('---------', result, path)
    } catch (err) {
      console.log('================deleteAliFile===========', err)
    }
  }

}

module.exports = new UploadController()
