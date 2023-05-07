import { Form, Button, Input, hooks, Toast } from 'react-vant'
import YCard from '@/components/y-card'
import $http from '@/http'
import { login } from '@/http/urls'
import MyConfig from '@/config'
import { useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { getMyInfo } from '@/store/user/asyncThunk'

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const [formInstance] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [editForm, updateEditForm] = hooks.useSetState({
    mobile: '',
    password: ''
  })

  async function handleLogin() {
    formInstance.validateFields().then(async () => {
      try {
        setLoading(true)
        const { msg, success, result } = await $http.post(login, editForm)
        setLoading(false)
        if (success) {
          Toast.success('登录成功')
          localStorage.setItem(MyConfig.TOKEN, result)
          dispatch(getMyInfo())
          history.back()
        } else {
          Toast.fail(msg || '登录失败')
        }
      } catch (e) {
        setLoading(false)
        Toast.fail('登录失败')
      }
    })
  }

  return (
    <div className="h-full w-full flex flex-col justify-center absolute">
      <YCard className="mx-[12px]">
        <Form form={formInstance}>
          <Form.Item
            rules={[{ required: true, message: '请填写用户名' }]}
            name="mobile"
            label="用户名"
          >
            <Input
              placeholder="请输入用户名"
              type="tel"
              maxLength={11}
              value={editForm.mobile}
              onChange={(mobile) => updateEditForm({ mobile })}
            />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: '请填写密码' }]}
            name="password"
            label="密码"
          >
            <Input
              placeholder="请输入密码"
              type="password"
              value={editForm.password}
              onChange={(password) => updateEditForm({ password })}
            />
          </Form.Item>
        </Form>
        <Button
          className="!mt-[12px]"
          type="primary"
          size="small"
          round
          block
          loading={loading}
          onClick={handleLogin}
        >
          登录
        </Button>
      </YCard>
    </div>
  )
}
