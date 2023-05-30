import { useRef, useState } from 'react'
import { PhotoO } from '@react-vant/icons'
import { ImagePreview } from 'react-vant'
interface Props {
  content: string
  maxLength?: number
  maxLine?: number
  expandText?: string
  collapseText?: string
  className?: string
}

export default function ExpandableContent({
  className = '',
  content,
  maxLine = 3,
  maxLength = 180,
  expandText = '展开',
  collapseText = '收起'
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

  return (
    <div
      className={`whitespace-pre-wrap break-words transition-all ${className}`}
    >
      {isExpanded ? content : briefContent}
      {showAction && (
        <span
          className={`text-green-700 ${isMultiLine ? '' : 'ml-1'}`}
          onClick={triggleExpand}
        >
          {isExpanded ? collapseBtnText : expandBtnText}
        </span>
      )}
    </div>
  )
}
