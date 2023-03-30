import {Outlet, useLocation, useSearchParams} from "react-router-dom"
import TestA from "@/pages/test/index/components/test-a"
import { Button } from 'react-vant'

export default function TestPage(props: any) {
  let [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()

  console.log('=======props======', props)
  console.log('=====searchParams======', searchParams)
  console.log('=====location======', location)

  return (
    <div className="test-index text-3xl">
      <aside>aside</aside>
      <Button plain type='primary'>test</Button>
      <h3>params is: { searchParams.get('id') }</h3>
      <TestA type={'13123'}></TestA>
      <button onClick={() => setSearchParams({ type: 23, id: 55 })}>change</button>
      <main>outlet
        <Outlet />
      </main>
    </div>
  )
}
