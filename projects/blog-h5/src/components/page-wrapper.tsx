import { ReactNode } from 'react'
import { Helmet } from 'react-helmet'

interface Props {
  children: ReactNode
  title?: string
  className?: string
  titleMaxLength?: number
}

export default function PageWrapper({
  children,
  title,
  className,
  titleMaxLength = 12
}: Props) {
  return (
    <div className={`page-wrapper h-full ${className || ''}`}>
      {title ? (
        <Helmet titleTemplate="%s | Vipot">
          <title>
            {title.length > titleMaxLength
              ? title.slice(0, titleMaxLength) + '...'
              : title}
          </title>
        </Helmet>
      ) : null}
      {children}
    </div>
  )
}
