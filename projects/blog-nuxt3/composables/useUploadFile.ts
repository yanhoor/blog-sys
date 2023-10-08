import FileUtil from '~/utils/fileUtil'
import { MediaFile } from 'sys-types'

export const useUploadFile = () => {
  async function handleUploadSingle(params) {
    const { message } = useDiscreteApi(['message'])
    try {
      const { success, result, msg } = await useFetchPost(
        '/file/upload',
        params,
        true
      )

      if (success) {
        return result
      } else {
        message.error(msg || '上传失败')
      }
    } catch (e) {}
  }

  async function handlePartUpload(
    fileUtil: FileUtil,
    type?: string
  ): Promise<MediaFile | undefined> {
    const { message } = useDiscreteApi(['message'])

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
      message.error('分片上传失败')
      return
    }

    try {
      const { success, result, msg } = await useFetchPost(
        '/file/mergeMultiPart',
        {
          fileName: fileUtil.fileHash,
          ext: fileUtil.ext,
          type
        },
        true
      )
      if (success) {
        return result
      } else {
        message.error(msg as string)
      }
    } catch (e) {
      message.error(e?.toString() || '分片上传失败')
    }
  }

  async function handleCheckFile(fileUtil: FileUtil) {
    try {
      const { success, result, msg } = await useFetchPost('/file/checkFile', {
        md5: fileUtil.md5
      })
      if (success) {
        if (result.isChunk) {
          fileUtil.setUploadedChunkList(result.chunkList)
        } else {
          return result.file
        }
      }
    } catch (e) {}
  }

  async function handleUploadPart(params) {
    return new Promise(async (resolve, reject) => {
      try {
        const { success, result, msg } = await useFetchPost(
          '/file/upload',
          params,
          true
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
