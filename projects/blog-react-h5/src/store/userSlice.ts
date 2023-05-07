import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import $http, { myInfo } from '@/http'
import MyConfig from '@/config'

// 参考 https://redux-toolkit.js.org/api/createAsyncThunk#payloadcreator
// First, create the thunk
export const getMyInfo = createAsyncThunk(
  'user/getMyInfoStatus',
  async (args, thunkAPI) => {
    const token = localStorage.getItem(MyConfig.TOKEN)
    if (!token) return

    try {
      const { msg, success, result } = await $http.get(myInfo)
      if (success) {
        return result
      } else {
        return thunkAPI.rejectWithValue(msg)
      }
    } catch (e) {
      return thunkAPI.rejectWithValue(e)
      console.log('=====useFetchAppendList error======', e)
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState: {
    myInfo: null
  },
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
    builder.addCase(getMyInfo.fulfilled, (state, action) => {
      // Add user to the state array
      state.myInfo = action.payload
    })
    builder.addCase(getMyInfo.rejected, (state, action) => {
      console.log('=======getMyInfo.rejected=========', action, action.payload)
    })
  }
})

// export const {} = userSlice.actions
export default userSlice.reducer
