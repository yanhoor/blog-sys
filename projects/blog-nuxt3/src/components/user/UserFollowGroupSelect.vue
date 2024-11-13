<template>
  <el-dialog
    :model-value="show"
    title="设置分组"
    @close="emit('update:show', false)"
  >
    <div v-loading="loading" class="flex flex-col gap-[6px]">
      <el-checkbox-group
        v-model="selectIdList"
        class="flex flex-wrap gap-[6px]"
      >
        <div v-auto-animate>
          <el-checkbox
            v-for="group of groupList"
            :id="group.id"
            class="min-w-[100px]"
            :value="group.id"
            :label="group.name"
          />
        </div>
      </el-checkbox-group>
      <div v-if="showAdd" class="flex items-center">
        <el-input
          v-model="groupForm.name"
          class="mr-[12px]"
          placeholder="分组名称"
          clearable
          show-count
          maxlength="8"
          size="small"
          @keyup.enter="handleCreateGroup"
        />
        <el-button size="small" type="primary" @click="handleCreateGroup">
          <template #icon>
            <Icon name="fluent:checkmark-20-regular" />
          </template>
        </el-button>
        <el-button size="small" @click="showAdd = false">
          <template #icon>
            <Icon name="fluent:dismiss-20-regular" />
          </template>
        </el-button>
      </div>
      <el-button v-else class="w-fit" size="small" @click="showAdd = true">
        <template #icon>
          <Icon name="fluent:add-20-regular" />
        </template>
      </el-button>
    </div>
    <template #footer>
      <div class="text-right">
        <el-button
          type="primary"
          size="small"
          :loading="confirmLoading"
          @click="handleConfirm"
          >确定</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { FollowGroup } from 'sys-types'

interface Props {
  show: boolean
  userId: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:show'])
const { $HttpUtils } = useNuxtApp()
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
  groupForm.value.name = groupForm.value.name.trim()
  if (adding.value) return
  adding.value = true
  try {
    const { result, success, code, msg } = await $HttpUtils.post(
      '/followGroup/edit',
      groupForm.value
    )
    if (success) {
      groupForm.value.name = ''
      getAllGroup()
      showAdd.value = false
    } else {
      ElMessage.error(msg as string)
    }
    adding.value = false
  } catch (e) {
    adding.value = false
  }
}

async function handleConfirm() {
  if (!selectIdList.value.length) {
    ElMessage.warning('请选择分组')
    return
  }
  confirmLoading.value = true
  try {
    const { result, success, code, msg } = await $HttpUtils.post(
      '/user/setGroup',
      { groupId: selectIdList.value.toString(), userId: props.userId }
    )
    if (success) {
      emit('update:show', false)
    } else {
      ElMessage.error(msg as string)
    }
    confirmLoading.value = false
  } catch (e) {
    confirmLoading.value = false
  }
}

async function getAllGroup() {
  try {
    const {
      result = [],
      success,
      code,
      msg
    } = await $HttpUtils.post<any[]>('/followGroup/all', {})
    if (success) {
      groupList.value = result
    } else {
      ElMessage.error(msg as string)
    }
  } catch (e) {}
}

async function getContainGroupList() {
  try {
    const {
      result = [],
      success,
      code,
      msg
    } = await $HttpUtils.post<any[]>('/followGroup/containList', {
      userId: props.userId
    })
    if (success) {
      selectIdList.value = result.map((g) => g.id)
    } else {
      ElMessage.error(msg as string)
    }
  } catch (e) {}
}
</script>
