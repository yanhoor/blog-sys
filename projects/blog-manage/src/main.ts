import { createApp, App } from 'vue'
import './style.css'
import AppVue from './App.vue'
import ElementPlus from 'element-plus'
import router from './routes'
import $http from '@/http'
import { createPinia } from 'pinia'
import 'xe-utils'
import { VXETable, Table, Column } from 'vxe-table'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

VXETable.setup({
  table: {
    stripe: true
  }
})
function useTable(app: App){
  app.use(VXETable).use(Table).use(Column)
}

const app = createApp(AppVue)

app.config.globalProperties.$http = $http
app.use(ElementPlus, {
  zIndex: 3000 ,
  locale: zhCn
})
app.use(router)
app.use(useTable)
app.use(createPinia())

app.mount('#app')
