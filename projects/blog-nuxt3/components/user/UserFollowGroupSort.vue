<template>
  <div>
    <n-modal :show="show">
      <n-card
        title="管理分组"
        size="large"
        closable
        @close="emit('update:show', false)"
        class="w-3/5 max-h-screen"
      >
        <div class="flex flex-col gap-[12px]">
          <p class="text-[12px] text-gray-400">*点击修改分组名称，拖拽调整分组顺序</p>
          <div class="flex flex-wrap gap-[12px]" id="groupSort">
            <n-tag class="cursor-pointer" v-for="group of groupList" :key="group.id" round type="primary" closable @close="handleDeleteGroup(group.id)" @click="handleEditGroup(group)">
              {{ group.name }}
              <span v-if="group.memberCount">({{ group.memberCount }})</span>
            </n-tag>
          </div>
          <template v-if="editItem">
            <span>修改分组</span>
            <n-input-group>
              <n-input placeholder="分组名称" v-model:value="editItem.name" clearable show-count maxlength="8" size="small" @keyup.enter="handleSave"></n-input>
              <n-button size="small" @click="handleSave" type="primary">
                <template #icon>
                  <n-icon :component="Checkmark24Regular"/>
                </template>
              </n-button>
              <n-button size="small" @click="editItem = undefined">
                <template #icon>
                  <n-icon :component="Dismiss24Regular"/>
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
import {
  NModal,
  NButton,
  NIcon,
  NInput,
  NInputGroup,
  NTag,
  NCard,
  createDiscreteApi
} from "naive-ui"
import Sortable from 'sortablejs'
import { FollowGroup } from "~/types"
import { Dismiss24Regular, Checkmark24Regular } from "@vicons/fluent"

interface Props{
  show: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:show'])
const groupList = shallowRef<FollowGroup[]>([])
const sortableIns = ref()
const saveLoading = ref(false)
const editItem = ref<FollowGroup>()

watch(() => props.show, (val) => {
  if(val){
    editItem.value = undefined
    getAllGroup()
    nextTick(() => {
      const el = document.querySelector('#groupSort')
      sortableIns.value = Sortable.create(el, {
        onEnd({ newIndex, oldIndex }: any){
          const item = groupList.value[oldIndex]
          groupList.value?.splice(oldIndex, 1)
          groupList.value?.splice(newIndex, 0, item)
          handleSortGroup()
        }
      })
    })
  }
})

async function getAllGroup() {
  const { message } = createDiscreteApi(["message"])
  try{
    const { result = [], success, code, msg } = await useFetchPost('/followGroup/all', { })
    if(success){
      groupList.value = result
    }else{
      message.error(msg as string)
    }
  }catch (e) {

  }
}

async function handleSortGroup() {
  const { message } = createDiscreteApi(["message"])
  const idList = groupList.value.map(item => item.id)
  try{
    const { result = [], success, code, msg } = await useFetchPost('/followGroup/sort', { ids: idList.toString() })
    if(success){
      getAllGroup()
    }else{
      message.error(msg as string)
    }
  }catch (e) {

  }
}

async function handleDeleteGroup(id: number){
  const { message, dialog } = createDiscreteApi(["message", "dialog"])
  dialog.error({
    title: '删除',
    content: '确定删除该分组？',
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      try{
        const { result = [], success, code, msg } = await useFetchPost('/followGroup/delete', { id })
        if(success){
          message.success('已删除')
          getAllGroup()
        }else{
          message.error(msg as string)
        }
      }catch (e) {

      }
    },
    onNegativeClick: () => {

    }
  })
}

function handleEditGroup(group: FollowGroup) {
  editItem.value = JSON.parse(JSON.stringify(group))
}

async function handleSave() {
  const { message } = createDiscreteApi(["message"])
  if(!editItem.value) return

  editItem.value.name = editItem.value.name.trim()
  if(saveLoading.value) return
  saveLoading.value = true
  try{
    const { result, success, code, msg } = await useFetchPost('/followGroup/edit', editItem.value)
    if(success){
      editItem.value = undefined
      getAllGroup()
    }else{
      message.error(msg as string)
    }
    saveLoading.value = false
  }catch (e) {
    saveLoading.value = false
  }
}
</script>
