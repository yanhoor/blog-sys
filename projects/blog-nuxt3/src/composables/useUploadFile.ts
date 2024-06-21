import {FileUtil} from 'sys-types'
import type {MediaFile} from 'sys-types'

export const useUploadFile = () => {
  async function handleUploadSingle(params: any) {
    try {
      const {success, result, msg} = await $HttpUtils.post(
        '/file/upload',
        params,
        {
          isFormData: true
        }
      )

      if (success) {
        return result
      } else {
        ElMessage.error(msg || '上传失败')
      }
    } catch (e) {
    }
  }

  async function handlePartUpload(
    fileUtil: FileUtil,
    type?: string
  ): Promise<MediaFile | undefined> {
    console.log('=========分片信息===========', fileUtil)
    const paramList: any[] = []
    fileUtil.chunkList.forEach((chunk) => {
      if (!fileUtil.uploadedChunkList.includes(chunk.chunkHash)) {
        paramList.push({
          file: chunk.chunk,
          isPartFile: 1,
          chunkPath: chunk.chunkHash
        })
      }
    })
    const failedList = await handleUploadMultipart(paramList, 1)
    if (failedList?.length) {
      ElMessage.error('分片上传失败')
      return
    }

    try {
      const {success, result, msg} = await $HttpUtils.post<MediaFile>(
        '/file/mergeMultiPart',
        {
          fileName: fileUtil.fileHash,
          ext: fileUtil.ext,
          type
        },
        {
          isFormData: true
        }
      )
      if (success) {
        return result as MediaFile
      } else {
        ElMessage.error(msg as string)
      }
    } catch (e) {
      ElMessage.error(e?.toString() || '分片上传失败')
    }
  }

  async function handleCheckFile(fileUtil: FileUtil) {
    try {
      const {success, result, msg} = await $HttpUtils.post<any>('/file/checkFile', {
        md5: fileUtil.md5
      })
      if (success) {
        if (result.isChunk) {
          fileUtil.setUploadedChunkList(result.chunkList)
        } else {
          return result.file
        }
      }
    } catch (e) {
    }
  }

  async function handleUploadPart(params: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const {success, result, msg} = await $HttpUtils.post(
          '/file/upload',
          params,
          {
            isFormData: true
          }
        )
        if (success) {
          resolve(result)
        } else {
          reject(params)
        }
      } catch (e) {
        reject(params)
      }
    })
  }

  async function handleUploadMultipart(paramList: any[], retry = 0) {
    const pl = await Promise.allSettled(
      paramList.map((p) => handleUploadPart(p))
    )
    const failedList = pl.filter((f) => f.status === 'rejected')
    console.log('=======handleUploadMultipart=======', pl, failedList)
    if (failedList.length) {
      if (retry) {
        await handleUploadMultipart(failedList.map((f) => f.reason))
      } else {
        return failedList
      }
    }
  }

  return {
    handleUploadSingle,
    handlePartUpload,
    handleCheckFile
  }
}
