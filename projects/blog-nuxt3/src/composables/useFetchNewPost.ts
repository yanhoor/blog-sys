import type { Blog } from 'sys-types'

/**
 * @description 新发布的博客
 */
export default () => {
  return useState<Blog | undefined>('fetchNewPost', () => undefined)
}
