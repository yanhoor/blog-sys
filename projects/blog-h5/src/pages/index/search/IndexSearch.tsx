import { Search } from 'react-vant'
import { Search as SearchIcon, Cross } from '@react-vant/icons'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MyConfig from '@/config'
import YCard from '@/components/y-card'

export default function IndexSearchPage() {
  const [keyword, setKeyword] = useState('')
  const [historyList, setHistoryList] = useState<string[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const local = localStorage.getItem(MyConfig.SEARCH_HISTORY_KEY)
    const list = local ? JSON.parse(local) : []
    setHistoryList(list)
  }, [])

  // useEffect(handleSaveKeyword, [keyword])
  useEffect(handleSaveToStorage, [historyList])

  const handleSearch = useCallback(
    async function (val: string) {
      const kw = val.trim()
      if (!kw) return

      const tempList = JSON.parse(JSON.stringify(historyList))
      if (!tempList.includes(kw)) {
        tempList.unshift(kw)
      }
      handleSaveToStorage(tempList)
      navigate('/searchResult?keyword=' + kw)
    },
    [historyList]
  )

  function handleDeleteHistoryItem(item: string) {
    setHistoryList((list) => {
      const temp = JSON.parse(JSON.stringify(list))
      const index = temp.indexOf(item)
      temp.splice(index, 1)
      return temp
    })
  }

  function handleClearHistory() {
    setHistoryList([])
  }

  function handleSaveToStorage(list?: string[]) {
    // console.log('========handleSaveToStorage======', historyList)
    localStorage.setItem(
      MyConfig.SEARCH_HISTORY_KEY,
      JSON.stringify(list ?? historyList)
    )
  }

  return (
    <div className="index-search flex flex-col gap-[12px]">
      <Search
        shape="round"
        value={keyword}
        leftIcon={<SearchIcon className="secondary-text" />}
        onSearch={handleSearch}
        placeholder="请输入搜索关键词"
      />
      {historyList.length > 0 && (
        <div className="mx-[5px]">
          <div className="mb-[6px] flex justify-between text-[12px]">
            <span className="secondary-text">搜索历史</span>
            <span className="secondary-text" onClick={handleClearHistory}>
              全部清除
            </span>
          </div>
          <YCard>
            <div className="divide-color divide-y">
              {historyList.map((item) => (
                <div
                  className="flex items-center justify-between px-[6px] py-[8px]"
                  key={item}
                  onClick={() => navigate('/searchResult?keyword=' + item)}
                >
                  <span className="regular-text">{item}</span>
                  <Cross
                    className="secondary-text"
                    onClick={() => handleDeleteHistoryItem(item)}
                  />
                </div>
              ))}
            </div>
          </YCard>
        </div>
      )}
    </div>
  )
}
