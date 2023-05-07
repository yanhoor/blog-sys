import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'

// 具体参考 https://react-redux.js.org/tutorials/typescript-quick-start
const store = configureStore({
  reducer: {
    user: userReducer
  }
})

// Can still subscribe to the store
store.subscribe(() =>
  console.log('========store.subscribe=========', store.getState())
)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store
