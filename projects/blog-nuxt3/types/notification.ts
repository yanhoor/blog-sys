import { User } from './user'

export interface Notification{
  id: number | string
  createdAt: string
  content: any
  createBy: User
  createById: string | number
  receiveUser: User
  receiveUserId: string | number
  isRead: number | string
}
