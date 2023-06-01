import { useNavigate, useSearchParams } from 'react-router-dom'
import PostList from '@/components/post/post-list'
import { Search } from 'react-vant'
import { Search as SearchIcon, ArrowLeft } from '@react-vant/icons'
import { PostFilterParams, SearchFilter } from './components/search-filter'
import { useCallback, useState } from 'react'

export default function SearchResultPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [filterParams, setFilterParams] = useState<PostFilterParams>()
  const [listKey, setListKey] = useState(new Date().getTime())

  const handleConfirmFilter = useCallback((params: PostFilterParams) => {
    // console.log('========handleConfirmFilter========', params)
    setFilterParams(params)
    setListKey(new Date().getTime())
  }, [])

  return (
    <div className="search-result-page flex min-h-full flex-col">
      <div className="block-bg-color sticky top-0 z-10 flex items-center px-[8px]">
        <ArrowLeft fontSize="20px" onClick={() => history.back()} />
        <Search
          className="flex-1"
          shape="round"
          value={searchParams.get('keyword') ?? ''}
          leftIcon={<SearchIcon className="secondary-text" />}
          placeholder="请输入搜索关键词"
          onClickInput={() => navigate('/index/search')}
        />
        <SearchFilter onConfirm={handleConfirmFilter} />
      </div>
      <PostList
        className="flex-1"
        key={listKey}
        initParams={{ keyword: searchParams.get('keyword'), ...filterParams }}
      />
    </div>
  )
}
