export interface Blog{
  id?: number | string
  createById?: number | string
  title: string
  content: string
  cateId?: string | number
  launch?: string | number
  isLike?: boolean
  isCollect?: boolean
  likedByCount?: number
  collectedByCount?: number
}
