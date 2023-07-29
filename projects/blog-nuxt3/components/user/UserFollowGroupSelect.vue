<template>
  <n-modal :show="show">
    <n-card
      title="设置分组"
      size="large"
      closable
      @close="emit('update:show', false)"
      class="flex max-h-screen w-1/3 flex-col"
      content-style="flex: 1; overflow: hidden; display: flex; flex-direction: column"
    >
      <div class="overflow-auto">
        <n-spin v-if="loading" />
        <div class="flex flex-wrap gap-[6px]" v-else>
          <n-checkbox-group
            class="flex flex-wrap gap-[6px]"
            v-model:value="selectIdList"
          >
            <n-checkbox
              class="min-w-[100px]"
              v-for="group of groupList"
              :value="group.id"
              :label="group.name"
              :id="group.id"
            />
          </n-checkbox-group>
          <n-input-group v-if="showAdd">
            <n-input
              placeholder="分组名称"
              v-model:value="groupForm.name"
              clearable
              show-count
              maxlength="8"
              size="small"
              @keyup.enter="handleCreateGroup"
            ></n-input>
            <n-button size="small" @click="handleCreateGroup" type="primary">
              <template #icon>
                <n-icon :component="Checkmark24Regular" />
              </template>
            </n-button>
            <n-button size="small" @click="showAdd = false">
              <template #icon>
                <n-icon :component="Dismiss24Regular" />
              </template>
            </n-button>
          </n-input-group>
          <n-button size="small" @click="showAdd = true" v-else>
            <template #icon>
              <n-icon :component="Add24Regular" />
            </template>
          </n-button>
        </div>
      </div>
      <template #footer>
        <div class="text-right">
          <n-button
            type="primary"
            size="small"
            @click="handleConfirm"
            :loading="confirmLoading"
            >确定</n-button
          >
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import {
  NModal,
  NButton,
  NIcon,
  NInput,
  NInputGroup,
  NCheckboxGroup,
  NCheckbox,
  NSpin,
  NCard,
  createDiscreteApi
} from 'naive-ui'
import {
  Add24Regular,
  Dismiss24Regular,
  Checkmark24Regular
} from '@vicons/fluent'
import { FollowGroup } from '~/types'

interface Props {
  show: boolean
  userId: number
}

const props = defineProps<Props>()
const emit = defineEmits(['update:show'])
const currentUser = useUserInfo()
const loading = ref(false)
const adding = ref(false)
const confirmLoading = ref(false)
const showAdd = ref(false)
const selectIdList = ref([])
const groupForm = ref({
  name: ''
})
const groupList = ref<FollowGroup[]>([])

watch(
  () => props.show,
  (val) => {
    if (val) InitPage()
  }
)

async function InitPage() {
  loading.value = true
  try {
    await Promise.all([getAllGroup(), getContainGroupList()])
    loading.value = false
  } catch (e) {
    loading.value = false
  }
}

async function handleCreateGroup() {
  const { message } = useDiscreteApi(['message'])
  groupForm.value.name = groupForm.value.name.trim()
  if (adding.value) return
  adding.value = true
  try {
    const { result, success, code, msg } = await useFetchPost(
      '/followGroup/edit',
      groupForm.value
    )
    if (success) {
      groupForm.value.name = ''
      getAllGroup()
      showAdd.value = false
    } else {
      message.error(msg as string)
    }
    adding.value = false
  } catch (e) {
    adding.value = false
  }
}

async function handleConfirm() {
  const { message } = useDiscreteApi(['message'])
  if (!selectIdList.value.length) {
    message.warning('请选择分组')
    return
  }
  confirmLoading.value = true
  try {
    const { result, success, code, msg } = await useFetchPost(
      '/user/setGroup',
      { groupId: selectIdList.value.toString(), userId: props.userId }
    )
    if (success) {
      emit('update:show', false)
    } else {
      message.error(msg as string)
    }
    confirmLoading.value = false
  } catch (e) {
    confirmLoading.value = false
  }
}

async function getAllGroup() {
  const { message } = useDiscreteApi(['message'])
  try {
    const {
      result = [],
      success,
      code,
      msg
    } = await useFetchPost('/followGroup/all', {})
    if (success) {
      groupList.value = result
    } else {
      message.error(msg as string)
    }
  } catch (e) {}
}

async function getContainGroupList() {
  const { message } = useDiscreteApi(['message'])
  try {
    const {
      result = [],
      success,
      code,
      msg
    } = await useFetchPost('/followGroup/containList', { userId: props.userId })
    if (success) {
      selectIdList.value = result.map((g) => g.id)
    } else {
      message.error(msg as string)
    }
  } catch (e) {}
}
</script>
