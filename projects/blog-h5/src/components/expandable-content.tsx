import { useRef, useState } from 'react'
import { PhotoO } from '@react-vant/icons'
import { ImagePreview } from 'react-vant'
interface Props {
  content: string
  maxLength?: number
  maxLine?: number
  expandText?: string
  collapseText?: string
  imageUrl?: string
  className?: string
  onClickExpand?: (event: any) => void
}

export default function ExpandableContent({
  className = '',
  content,
  maxLine = 3,
  maxLength = 180,
  expandText = '展开',
  collapseText = '收起',
  onClickExpand,
  imageUrl
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false)
  const scrollTopRef = useRef(0)
  let showAction = false
  let isMultiLine = false
  let expandBtnText = expandText
  let collapseBtnText = collapseText
  let briefContent = content

  const lineList = content.split('\n')
  if (lineList.length > maxLine) {
    briefContent = lineList.slice(0, maxLine).join('\n') + '\n...'
    expandBtnText = '\n' + expandText
    collapseBtnText = '\n' + collapseText
    showAction = true
    isMultiLine = true
  } else if (content.length > maxLength) {
    briefContent = content.slice(0, maxLength) + '...'
    showAction = true
  }

  function triggerExpand(e: any) {
    e.stopPropagation()
    if (!isExpanded) {
      scrollTopRef.current = document.documentElement.scrollTop
    } else {
      document.documentElement.scrollTop = scrollTopRef.current
    }
    setIsExpanded((v) => !v)
  }

  function handlePreviewImage(url: string) {
    const base: string = import.meta.env.VITE_IMAGE_BASE
    ImagePreview.open({
      showIndex: false,
      images: [base + url]
    })
  }

  return (
    <div
      className={`regular-text whitespace-pre-wrap break-words transition-all ${className}`}
    >
      <span>{isExpanded ? content : briefContent}</span>
      {imageUrl ? (
        <div
          className="ml-[2px] inline-flex items-center whitespace-pre-wrap align-text-top leading-[18px]"
          onClick={(e) => {
            e.stopPropagation()
            handlePreviewImage(imageUrl)
          }}
        >
          <PhotoO fontSize="18px" className="inline text-primary" />
          <span className="ml-[2px] text-primary">查看图片</span>
        </div>
      ) : null}
      {showAction && (
        <span
          className={`text-primary ${isMultiLine ? '' : 'ml-[2px]'}`}
          onClick={onClickExpand || triggerExpand}
        >
          {isExpanded ? collapseBtnText : expandBtnText}
        </span>
      )}
    </div>
  )
}
