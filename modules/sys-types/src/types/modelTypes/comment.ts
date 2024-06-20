import type { User } from "./user";
import type { Blog } from "./blog";
import type { MediaFile } from "./mediaFile";
export interface Comment {
  id: string;
  content?: string;
  imageId?: number;
  image?: MediaFile;
  createdAt: string;
  createBy: User;
  createById: string;
  replyTo: User;
  replyToId: string;
  blog: Blog;
  blogId: string;
  topCommentId: string;
  replyCommentId: string;
  isLike: boolean;
  likedByCount: number;
  childCommentsCount?: number;
  replyComment?: Comment;
  replyItems?: Comment[];
  childComments?: Comment[];
}
