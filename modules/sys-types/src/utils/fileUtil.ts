import BMF from "browser-md5-file";

interface ChunkProps {
  index: number;
  chunk: Blob;
  chunkHash: string;
}

export class FileUtil {
  chunkSize = 2.5 * 1024 * 1024; // 每个分片大小
  maxChunkCount = 50; // 最多分片数
  chunkCount: number = 0; // 实际分片数量
  chunkList: ChunkProps[] = [];
  uploadedChunkList: string[] = [];
  file: File | null = null;
  fileHash: string = "";
  ext: string = "";
  md5: string = "";
  isSplit: boolean = false;

  constructor(file: File) {
    this.file = file;
  }

  async init() {
    this.fileHash = await this.createFileHash();
    this.ext = this.getFileExt();
    this.chunkCount = this.getChunkCount();
    if (this.chunkCount > 1) this.splitChunk();
  }

  async getMd5(): Promise<string> {
    return new Promise((resolve, reject) => {
      const bmf = new BMF();
      console.log("========开始计算文件 md5=========");
      bmf.md5(this.file, (err: any, md5: string) => {
        console.log("========文件 md5 计算完成=========");
        resolve(md5);
      });
    });
  }

  async createFileHash(): Promise<string> {
    this.md5 = await this.getMd5();
    // return Number(
    //   new Date().getTime() + '' + Math.ceil(Math.random() * 10000)
    // ).toString(16)
    return this.md5;
  }

  // 生成随机文件名
  getRandomFileName(): string {
    const d = new Date().getTime();
    const r = Math.floor(Math.random() * 100000);
    return d + "" + r;
  }

  // 获取文件后缀
  getFileExt(dot = false): string {
    const idx = this.file!.name.lastIndexOf(".");
    return this.file!.name.slice(dot ? idx : idx + 1);
  }

  getChunkCount(): number {
    // if (chunkSize) this.chunkSize = chunkSize
    let count = Math.ceil(this.file!.size / this.chunkSize);
    this.isSplit = count > 1;
    if (count > this.maxChunkCount) {
      this.chunkSize = Math.ceil(this.file!.size / this.maxChunkCount);
      count = this.maxChunkCount;
    }
    return count;
  }

  splitChunk() {
    for (let i = 0; i < this.chunkCount; i++) {
      const start = i * this.chunkSize;
      const end =
        i === this.chunkCount ? this.file!.size : (i + 1) * this.chunkSize;
      this.chunkList.push({
        index: i,
        chunk: this.file!.slice(start, end),
        chunkHash: `${this.fileHash}-${i + 1}`,
      });
    }
  }

  setUploadedChunkList(list: string[]) {
    this.uploadedChunkList = list;
  }
}
