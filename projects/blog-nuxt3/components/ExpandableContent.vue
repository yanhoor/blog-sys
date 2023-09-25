<template>
  <div class="whitespace-pre-wrap break-words" v-auto-animate>
    <template v-for="(info, index) of displayContentList" :key="index">
      <component
        :is="info.content"
        v-bind="info.props"
        v-if="info.type === 'component'"
      ></component>
      <UserCard
        class="inline"
        v-else-if="info.type === 'userName'"
        :uname="info.content"
      >
        <template #trigger>
          <a
            :href="`${runtimeConfig.app.baseURL}user/name/${info.content}`"
            class="text-primary"
            >@{{ info.content }}</a
          >
        </template>
      </UserCard>
      <span v-html="info.content" v-else-if="info.type === 'html'"></span>
      <span v-else>{{ info.content }}</span>
    </template>

    <MediaImgInlineView
      class="mx-[4px]"
      v-if="imgUrl"
      :url="imgUrl"
    ></MediaImgInlineView>

    <n-button
      text
      type="primary"
      @click.stop="handleExpand"
      v-if="showAction"
      >{{ isExpanded ? '收起' : '展开' }}</n-button
    >
  </div>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'
import { Media, Topic } from 'sys-types'
import MediaImgInlineView from '@/components/Media/MediaImgInlineView.vue'

interface Props {
  content?: string
  imgUrl?: string
  maxLength?: number
  maxLine?: number
  topicList?: Topic[]
  mediaList?: Media[]
}

const mediaRegTxt = '\\[m[0-9a-zA-Z-]*]'
const mediaReg = new RegExp(mediaRegTxt, 'g') // [mxxxxxxx]
const userNameRegTxt = '@[^\\s#@:\\]\\[]+'
const userNameReg = new RegExp(userNameRegTxt, 'g')
const topicRegTxt = '#[^#@\\s\\]\\[]+#'
const topicReg = new RegExp(topicRegTxt, 'g')
const combineReg = new RegExp(
  [`(${mediaRegTxt})`, `(${userNameRegTxt})`, `(${topicRegTxt})`].join('|'),
  'g'
)
const runtimeConfig = useRuntimeConfig()
const props = withDefaults(defineProps<Props>(), {
  maxLength: 280,
  content: '',
  maxLine: 3,
  topicList: () => [],
  mediaList: () => []
})
const isExpanded = ref(false)
const scrollTop = ref(0)

const lineContentList = computed(() => {
  // console.log('======lineContentList========', props.content)
  // todo: 设置了默认值为什么 props.content 还是 null?
  if (!props.content) return []

  return props.content.split('\n')
})

const isMultiLines = computed(
  () => lineContentList.value.length > props.maxLine
)

const showAction = computed(() => {
  if (lineContentList.value.length > props.maxLine) return true

  let noMediaContent = props.content
  if (props.mediaList.length) {
    // 去掉 [media-id-xx] 再比较是否超出限制长度
    noMediaContent = props.content.replace(mediaReg, '')
  }
  return noMediaContent.length > props.maxLength
})

const displayContentList = computed(() => {
  if (!props.content) return []

  let noMediaContent: string = props.content
  if (props.mediaList.length) {
    // 去掉 [media-id-xx] 再比较是否超出限制长度
    noMediaContent = props.content.replace(mediaReg, '')
  }
  let preContent = '',
    result = []
  if (isExpanded.value) {
    // 展开状态
    preContent = `${props.content}${isMultiLines.value ? '\n' : ''}`
  } else {
    // 收起状态
    if (lineContentList.value.length > props.maxLine) {
      // 多行内容
      preContent =
        lineContentList.value.slice(0, props.maxLine).join('\n') + '\n...\n'
    } else if (noMediaContent && noMediaContent.length > props.maxLength) {
      // 超出长度
      const ls = props.content.split(new RegExp(`(${mediaRegTxt})`, 'g'))
      // console.log('======props.content=========', props.content, ls)
      let contentLength = 0
      // 因为计算长度时是去掉了 [mxxxx] 媒体文本长度，显示时需要恢复
      ls.forEach((txt) => {
        if (mediaReg.test(txt)) {
          preContent += txt
        } else {
          const newLength = contentLength + txt.length
          if (newLength > props.maxLength) {
            preContent += txt.slice(0, props.maxLength - contentLength) + '...'
          } else {
            preContent += txt
          }
        }
      })
      // preContent = noMediaContent.slice(0, props.maxLength) + '...'
    } else {
      preContent = props.content
    }
  }

  // 将字符串按话题、媒体、用户名分割成数组
  let strList = preContent.split(combineReg)
  strList = strList.filter((s) => s && s.length)
  // 将分割出的字串按内容类型包装显示信息
  strList.forEach((str) => {
    const m = handleMediaContent(str)
    const u = handleUserName(str)
    const t = handleTopicContent(str)
    if (m) {
      result.push(m)
    } else if (u) {
      result.push(u)
    } else if (t) {
      result.push(t)
    } else {
      result.push({
        type: 'text',
        content: str
      })
    }
  })
  // console.log('======handleSplitContent=========', preContent, strList, result)

  return result
})

// 处理字符串 str 中的媒体内容
function handleMediaContent(str: string) {
  let result

  if (props.mediaList.length) {
    const mediaMatchList = props.mediaList.map((m) => `[m${m.id}]`)
    if (mediaMatchList.some((tc) => str === tc)) {
      const mediaId = str.slice(2, -1)
      const media = props.mediaList.find((m) => m.id === mediaId)
      result = {
        type: 'component',
        props: {
          url: media.file.url,
          class: 'mx-[4px]'
        },
        content: MediaImgInlineView
      }
    }
  }

  return result
}

// 处理字符串 str 中的 @ 用户
function handleUserName(str: string) {
  let result

  if (userNameReg.test(str)) {
    result = {
      type: 'userName',
      content: str.slice(1)
    }
  }

  return result
}

// 处理字符串 str 中的话题
function handleTopicContent(str: string) {
  let result
  if (props.topicList.length) {
    // 匹配 @ /@[^@[#\s]+/g
    // let strList = preContent.split(/(#[^#^\s]+?#)/g)
    const topicContentList = props.topicList.map((t) => `#${t.content}#`)
    if (topicContentList.some((tc) => str === tc)) {
      const topicContent = str.slice(1, -1)
      const topic = props.topicList.find((t) => t.content === topicContent)
      result = {
        type: 'html',
        content: `<a href="${runtimeConfig.app.baseURL}search?topicId=${topic?.id}" class="text-primary" target="_blank">${str}</a>`
      }
    }
  }
  return result
}

function handleExpand() {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    scrollTop.value = window.scrollY
  } else {
    nextTick(() => {
      window.scrollTo(0, scrollTop.value)
    })
  }
}
</script>
