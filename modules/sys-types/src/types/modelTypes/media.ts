import type { MediaFile } from "./mediaFile";
import type { Blog } from "./blog";
export interface Media {
  id?: string;
  createById?: string;
  blogId?: string;
  blog?: Blog;
  coverId?: string;
  cover?: MediaFile;
  fileId: string;
  url: string;
  file: MediaFile;
}
