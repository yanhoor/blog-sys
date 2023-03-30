import {Outlet, RouteObject, useLocation, useSearchParams} from "react-router-dom"

export default function TestPage(props: any) {
  let [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()

  console.log('=======props======', props)
  console.log('=====searchParams======', searchParams)
  console.log('=====location======', location)

  return (
    <div className="test-index">
      <aside>aside</aside>
      <h3>params is: { searchParams.get('id') }</h3>
      <button onClick={() => setSearchParams({ type: 23, id: 55 })}>change</button>
      <main>outlet
        <Outlet />
      </main>
    </div>
  )
}
