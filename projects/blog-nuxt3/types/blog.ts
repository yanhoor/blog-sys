import { Media } from './media'
export interface Blog{
  id?: number | string
  createById?: number | string
  content: string
  cateId?: string | number
  status?: string | number
  isLike?: boolean
  isCollect?: boolean
  likedByCount?: number
  collectedByCount?: number
  commentsCount?: number
  medias: Media[]
}
