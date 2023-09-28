<template>
  <div>
    <n-modal :show="show">
      <n-card
        title="管理分组"
        size="large"
        closable
        @close="emit('update:show', false)"
        class="max-h-screen w-2/5"
      >
        <div class="flex flex-col gap-[12px]">
          <p class="text-[12px] text-gray-400">
            *点击修改分组名称，拖拽调整分组顺序
          </p>
          <div class="flex flex-wrap gap-[12px]" id="groupSort" v-auto-animate>
            <n-tag
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
            </n-tag>
            <n-button size="small" @click="editItem = { name: '' }" round>
              <template #icon>
                <Icon name="fluent:add-20-regular"></Icon>
              </template>
              新增分组
            </n-button>
          </div>
          <template v-if="editItem">
            <span>{{ editItem.id ? '修改分组' : '新增分组' }}</span>
            <n-input-group>
              <n-input
                placeholder="分组名称"
                v-model:value="editItem.name"
                clearable
                show-count
                maxlength="8"
                size="small"
                @keyup.enter="handleSave"
              ></n-input>
              <n-button size="small" @click="handleSave" type="primary">
                <template #icon>
                  <Icon name="fluent:checkmark-20-regular"></Icon>
                </template>
              </n-button>
              <n-button size="small" @click="editItem = undefined">
                <template #icon>
                  <Icon name="fluent:dismiss-20-regular"></Icon>
                </template>
              </n-button>
            </n-input-group>
          </template>
        </div>
      </n-card>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import { NModal, NButton, NInput, NInputGroup, NTag, NCard } from 'naive-ui'
import Sortable from 'sortablejs'
import { FollowGroup } from 'sys-types'

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
  const { message } = useDiscreteApi(['message'])
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
      message.error(msg as string)
    }
  } catch (e) {}
}

async function handleDeleteGroup(id: number) {
  const { message, dialog } = useDiscreteApi(['message', 'dialog'])
  dialog.error({
    title: '删除',
    content: '确定删除该分组？',
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        const {
          result = [],
          success,
          code,
          msg
        } = await useFetchPost('/followGroup/delete', { id })
        if (success) {
          message.success('已删除')
          emit('change')
        } else {
          message.error(msg as string)
        }
      } catch (e) {}
    },
    onNegativeClick: () => {}
  })
}

function handleEditGroup(group: FollowGroup) {
  editItem.value = JSON.parse(JSON.stringify(group))
}

async function handleSave() {
  const { message } = useDiscreteApi(['message'])
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
      message.error(msg as string)
    }
    saveLoading.value = false
  } catch (e) {
    saveLoading.value = false
  }
}
</script>
