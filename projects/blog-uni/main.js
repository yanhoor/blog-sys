


// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
import UserName from './components/user/user-name.vue'
import UserAvatar from './components/user/user-avatar.vue'
import * as Pinia from 'pinia'
export function createApp() {
  const app = createSSRApp(App)
  app.use(Pinia.createPinia())
  app.component('user-name', UserName)
  app.component('user-avatar', UserAvatar)
  return {
    app
  }
}
// #endif