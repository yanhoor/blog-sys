import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  Form,
  hooks,
  Input,
  Radio,
  DatetimePicker,
  Field,
  Button,
  Toast,
  PickerPopupActions
} from 'react-vant'
import { useState } from 'react'
import { User } from 'sys-types'
import PageWrapper from '@/components/page-wrapper'
import CustomNavBar from '@/components/custom/custom-nav-bar'
import UploadImg from '@/components/upload/uploadImg'
import $http, { user_update } from '@/http'
import { getMyInfo } from '@/store/user/asyncThunk'

export default function MyProfilePage() {
  const dispatch = useAppDispatch()
  const myInfo = useAppSelector((state) => state.user.myInfo)
  const [formInstance] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [editForm, updateEditForm] = hooks.useSetState<User>({
    ...(myInfo as User)
  })

  function handleSaveProfile() {
    formInstance.validateFields().then(async () => {
      const newData = formInstance.getFieldsValue()
      console.log('======handleSaveProfile=======', newData)
      try {
        setLoading(true)
        const { msg, success, result } = await $http.post(user_update, {
          ...newData,
          avatar: editForm['avatar'],
          profileCardBg: editForm['profileCardBg']
        })
        setLoading(false)
        if (success) {
          Toast.success('保存成功')
          dispatch(getMyInfo())
          history.back()
        } else {
          Toast.fail(msg || '保存失败')
        }
      } catch (e) {
        setLoading(false)
        Toast.fail('保存失败')
      }
    })
  }

  return (
    <PageWrapper title="编辑资料">
      <CustomNavBar title="编辑资料" />
      <div className="flex flex-col items-center">
        <Form form={formInstance} className="w-full">
          <Form.Item
            className="!bg-card-light dark:!bg-card-dark"
            validateTrigger="onBlur"
            rules={[{ required: true, message: '请填写用户名' }]}
            name="name"
            initialValue={editForm.name}
            label="用户名"
          >
            <Input placeholder="请填写用户名" type="text" maxLength={8} />
          </Form.Item>
          <Form.Item
            className="!bg-card-light dark:!bg-card-dark"
            name="gender"
            initialValue={editForm.gender}
            label="性别"
          >
            <Radio.Group direction="horizontal">
              <Radio name={0}>未定</Radio>
              <Radio name={1}>男</Radio>
              <Radio name={2}>女</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            className="items-center !bg-card-light dark:!bg-card-dark"
            name="birthday"
            initialValue={new Date(editForm.birthday as string)}
            label="生日"
          >
            <DatetimePicker
              popup={{
                round: true
              }}
              type="date"
              title="选择时间"
              minDate={new Date(1949, 0, 1)}
              maxDate={new Date()}
            >
              {(val: Date, _: any, actions: PickerPopupActions) => {
                return (
                  <Field
                    readOnly
                    clickable
                    value={val?.toLocaleDateString()}
                    placeholder="请选择日期"
                    onClick={() => actions.open()}
                  />
                )
              }}
            </DatetimePicker>
          </Form.Item>
          <Form.Item
            className="!bg-card-light dark:!bg-card-dark"
            name="introduce"
            initialValue={editForm.introduce}
            label="简介"
          >
            <Input.TextArea
              placeholder="请填写简介"
              maxLength={80}
              showWordLimit
            />
          </Form.Item>
          <Form.Item
            className="!bg-card-light dark:!bg-card-dark"
            name="avatar"
            label="头像"
          >
            <UploadImg
              className="h-[120px] w-[120px]"
              url={editForm.avatar}
              onComplete={(avatar) => updateEditForm({ avatar })}
            ></UploadImg>
          </Form.Item>
          <Form.Item
            className="!bg-card-light dark:!bg-card-dark"
            name="profileCardBg"
            label="资料卡背景"
          >
            <UploadImg
              className="max-h-[180px] w-full"
              url={editForm.profileCardBg}
              onComplete={(profileCardBg) => updateEditForm({ profileCardBg })}
            ></UploadImg>
          </Form.Item>
        </Form>
        <Button
          type="primary"
          size="small"
          round
          className="!mx-auto !mt-[12px] w-3/5"
          loading={loading}
          onClick={handleSaveProfile}
        >
          保存
        </Button>
      </div>
    </PageWrapper>
  )
}
