/*
 * @Author: yanhao yanhao@smallrig.com
 * @Date: 2024-11-13 17:14:58
 * @LastEditors: yanhao yanhao@smallrig.com
 * @LastEditTime: 2024-11-14 11:45:30
 * @FilePath: projects/blog-nuxt3/src/composables/useAliUpload.ts
 * @Description: 上传到阿里云
 */

import { commonMultipartUpload, type MediaFile, type FileUtil } from 'sys-types'

export const useAliUpload = () => {
  const { $HttpUtils } = useNuxtApp()

  async function handleAliMultipartUpload(
    fileUtil: FileUtil,
    fileType: string
  ) {
    try {
      const url = await commonMultipartUpload({
        file: fileUtil.file!
      })
      const file = await handleInsertUrl(fileUtil, url, fileType)

      return file
    } catch (e) {
      ElMessage.error(e as string)
      console.log('===================', e)
    }
  }

  /**
   * @description 将阿里云上传成功的文件 url 保存到数据库
   * @param fileUtil
   * @param url 阿里云 url
   * @param fileType 文件类型
   */
  async function handleInsertUrl(
    fileUtil: FileUtil,
    url: string,
    fileType: string
  ) {
    try {
      const { success, result, msg } = await $HttpUtils.post<MediaFile[]>(
        '/file/insertUrl',
        {
          fileList: [{ url, md5: fileUtil.md5, fileType }]
        }
      )
      if (success) {
        return Promise.resolve(result![0])
      } else {
        return Promise.reject(msg)
      }
    } catch (e: any) {
      return Promise.reject(e.message)
    }
  }

  return {
    handleAliMultipartUpload
  }
}
