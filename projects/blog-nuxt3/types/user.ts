export interface User{
  id?: number | string
  mobile: string
  name: string
  avatar?: string
  profileCardBg?: string
  introduce?: string
  sign?: string
  gender: string | number
  birthday?: string | number
  lock: number
  followerCount?: number
  followingCount?: number
}
