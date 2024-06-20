<template>
  <el-dialog
      :model-value="show"
      title="设置分组"
      @close="emit('update:show', false)"
  >
    <div class="flex flex-col gap-[6px]" v-loading="loading">
      <el-checkbox-group
          class="flex flex-wrap gap-[6px]"
          v-model="selectIdList"
      >
        <div v-auto-animate>
          <el-checkbox
              class="min-w-[100px]"
              v-for="group of groupList"
              :value="group.id"
              :label="group.name"
              :id="group.id"
          />
        </div>
      </el-checkbox-group>
      <div class="flex items-center" v-if="showAdd">
        <el-input
            class="mr-[12px]"
            placeholder="分组名称"
            v-model="groupForm.name"
            clearable
            show-count
            maxlength="8"
            size="small"
            @keyup.enter="handleCreateGroup"
        ></el-input>
        <el-button size="small" @click="handleCreateGroup" type="primary">
          <template #icon>
            <Icon name="fluent:checkmark-20-regular"></Icon>
          </template>
        </el-button>
        <el-button size="small" @click="showAdd = false">
          <template #icon>
            <Icon name="fluent:dismiss-20-regular"></Icon>
          </template>
        </el-button>
      </div>
      <el-button class="w-fit" size="small" @click="showAdd = true" v-else>
        <template #icon>
          <Icon name="fluent:add-20-regular"></Icon>
        </template>
      </el-button>
    </div>
    <template #footer>
      <div class="text-right">
        <el-button
            type="primary"
            size="small"
            @click="handleConfirm"
            :loading="confirmLoading"
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
    const { result, success, code, msg } = await useFetchPost(
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
    const { result, success, code, msg } = await useFetchPost(
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
    } = await useFetchPost<any[]>('/followGroup/all', {})
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
    } = await useFetchPost<any[]>('/followGroup/containList', { userId: props.userId })
    if (success) {
      selectIdList.value = result.map((g) => g.id)
    } else {
      ElMessage.error(msg as string)
    }
  } catch (e) {}
}
</script>
