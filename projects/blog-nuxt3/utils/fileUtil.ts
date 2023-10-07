import BMF from 'browser-md5-file'

interface ChunkProps {
  index: number
  chunk: Blob
  chunkHash: string
}

class FileUtil {
  chunkSize = 2.5 * 1024 * 1024 // 每个分片大小
  maxChunkCount = 20 // 最多分片数
  chunkCount: number = 0 // 实际分片数量
  chunkList: ChunkProps[] = []
  file: File | null = null
  fileHash: string = ''
  ext: string = ''
  md5: string = ''
  isSplit: boolean = false

  constructor(file: File, chunkSize?: number) {
    this.file = file
    this.fileHash = this.createFileHash()
    this.ext = this.getFileExt()
    this.chunkCount = this.getChunkCount(chunkSize)
    if (this.chunkCount > 1) this.splitChunk()
  }

  async getMd5(): Promise<string> {
    return new Promise((resolve, reject) => {
      const bmf = new BMF()
      bmf.md5(this.file, (err, md5: string) => {
        resolve(md5)
      })
    })
  }

  createFileHash(): string {
    return Number(
      new Date().getTime() + '' + Math.ceil(Math.random() * 10000)
    ).toString(16)
  }

  getFileExt(): string {
    const idx = this.file!.name.lastIndexOf('.')
    return this.file!.name.slice(idx + 1)
  }

  getChunkCount(chunkSize?: number): number {
    if (chunkSize) this.chunkSize = chunkSize
    let count = Math.ceil(this.file!.size / this.chunkSize)
    this.isSplit = count > 1
    if (count > this.maxChunkCount) {
      this.chunkSize = Math.ceil(this.file!.size / this.maxChunkCount)
      count = this.maxChunkCount
    }
    return count
  }

  splitChunk() {
    for (let i = 0; i < this.chunkCount; i++) {
      const start = i * this.chunkSize
      const end =
        i === this.chunkCount ? this.file!.size : (i + 1) * this.chunkSize
      this.chunkList.push({
        index: i,
        chunk: this.file!.slice(start, end),
        chunkHash: `${this.fileHash}-${i + 1}`
      })
    }
  }
}

export default FileUtil
