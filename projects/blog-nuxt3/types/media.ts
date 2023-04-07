import { File } from './file'

export interface Media {
  id?: number | string
  createById?: number | string
  blogId?: number | string
  fileId: number | string
  file: File
}
