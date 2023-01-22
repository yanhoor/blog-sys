import { Media } from './media'
export interface Blog{
  id?: number | string
  createById?: number | string
  content: string
  cateId?: string | number
  launch?: string | number
  isLike?: boolean
  isCollect?: boolean
  likedByCount?: number
  collectedByCount?: number
  medias: Media[]
}
