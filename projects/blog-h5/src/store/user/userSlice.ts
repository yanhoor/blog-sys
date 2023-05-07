import { createSlice } from '@reduxjs/toolkit'
import { getMyInfo, getNotificationCount, getAllGroup } from './asyncThunk'
import { User, FollowGroup } from 'sys-types'
import MyConfig from '@/config'

type UserStateType = {
  myInfo: User | null
  unreadTotal: number
  unreadAudit: number
  unreadCollect: number
  unreadComment: number
  unreadLike: number
  allGroupList: FollowGroup[]
}

const userSlice = createSlice({
  name: 'user',
  initialState: {
    myInfo: null,
    unreadTotal: 0,
    unreadAudit: 0,
    unreadCollect: 0,
    unreadComment: 0,
    unreadLike: 0,
    allGroupList: []
  } as UserStateType,
  // 不支持异步
  reducers: {
    // todoAdded(state, action) {
    //   state.push({
    //     id: action.payload.id,
    //     text: action.payload.text,
    //     completed: false
    //   })
    // },
    // todoToggled(state, action) {
    //   const todo = state.find((todo) => todo.id === action.payload)
    //   todo.completed = !todo.completed
    // }
  },
  // 异步
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    // 获取成功
    builder.addCase(getMyInfo.fulfilled, (state, action) => {
      state.myInfo = action.payload
    })
    // 获取失败
    builder.addCase(getMyInfo.rejected, (state, action) => {
      localStorage.setItem(MyConfig.TOKEN, '')
      console.log('=======getMyInfo.rejected=========', action)
    })
    builder.addCase(getNotificationCount.fulfilled, (state, action) => {
      state.unreadLike = action.payload.unreadLike
      state.unreadComment = action.payload.unreadComment
      state.unreadCollect = action.payload.unreadCollect
      state.unreadAudit = action.payload.unreadAudit
      state.unreadTotal = action.payload.unreadTotal
    })
    builder.addCase(getAllGroup.fulfilled, (state, action) => {
      state.allGroupList = action.payload
    })
  }
})

// export const {} = userSlice.actions
export default userSlice.reducer
