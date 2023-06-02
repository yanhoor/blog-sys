import { ReactNode } from 'react'
import { Card } from 'react-vant'

interface Props {
  className?: string
  padding?: string
  radius?: string
  children: ReactNode
}
export default function YCard({ className, children }: Props) {
  return (
    <div
      className={`card-bg-color mb-[8px] rounded-[3px] p-[8px] shadow ${
        className || ''
      }`}
    >
      {children}
    </div>
  )
}
