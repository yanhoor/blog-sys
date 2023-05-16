import { ActionSheet, Toast } from 'react-vant'
import { Media } from '../../../../../modules/sys-types'
import MediaImageItem from '@/components/media/media-image-item'
import ExpandableContent from '@/components/expandable-content'
import { useNavigate } from 'react-router-dom'

interface Props {
  media: Media
  visible: boolean
  onChangeVisible: () => void
}

export default function MediaDetailView({
  media,
  visible,
  onChangeVisible
}: Props) {
  const navigate = useNavigate()

  function toPostDetail() {
    navigate('/post/' + media.blogId)
  }

  return (
    <div className="media-detail-view">
      <ActionSheet
        style={{
          '--rv-action-sheet-max-height': '30%'
        }}
        visible={visible}
        round={false}
        onClickOverlay={onChangeVisible}
      >
        <div className="bg-black">
          <MediaImageItem
            className="w-full overflow-clip object-cover"
            url={media.file.url}
            quality={60}
          />
          <div className="p-[6px]" onClick={toPostDetail}>
            <ExpandableContent
              className="text-white"
              content={media.blog.content}
              expandText="全文"
              maxLength={40}
              onClickExpand={toPostDetail}
            />
          </div>
        </div>
      </ActionSheet>
    </div>
  )
}
