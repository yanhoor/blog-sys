import { Navigate, useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()
  console.error('==============ErrorPage=============', error)

  return (
    <div>
      {(error as any).isLogin ? (
        <div>error</div>
      ) : (
        <Navigate to="/login" replace></Navigate>
      )}
    </div>
  )
}
