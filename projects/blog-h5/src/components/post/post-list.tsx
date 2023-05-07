import { Blog } from 'sys-types'
import AppendListWrapper from '@/components/append-list-wrapper'
import PostItem from '@/components/post/post-item'

interface Props {
  url?: string
  initParams?: any
}

export default function PostList({ url = '/blog/list', initParams }: Props) {
  const createItem = (post: Blog) => {
    return <PostItem post={post} key={post.id}></PostItem>
  }

  return (
    <div>
      <AppendListWrapper
        url={url}
        createItem={createItem}
        initParams={initParams}
      />
    </div>
  )
}
