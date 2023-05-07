import { createAsyncThunk } from '@reduxjs/toolkit'
import $http, { notification_count } from '@/http'

// 参考 https://redux-toolkit.js.org/api/createAsyncThunk#payloadcreator
// First, create the thunk
export const getNotificationCount = createAsyncThunk(
  'user/getNotificationCountStatus',
  async (args, thunkAPI) => {
    try {
      const { msg, success, result } = await $http.post(notification_count)
      if (success) {
        return result
      } else {
        return thunkAPI.rejectWithValue(msg)
      }
    } catch (e) {
      console.log('=====getNotificationCount error======', e)
      return thunkAPI.rejectWithValue(e)
    }
  }
)
