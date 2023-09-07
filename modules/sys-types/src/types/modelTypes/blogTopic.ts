import { Blog } from "./blog";
import { Topic } from "./topic";
export interface BlogTopic {
  blogId?: string | number;
  blog?: Blog;
  topicId?: string;
  topic: Topic;
}
