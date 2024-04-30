import type { User } from "./user";
import type { Blog } from "./blog";
import type { MediaFile } from "./mediaFile";
export interface Comment {
  id: number | string;
  content?: string;
  imageId?: number;
  image?: MediaFile;
  createdAt: string;
  createBy: User;
  createById: string | number;
  replyTo: User;
  replyToId: string | number;
  blog: Blog;
  blogId: string | number;
  topCommentId: string | number;
  replyCommentId: string | number;
  isLike: boolean;
  likedByCount: number;
  childCommentsCount?: number;
  replyComment?: Comment;
  replyItems?: Comment[];
  childComments?: Comment[];
}
