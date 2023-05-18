import { User } from "./user";
import { Blog } from "./blog";
import { MediaFile } from "@/types/mediaFile";
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
  replyComment?: Comment;
  replyItems?: Comment[];
  childComments?: Comment[];
}
