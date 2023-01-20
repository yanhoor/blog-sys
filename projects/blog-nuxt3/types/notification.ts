import { User } from './user'

enum Type{
  collect_blog = 'collect_blog',
  like_blog = 'like_blog',
  comment = 'comment',
  comment_reply = 'comment_reply'
}

export interface Notification{
  id: number | string
  createdAt: string
  content: any
  createBy: User
  createById: string | number
  receiveUser: User
  receiveUserId: string | number
  isRead: number | string
  type: Type
}
