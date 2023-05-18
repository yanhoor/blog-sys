import { MediaFile } from "./mediaFile";
import { Blog } from "./blog";
export interface Media {
  id?: number | string;
  createById?: number | string;
  blogId?: number | string;
  blog?: Blog;
  coverId?: number | string;
  cover?: MediaFile;
  fileId: number | string;
  url: string;
  file: MediaFile;
}
