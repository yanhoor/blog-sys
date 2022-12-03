import { User } from './user'
import { Blog } from './blog'
export interface Comment {
  id: number | string
  content: string
  createdAt: string
  createBy: User
  createById: string | number
  replyTo: User
  replyToId: string | number
  blog: Blog
  blogId: string | number
  replyCommentId: string | number
}
