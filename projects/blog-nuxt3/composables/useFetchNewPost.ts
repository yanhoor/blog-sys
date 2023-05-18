import { Blog } from 'sys-types'
export default () => {
  return useState<Blog | null>('fetchNewPost', () => null)
}
