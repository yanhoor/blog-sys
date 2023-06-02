import { Form, Button, Input, hooks, Toast } from 'react-vant'
import YCard from '@/components/y-card'
import $http from '@/http'
import { login } from '@/http/urls'
import MyConfig from '@/config'
import { useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { getMyInfo } from '@/store/user/asyncThunk'
import { useNavigate, useSearchParams } from 'react-router-dom'
import PageWrapper from '@/components/page-wrapper'
import CustomNavBar from '@/components/custom/custom-nav-bar'

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [formInstance] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [editForm, updateEditForm] = hooks.useSetState({
    mobile: '',
    password: ''
  })

  const fromPath = searchParams.get('from')

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
          navigate(fromPath || '/', { replace: true })
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
    <PageWrapper className="flex flex-col" title="登录">
      <CustomNavBar title="登录" />
      <div className="flex w-full flex-1 flex-col justify-center">
        <YCard className="mx-[12px]">
          <Form form={formInstance}>
            <Form.Item
              className="!bg-card-light dark:!bg-card-dark"
              validateTrigger="onBlur"
              rules={[
                { required: true, message: '请填写手机号' }
                // {
                //   validator: (_, value) => {
                //     if (/1\d{10}/.test(value)) {
                //       return Promise.resolve(true)
                //     }
                //     return Promise.reject(new Error('请输入正确的手机号码'))
                //   }
                // }
              ]}
              name="mobile"
              label="手机号"
            >
              <Input
                placeholder="请输入手机号"
                type="tel"
                maxLength={11}
                value={editForm.mobile}
                onChange={(mobile) => updateEditForm({ mobile })}
              />
            </Form.Item>
            <Form.Item
              className="!bg-card-light dark:!bg-card-dark"
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
          <Button
            className="!mt-[12px]"
            size="small"
            round
            block
            onClick={() => navigate('/register', { replace: true })}
          >
            没有账号，去注册
          </Button>
        </YCard>
      </div>
    </PageWrapper>
  )
}
