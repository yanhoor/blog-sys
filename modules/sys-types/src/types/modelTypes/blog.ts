import { Media } from './media'
import { User } from './user'
export interface Blog {
  id?: number | string
  createById?: number | string
  createBy: User
  content: string
  createdAt: string
  cateId?: string | number
  status?: string | number
  isLike?: boolean
  isCollect?: boolean
  likedByCount?: number
  collectedByCount?: number
  commentsCount?: number
  medias: Media[]
}
