import AliOSS from 'ali-oss'
import { FileUtil } from './fileUtil'
import secret from '../secret'

const projectName = 'blog-sys'
const ossClient = new AliOSS(secret.aliOss)

interface UploadOptions {
  file: File
  fileName?: string
}
export type MultipartUploadOptions = UploadOptions &
  AliOSS.MultipartUploadOptions

/**
 * @description 阿里云分片上传，成功则返回文件 url，失败就会取消上传
 * @param file 浏览器选择的文件
 * @param fileName 文件名
 * @param otherOptions 阿里云分片上传参数
 */
export async function commonMultipartUpload({
  file,
  fileName,
  ...otherOptions
}: MultipartUploadOptions) {
  const fileUtil = new FileUtil(file)
  const ext = fileUtil.getFileExt(true)
  if (!fileName) fileName = fileUtil.getRandomFileName() + ext

  const fileKey = `${projectName}/${fileName}`
  try {
    const result = await ossClient.multipartUpload(fileKey, file, {
      // 获取分片上传进度、断点和返回值。
      progress: (p, cpt, res) => {
        console.log('===========commonMultipartUpload==========', p, cpt, res)
      },
      // 设置并发上传的分片数量。
      parallel: 4,
      // 设置分片大小。默认值为1 MB，最小值为100 KB。
      partSize: 1024 * 1024,
      // headers,
      // 自定义元数据，通过HeadObject接口可以获取Object的元数据。
      // meta: { year: 2020, people: "test" },
      // mime: "text/plain",
      ...otherOptions
    })
    let url = (result.res as any).requestUrls[0]
    console.log('===========commonMultipartUpload url==========', result.res)
    const idx = url.indexOf('?')
    if (idx > -1) {
      // 去掉分片上传成功的 url 带有 uploadId 参数
      url = url.slice(0, url.indexOf('?'))
    }
    return url
  } catch (e: any) {
    console.log('===========commonMultipartUpload 失败==========', e)
    if (e?.checkpoint?.uploadId) {
      try {
        await ossClient.abortMultipartUpload(fileKey, e.checkpoint.uploadId)
        console.log('========commonMultipartUpload 取消上传成功=====')
      } catch (e) {
        console.log('=======commonMultipartUpload 取消上传失败=====', e)
      }
    }
    return Promise.reject(e)
  }
}
