import { Blog } from 'sys-types'
import AppendListWrapper from '@/components/append-list-wrapper'
import PostItem from '@/components/post/post-item'
import { ReactNode } from 'react'

interface Props {
  url?: string
  initParams?: any
}

export default function PostList({ url = '/blog/list', initParams }: Props) {
  const createPostList = (postList: Blog[]): ReactNode => {
    return (
      <div className="post-list">
        {postList.map((post) => (
          <PostItem post={post} key={post.id}></PostItem>
        ))}
      </div>
    )
  }

  return (
    <div>
      <AppendListWrapper
        url={url}
        createList={createPostList}
        initParams={initParams}
      />
    </div>
  )
}
