import { createSlice } from '@reduxjs/toolkit'
import { getMyInfo } from './asyncThunk'
import { User } from 'sys-types'

type UserStateType = {
  myInfo: User | null
}

const userSlice = createSlice({
  name: 'user',
  initialState: {
    myInfo: null
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
      // Add user to the state array
      state.myInfo = action.payload
    })
    // 获取失败
    builder.addCase(getMyInfo.rejected, (state, action) => {
      console.log('=======getMyInfo.rejected=========', action, action.payload)
    })
  }
})

// export const {} = userSlice.actions
export default userSlice.reducer
