import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'
import {
  createStyleImportPlugin,
  VxeTableResolve,
  ElementPlusResolve
} from 'vite-plugin-style-import'
import viteCompression from 'vite-plugin-compression'

console.log('+++++++TEST_ENV++++++++', process.env.TEST_ENV)
// https://vitejs.dev/config/
export default defineConfig({
  base: '/manage/', // 所有静态资源都会以这个路径重写
  build: {
    outDir: 'dist/blog-manage' // 预览也是这个目录
  },
  plugins: [
    viteCompression({
      verbose: true,
      disable: false,
      ext: '.gz',
      algorithm: 'gzip', // 压缩格式：gzip、brotliCompress,
      threshold: 10240, // 只处理比这个值大的资源，按字节算
      deleteOriginFile: false // 是否删除原文件，最好不删除，服务器会自动优先返回同名的.gzip资源，如果找不到还可以拿原始文件
    }),
    vue(),
    AutoImport({
      // Auto import functions from Vue, e.g. ref, reactive, toRef...
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ['vue'],

      // Auto import functions from Element Plus, e.g. ElMessage, ElMessageBox... (with style)
      // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [
        // Auto register Element Plus components
        // 自动导入 Element Plus 组件
        ElementPlusResolver()
      ]
    }),
    createStyleImportPlugin({
      resolves: [VxeTableResolve(), ElementPlusResolve()],
      libs: [
        {
          libraryName: 'element-plus',
          esModule: true,
          resolveStyle: (name: string) => {
            return `element-plus/theme-chalk/${name}.css`
          }
        }
      ]
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://koa:8000',
        // target: 'http://blog-koa:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
