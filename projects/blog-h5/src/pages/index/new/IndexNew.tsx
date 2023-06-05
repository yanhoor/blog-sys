import { Input, hooks, Toast, Button } from 'react-vant'
import YCard from '@/components/y-card'
import { UploadMulti } from '@/components/upload/upload-multi'
import { useState } from 'react'
import { Media } from 'sys-types'
import $http, { blog_edit, comment_commit } from '@/http'

export default function IndexNewPage() {
  const [editForm, updateEditForm] = hooks.useSetState<{
    content: string
    medias: Media[]
  }>({
    content: '',
    medias: []
  })
  const [loading, setLoading] = useState(false)
  const [uploadKey, setUploadKey] = useState(new Date().getTime())

  console.log('=======IndexNewPage========')

  function handleUploadComplete(list: Media[]) {
    // console.log('====handleUploadComplete======', list)
    updateEditForm({ medias: list })
  }

  async function handleCommit() {
    if (!editForm.content) {
      Toast.fail('请输入发布内容')
      return
    }
    setLoading(true)
    try {
      const { msg, success, result } = await $http.post(blog_edit, editForm)
      setLoading(false)
      if (success) {
        setUploadKey(new Date().getTime())
        updateEditForm({ content: '', medias: [] })
        Toast.success('已发布')
      } else {
        Toast.fail(msg || '发布失败')
      }
    } catch (e) {
      setLoading(false)
      Toast.fail('发布失败')
      console.log('=====handleCommitComment error======', e)
    }
  }

  return (
    <YCard className="index-new m-[5px] !mb-[60px]">
      <div className="flex flex-col gap-[12px]">
        <Input.TextArea
          className="border-color rounded border p-3"
          placeholder="发表内容"
          showWordLimit
          value={editForm.content}
          autoSize={{ minHeight: 80, maxHeight: 120 }}
          onChange={(v) => updateEditForm({ content: v.trim() })}
        />
        <UploadMulti key={uploadKey} onComplete={handleUploadComplete} />
        <Button
          className="mt-[12px]"
          size="small"
          type="primary"
          round
          loading={loading}
          onClick={handleCommit}
        >
          发布
        </Button>
      </div>
    </YCard>
  )
}
