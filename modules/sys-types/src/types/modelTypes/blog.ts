import type { Media } from "./media";
import type { User } from "./user";
import type { BlogTopic } from "./blogTopic";
import { BlogContentType } from "@/constant";
export interface Blog {
  id?: string;
  createById?: string;
  createBy: User;
  content: string;
  createdAt: string;
  contentType: BlogContentType;
  cateId?: string;
  status?: string | number;
  isLike?: boolean;
  isCollect?: boolean;
  likedByCount?: number;
  collectedByCount?: number;
  commentsCount?: number;
  retweetCount?: number;
  medias: Media[];
  retweetOriginBlogId: string;
  retweetOriginBlog?: Blog;
  referenceBlogs?: Blog;
  topics: BlogTopic[];
}
