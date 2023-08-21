import { User } from "./user";
import { Comment } from "./comment";
import { Blog } from "./blog";

enum Type {
  collect_blog = "collect_blog",
  like_blog = "like_blog",
  comment = "comment",
  system_audit = "system_audit",
  comment_reply = "comment_reply",
}

export interface Notification {
  id: number | string;
  createdAt: string;
  content: any;
  createBy: User;
  createById: string | number;
  receiveUser: User;
  receiveUserId: string | number;
  blogId: number;
  isRead: number | string;
  type: Type;
  comment?: Comment;
  blog?: Blog;
}
