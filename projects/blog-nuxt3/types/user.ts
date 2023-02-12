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
  isFollowing?: boolean // 是否正在关注
  isMyFan?: boolean // 是否是粉丝
}
