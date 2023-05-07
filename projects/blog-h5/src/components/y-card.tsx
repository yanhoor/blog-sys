import { PropsWithChildren, ReactNode } from 'react'
import { Card } from 'react-vant'

interface Props {
  className?: string
  children: ReactNode
}
export default function YCard({ className, children }: Props) {
  return (
    <Card className={`post-item mb-[8px] ${className}`}>
      <Card.Body style={{ '--rv-card-body-padding': '8px' }}>
        {children}
      </Card.Body>
    </Card>
  )
}
