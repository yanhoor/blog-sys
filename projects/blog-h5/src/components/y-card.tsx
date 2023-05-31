import { ReactNode } from 'react'
import { Card } from 'react-vant'

interface Props {
  className?: string
  padding?: string
  radius?: string
  children: ReactNode
}
export default function YCard({
  className,
  children,
  padding = '8px',
  radius = '3px'
}: Props) {
  return (
    <Card
      className={`post-item mb-[8px] ${className || ''}`}
      round
      style={{
        '--rv-card-radius': radius,
        '--rv-card-body-padding': padding
      }}
    >
      <Card.Body>{children}</Card.Body>
    </Card>
  )
}
