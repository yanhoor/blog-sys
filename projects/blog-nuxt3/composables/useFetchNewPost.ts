
import { Blog } from '@/types'
export default () => {
  return useState<Blog | null>('fetchNewPost', () => null)
}
