import { memo, useContext, useRef, useState } from 'react'
import { Popover } from 'react-vant'
import { ThemeContext } from '@/contexts'
import {
  WapNav,
  Ellipsis,
  ChartTrendingO,
  VideoO,
  MusicO,
  PhotoO,
  FriendsO
} from '@react-vant/icons'

export interface PostFilterParams {
  mediaType?: 'video' | 'audio' | 'image'
  isFollowing?: 1
  sort?: 2 | 3
}

interface Props {
  onConfirm: (params: PostFilterParams) => void
}

export const SearchFilter = memo(function ({ onConfirm }: Props) {
  console.log('========SearchFilter========')
  const theme = useContext(ThemeContext)
  const filterRef = useRef<any>()
  const [currentType, setCurrentType] = useState(1)

  function handleSelect(type: number) {
    if (currentType === type) return

    switch (type) {
      case 1:
        onConfirm({ sort: 2 })
        break
      case 2:
        onConfirm({ sort: 3 })
        break
      case 3:
        onConfirm({ mediaType: 'video' })
        break
      case 4:
        onConfirm({ mediaType: 'audio' })
        break
      case 5:
        onConfirm({ mediaType: 'image' })
        break
      case 6:
        onConfirm({ isFollowing: 1 })
        break
    }
    setCurrentType(type)
    filterRef.current?.hide()
  }

  return (
    <Popover
      ref={filterRef}
      theme={theme}
      reference={<WapNav fontSize="20px" />}
      placement="bottom-end"
    >
      <div className="flex flex-col gap-2 p-3">
        <div
          className={`flex items-center gap-[4px] ${
            currentType === 1 ? 'text-primary' : ''
          }`}
          onClick={() => handleSelect(1)}
        >
          <Ellipsis
            fontSize="16px"
            className={`${currentType === 1 ? 'text-primary' : ''}`}
          />
          <div className="whitespace-nowrap text-[14px]">全部</div>
        </div>
        <div
          className={`flex items-center gap-[4px] ${
            currentType === 2 ? 'text-primary' : ''
          }`}
          onClick={() => handleSelect(2)}
        >
          <ChartTrendingO fontSize="16px" />
          <div className="whitespace-nowrap text-[14px]">最热</div>
        </div>
        <div
          className={`flex items-center gap-[4px] ${
            currentType === 3 ? 'text-primary' : ''
          }`}
          onClick={() => handleSelect(3)}
        >
          <VideoO fontSize="16px" />
          <div className="whitespace-nowrap text-[14px]">视频</div>
        </div>
        <div
          className={`flex items-center gap-[4px] ${
            currentType === 4 ? 'text-primary' : ''
          }`}
          onClick={() => handleSelect(4)}
        >
          <MusicO fontSize="16px" />
          <div className="whitespace-nowrap text-[14px]">音频</div>
        </div>
        <div
          className={`flex items-center gap-[4px] ${
            currentType === 5 ? 'text-primary' : ''
          }`}
          onClick={() => handleSelect(5)}
        >
          <PhotoO fontSize="16px" />
          <div className="whitespace-nowrap text-[14px]">图片</div>
        </div>
        <div
          className={`flex items-center gap-[4px] ${
            currentType === 6 ? 'text-primary' : ''
          }`}
          onClick={() => handleSelect(6)}
        >
          <FriendsO fontSize="16px" />
          <div className="whitespace-nowrap text-[14px]">关注</div>
        </div>
      </div>
    </Popover>
  )
})
