import type { User } from "./user";
import type { Comment } from "./comment";
import type { Blog } from "./blog";

enum Type {
  collect_blog = "collect_blog",
  like_blog = "like_blog",
  comment = "comment",
  system_audit = "system_audit",
  comment_reply = "comment_reply",
}

export interface Notification {
  id: string;
  createdAt: string;
  content: any;
  createBy: User;
  createById: string;
  receiveUser: User;
  receiveUserId: string;
  blogId: number;
  isRead: number | string;
  type: Type;
  comment?: Comment;
  blog?: Blog;
}
