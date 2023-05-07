import { createAsyncThunk } from '@reduxjs/toolkit'
import MyConfig from '@/config'
import $http, { myInfo } from '@/http'
import { getNotificationCount, getAllGroup } from './index'

// 参考 https://redux-toolkit.js.org/api/createAsyncThunk#payloadcreator
// First, create the thunk
export const getMyInfo = createAsyncThunk(
  'user/getMyInfoStatus',
  async (args, thunkAPI) => {
    const token = localStorage.getItem(MyConfig.TOKEN)
    console.log('=========getMyInfo token=============', token)
    if (!token) return null

    try {
      const { msg, success, result } = await $http.get(myInfo)
      if (success) {
        thunkAPI.dispatch(getNotificationCount())
        thunkAPI.dispatch(getAllGroup())
        return result
      } else {
        return thunkAPI.rejectWithValue(msg)
      }
    } catch (e) {
      console.log('=====getMyInfo error======', e)
      return thunkAPI.rejectWithValue(e)
    }
  }
)
