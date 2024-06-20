import type { Blog } from "./blog";
import type { Topic } from "./topic";
export interface BlogTopic {
  blogId?: string;
  blog?: Blog;
  topicId?: string;
  topic: Topic;
}
