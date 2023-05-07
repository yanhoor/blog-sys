type Props = {
  type: string
}

export default function TestA(props: Props) {
  return <div>testA props.type is: {props.type}</div>
}
