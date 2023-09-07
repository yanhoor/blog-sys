import { Media } from "./media";
import { User } from "./user";
import { BlogTopic } from "./blogTopic";
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
  medias: Media[];
  topics: BlogTopic[];
}
