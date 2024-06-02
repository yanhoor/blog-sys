<template>
  <div>
    <lazy-el-dialog
      :model-value="show"
      title="管理分组"
      append-to-body
      @close="emit('update:show', false)"
    >
      <div class="flex flex-col gap-[12px]">
        <p class="text-[12px] text-gray-400">
          *点击修改分组名称，拖拽调整分组顺序
        </p>
        <div class="flex flex-wrap gap-[12px]" id="groupSort" v-auto-animate>
          <el-tag
            class="cursor-pointer"
            v-for="group of filterGroupList"
            :key="group.id"
            round
            type="primary"
            closable
            @close="handleDeleteGroup(group.id)"
            @click="handleEditGroup(group)"
          >
            {{ group.name }}
            <span v-if="group.memberCount">({{ group.memberCount }})</span>
          </el-tag>
          <el-button size="small" @click="editItem = { name: '' }" round>
            <template #icon>
              <Icon name="fluent:add-20-regular"></Icon>
            </template>
            新增分组
          </el-button>
        </div>
        <template v-if="editItem">
          <span>{{ editItem.id ? '修改分组' : '新增分组' }}</span>
          <div class="flex items-center gap-[12px]">
            <el-input
              placeholder="分组名称"
              v-model="editItem.name"
              clearable
              show-count
              maxlength="8"
              size="small"
              @keyup.enter="handleSave"
            ></el-input>
            <el-button size="small" @click="handleSave" type="primary">
              <template #icon>
                <Icon name="fluent:checkmark-20-regular"></Icon>
              </template>
            </el-button>
            <el-button size="small" @click="editItem = undefined" class="!ml-0">
              <template #icon>
                <Icon name="fluent:dismiss-20-regular"></Icon>
              </template>
            </el-button>
          </div>
        </template>
      </div>
    </lazy-el-dialog>
  </div>
</template>

<script lang="ts" setup>
import Sortable from 'sortablejs'
import type { FollowGroup } from 'sys-types'

interface Props {
  show: boolean
  groupList: FollowGroup[]
}

const props = defineProps<Props>()
const emit = defineEmits(['update:show', 'change'])
const sortableIns = ref()
const saveLoading = ref(false)
const showAdd = ref(false)
const editItem = ref<FollowGroup>()

const filterGroupList = computed(() => {
  return props.groupList.filter((g) => g.system === 2)
})

watch(
  () => props.show,
  (val) => {
    if (val) {
      editItem.value = undefined
      nextTick(() => {
        const el = document.querySelector('#groupSort')
        sortableIns.value = Sortable.create(el, {
          onEnd({ newIndex, oldIndex, to }: any) {
            const list = unref(filterGroupList.value)
            const item = list[oldIndex]
            list?.splice(oldIndex, 1)
            list?.splice(newIndex, 0, item)
            handleSortGroup(list)
          }
        })
      })
    }
  }
)

onUnmounted(() => {
  sortableIns.value?.destroy()
})

async function handleSortGroup(list: FollowGroup[]) {
  const idList = list.map((item) => item.id)
  try {
    const {
      result = [],
      success,
      code,
      msg
    } = await useFetchPost('/followGroup/sort', { ids: idList.toString() })
    if (success) {
      emit('change')
    } else {
      ElMessage.error(msg as string)
    }
  } catch (e) {}
}

async function handleDeleteGroup(id: number) {
  ElMessageBox.confirm('确定删除该分组？', '删除', {
    type: 'error',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(async () => {
      try {
        const {
          result = [],
          success,
          code,
          msg
        } = await useFetchPost('/followGroup/delete', { id })
        if (success) {
          ElMessage.success('已删除')
          emit('change')
        } else {
          ElMessage.error(msg as string)
        }
      } catch (e) {}
    })
    .catch(() => {})
}

function handleEditGroup(group: FollowGroup) {
  editItem.value = JSON.parse(JSON.stringify(group))
}

async function handleSave() {
  if (!editItem.value) return

  editItem.value.name = editItem.value.name.trim()
  if (saveLoading.value) return
  saveLoading.value = true
  try {
    const { result, success, code, msg } = await useFetchPost(
      '/followGroup/edit',
      editItem.value
    )
    if (success) {
      editItem.value = undefined
      emit('change')
    } else {
      ElMessage.error(msg as string)
    }
    saveLoading.value = false
  } catch (e) {
    saveLoading.value = false
  }
}
</script>
