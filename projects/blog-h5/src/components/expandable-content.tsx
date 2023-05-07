import { useState } from 'react'
interface Props {
  content: string
  maxLength?: number
  maxLine?: number
  expandText?: string
  collapseText?: string
}

export default function ExpandableContent({
  content,
  maxLine = 3,
  maxLength = 180,
  expandText = '展开',
  collapseText = '收起'
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false)
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

  function triggleExpand() {
    setIsExpanded((v) => !v)
  }

  return (
    <div className="whitespace-pre-wrap break-words transition-all">
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
