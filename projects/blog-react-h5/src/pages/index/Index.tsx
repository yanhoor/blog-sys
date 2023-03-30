import {useLocation, useNavigate} from "react-router-dom"

function IndexPage() {
  const location = useLocation()
  const navigate = useNavigate()
  console.log('===========', location)
  return(
    <>
      <div>index page</div>
      <button onClick={() => navigate('/test/test-route') }>test-route</button>
      <button onClick={() => navigate('/test/23') }>test-id</button>
      <button onClick={() => navigate('/test?type=aa&id=444') }>test-with-params</button>
      <button onClick={() => navigate('/test', { state: { a: 12 } }) }>test-with-state</button>
    </>
  )
}

export default IndexPage
