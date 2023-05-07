import { Empty, Button } from 'react-vant'

interface Props {
  onRefresh?: () => void
}
export default function StatusEmpty({ onRefresh }: Props) {
  return (
    <Empty description="内容为空">
      <Button type="primary" size="small" plain hairline onClick={onRefresh}>
        点击刷新
      </Button>
    </Empty>
  )
}
