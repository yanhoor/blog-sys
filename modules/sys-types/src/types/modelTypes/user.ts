export interface User {
  id?: string;
  mobile: string;
  name: string;
  avatar?: string;
  profileCardBg?: string;
  introduce?: string;
  gender: string | number;
  birthday?: string;
  lock: number;
  followerCount?: number;
  followingCount?: number;
  likedCount?: number; // 获赞
  isFollowing?: boolean; // 是否正在关注
  isMyFan?: boolean; // 是否是粉丝
}
