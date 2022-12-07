<template>
  <div class="comment-form-container">
    <n-input
      :placeholder="placeholder"
      type="textarea"
      size="small"
      @keyup.shift.enter="commitComment"
      v-model:value="commentContent"
      :autosize="{
        minRows: 3,
        maxRows: 5
      }"
    />
    <n-button class="commit-btn" type="primary" @click="commitComment" :loading="commentCommitting">{{ btnText }}</n-button>
  </div>
</template>

<script lang="ts" setup>
import {
  NForm,
  NFormItem,
  createDiscreteApi,
  NButton,
  NInput
} from "naive-ui"
import { User } from '@/types'

interface Props{
  placeholder?: string
  btnText?: string
  blogId: string | number
  replyCommentId?: string | number
  replyTo?: User
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '输入评论（Enter换行，Shift + Enter发送）',
  btnText: '发表评论'
})
const emit = defineEmits(['success'])

const commentContent = ref('')
const commentCommitting = ref(false)

async function commitComment() {
  const { message } = createDiscreteApi(["message"])
  const content = commentContent.value.trim()

  if(!content){
    message.warning('请输入评论')
    return
  }

  try{
    commentCommitting.value = true
    const { result, success, msg } = await useFetchPost('/comment/commit', { blogId: props.blogId, content, replyCommentId: props.replyCommentId, replyToId: props.replyTo?.id })
    commentCommitting.value = false
    if(success){
      emit('success')
      commentContent.value=''
      message.success('发表成功')
    }else{
      message.error(msg)
    }
  }catch (e) {
    commentCommitting.value = false
    console.log('=====/comment/commit=======', e)
  }
}
</script>

<style lang="scss" scoped>
.comment-form-container{
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .commit-btn{
    margin-top: 12px;
  }
}
</style>
