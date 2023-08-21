import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams
} from 'react-router-dom'
import TestA from '@/pages/test/index/components/test-a'
import { Button } from 'react-vant'
import { useState } from 'react'

export default function TestPage(props: any) {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [count, setCount] = useState(0)

  console.log('=======props======', props)
  console.log('=====searchParams======', searchParams)
  console.log('=====location======', location)

  return (
    <div className="test-index text-3xl">
      <aside>aside</aside>
      <Button plain type="primary">
        test
      </Button>
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
      <button onClick={() => navigate('/test/test-route')}>test-route</button>
      <button onClick={() => navigate('/test/23')}>test-id</button>
      <button onClick={() => navigate('/test?type=aa&id=444')}>
        test-with-params
      </button>
      <button onClick={() => navigate('/test', { state: { a: 12 } })}>
        test-with-state
      </button>
      <h3>params is: {searchParams.get('id')}</h3>
      <TestA type={'13123'}></TestA>
      <button onClick={() => setSearchParams({ type: '23', id: '55' })}>
        change
      </button>
      <main>
        outlet
        <Outlet />
      </main>
    </div>
  )
}
