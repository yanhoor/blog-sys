import { NavBar } from 'react-vant'
import { ArrowLeft } from '@react-vant/icons'

interface Props {
  title?: string
}

export default function CustomNavBar({ title }: Props) {
  return (
    <NavBar
      style={{ '--rv-nav-bar-icon-color': '#000' }}
      leftArrow={<ArrowLeft />}
      placeholder
      fixed
      title={title}
      onClickLeft={() => history.back()}
    />
  )
}
