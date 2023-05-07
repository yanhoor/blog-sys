import { useParams } from 'react-router-dom'

export default function TestIdPage() {
  const params = useParams()
  return <h3>test id is: {params.id}</h3>
}
