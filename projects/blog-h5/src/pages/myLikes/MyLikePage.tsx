import PageWrapper from '@/components/page-wrapper'
import CustomNavBar from '@/components/custom/custom-nav-bar'
import PostList from '@/components/post/post-list'
import { user_markBlogList } from '@/http'

export default function MyLikePage() {
  return (
    <PageWrapper title="我的点赞">
      <CustomNavBar title="我的点赞" />
      <div className="mx-[5px] mt-[5px]">
        <PostList key={0} initParams={{ type: 1 }} url={user_markBlogList} />
      </div>
    </PageWrapper>
  )
}
