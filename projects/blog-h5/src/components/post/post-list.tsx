import { Blog } from 'sys-types'
import AppendListWrapper from '@/components/append-list-wrapper'
import PostItem from '@/components/post/post-item'
import { ReactNode } from 'react'

interface Props {
  url?: string
  initParams?: object
  className?: string
}

export default function PostList({
  url = '/blog/list',
  initParams,
  className
}: Props) {
  // console.log('========PostList========')
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
    <AppendListWrapper
      url={url}
      className={className}
      createList={createPostList}
      initParams={initParams}
    />
  )
}
