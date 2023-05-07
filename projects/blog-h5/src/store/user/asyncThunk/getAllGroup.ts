import { createAsyncThunk } from '@reduxjs/toolkit'
import $http, { followGroup_all } from '@/http'

// 参考 https://redux-toolkit.js.org/api/createAsyncThunk#payloadcreator
// First, create the thunk
export const getAllGroup = createAsyncThunk(
  'user/getAllGroupStatus',
  async (args, thunkAPI) => {
    try {
      const { msg, success, result } = await $http.post(followGroup_all)
      if (success) {
        return result
      } else {
        return thunkAPI.rejectWithValue(msg)
      }
    } catch (e) {
      console.log('=====getAllGroup error======', e)
      return thunkAPI.rejectWithValue(e)
    }
  }
)
