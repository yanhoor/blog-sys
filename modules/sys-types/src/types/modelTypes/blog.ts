import type { Media } from "./media";
import type { User } from "./user";
import type { BlogTopic } from "./blogTopic";
export interface Blog {
  id?: number | string;
  createById?: number | string;
  createBy: User;
  content: string;
  createdAt: string;
  cateId?: string | number;
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
