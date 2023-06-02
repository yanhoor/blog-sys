import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Form, hooks, Input, Toast } from 'react-vant'
import { useState } from 'react'
import $http, { register } from '@/http'
import YCard from '@/components/y-card'
import PageWrapper from '@/components/page-wrapper'
import CustomNavBar from '@/components/custom/custom-nav-bar'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [formInstance] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [editForm, updateEditForm] = hooks.useSetState({
    name: '',
    mobile: '',
    password: '',
    repeatPassword: ''
  })

  const fromPath = searchParams.get('from')

  async function handleRegister() {
    formInstance.validateFields().then(async () => {
      try {
        setLoading(true)
        const { msg, success, result } = await $http.post(register, editForm)
        setLoading(false)
        if (success) {
          Toast.success('注册成功')
          navigate('/login', { replace: true })
        } else {
          Toast.fail(msg || '注册失败')
        }
      } catch (e) {
        setLoading(false)
        Toast.fail('注册失败')
      }
    })
  }

  return (
    <PageWrapper className="flex flex-col" title="注册">
      <CustomNavBar title="注册" />
      <div className="flex w-full flex-1 flex-col justify-center">
        <YCard className="mx-[12px]">
          <Form form={formInstance}>
            <Form.Item
              className="!bg-card-light dark:!bg-card-dark"
              rules={[{ required: true, message: '请填写用户名' }]}
              name="name"
              label="用户名"
            >
              <Input
                placeholder="请输入用户名"
                type="text"
                maxLength={20}
                value={editForm.name}
                onChange={(name) => updateEditForm({ name })}
              />
            </Form.Item>
            <Form.Item
              className="!bg-card-light dark:!bg-card-dark"
              validateTrigger="onBlur"
              rules={[
                { required: true, message: '请填写手机号' },
                {
                  validator: (_, value) => {
                    if (/1\d{10}/.test(value)) {
                      return Promise.resolve(true)
                    }
                    return Promise.reject(new Error('请输入正确的手机号码'))
                  }
                }
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
              validateTrigger="onBlur"
              rules={[
                { required: true, message: '请填写密码' },
                {
                  validator: (_, value) => {
                    if (editForm.repeatPassword === value) {
                      return Promise.resolve(true)
                    }
                    return Promise.reject(new Error('两次输入的密码不相同'))
                  }
                }
              ]}
              name="password"
              label="密码"
            >
              <Input
                placeholder="请输入密码"
                type="password"
                value={editForm.password}
                onChange={(password) =>
                  updateEditForm({ password: password.trim() })
                }
              />
            </Form.Item>
            <Form.Item
              className="!bg-card-light dark:!bg-card-dark"
              validateTrigger="onBlur"
              rules={[
                { required: true, message: '请再次输入密码' },
                {
                  validator: (_, value) => {
                    if (editForm.password === value) {
                      return Promise.resolve(true)
                    }
                    return Promise.reject(new Error('两次输入的密码不相同'))
                  }
                }
              ]}
              name="repeatPassword"
              label="再次输入密码"
            >
              <Input
                placeholder="请再次输入密码"
                type="password"
                value={editForm.repeatPassword}
                onChange={(repeatPassword) =>
                  updateEditForm({ repeatPassword: repeatPassword.trim() })
                }
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
            onClick={handleRegister}
          >
            注册
          </Button>
          <Button
            className="!mt-[12px]"
            size="small"
            round
            block
            onClick={() => navigate('/login', { replace: true })}
          >
            已有账号，去登录
          </Button>
        </YCard>
      </div>
    </PageWrapper>
  )
}
