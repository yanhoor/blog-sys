import { Button } from 'react-vant'
import { WarningO } from '@react-vant/icons'

interface Props {
  errorMsg?: string
  onRefresh?: () => void
}
export default function StatusError({
  onRefresh,
  errorMsg = '请求发生错误'
}: Props) {
  return (
    <div className="flex flex-col items-center gap-[12px] p-[12px]">
      <WarningO fontSize="32px" />
      <p className="text-[14px]">{errorMsg}</p>
      <Button type="primary" size="small" round hairline onClick={onRefresh}>
        点击重试
      </Button>
    </div>
  )
}
