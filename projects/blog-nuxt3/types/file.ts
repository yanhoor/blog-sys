import { User } from './user'
export interface File {
  id?: number | string
  createById: number | string
  createBy?: User
  md5: string
  url: string
}
