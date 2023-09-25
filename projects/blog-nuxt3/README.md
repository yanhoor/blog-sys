# blog-nuxt3

## 部署启动

需要先 `nuxt build`，然后执行 `pm2 start ecosystem.config.js`

## 常用知识点

- 不要在 `<setup script>` 或 `setup()` 外定义 `const state = ref()`，这样会导致所有访问的用户共享这个变量并且导致内存泄漏，应该使用 `const useX = () => useState('x')`

## 使用依赖

在引入全局依赖时，可以在 `plugins` 里面通过 `defineNuxtPlugin()` 定义，如 `dayjs`

## 开发增强

### Tailwind CSS

`Tailwind css` 建议只使用 `postcss`，不要使用其他预处理器如 `sass`、`less` 等，配置如下：

- [参考](https://www.tailwindcss.cn/docs/installation/using-postcss)安装 `postcss`

- [参考](https://nuxt.com/docs/api/configuration/nuxt-config#postcss)，将上一步的 `postcss` 配置写在 `nuxt.config.js`

```javascript
export default defineNuxtConfig({
  postcss: {
    plugins: {
      'tailwindcss/nesting': {}, // 这样就可以使用 sass 的嵌套语法，注意在 tailwindcss 前面
      tailwindcss: {},
      autoprefixer: {}
    }
  }
})
```

- 配置支持 `sass` 的嵌套写法，如上一步配置写在 `nuxt.config.js`。[参考](https://www.tailwindcss.cn/docs/using-with-preprocessors#nesting)

- 单文件组件使用 `<style lang="postcss">`

## 待完成功能

- 数量记录：博主的所有文章累计被阅读数

## 问题记录

### 正式环境报引入包错误

比如引入 `import { api as viewerApi } from 'v-viewer'` 时，报错：`Named export 'api' not found. The requested module 'v-viewer' is a CommonJS module, which may not support all module.exports as named exports. CommonJS modules can always be imported via the default export, for example using: import pkg from 'v-viewer'; const { api } = pkg;`

[参考](https://nuxt.com/docs/guide/concepts/esm/#troubleshooting-esm-issues)

解决方法：

- 将所在组件改为客户端组件：`component.client.vue`

- 将这个包写入以下配置

```javascript
export default defineNuxtConfig({
  build: {
    transpile: ['v-viewer']
  }
})
```

### 依赖安装报错

使用 `pnpm i` 时 需要加 `--shamefully-hoist`，这样打包才不会提示缺少 `vue`

### 部分事件回调没有执行

服务端渲染的 `audio` 元素没有触发 `durationchange` 事件。好像是因为在服务端完成渲染该元素时已经触发，所以在客户端不会再触发，同理 `load` 事件也一样

### Docker 运行报错 `connect ECONNREFUSED 127.0.0.1:80`

原因是服务端渲染请求后端接口时，`baseUrl` 应该是 `docker` 的网络名（如 `http://koa:8000/api` ），而不是暴露外网访问的 `localhost`

### `Error: nuxt instance unavailable`

- `useCookie()/useState()/useFetch()/useLazyFetch()/useAsyncData()/useLazyAsyncData()` 只能在 `setup` 或者生命周期钩子使用

- `useRoute()` 可以在 `setup`、`plugin` 或者路由中间件使用

```vue
<script setup>
const cookie = useCookie('token') // 正确

init()

function init() {
  getInfo()
}

function getInfo() {
  const cookie = useCookie('token') // 错误，实际在 init() 作用域内
}
</script>
```

### 重新进入页面没有请求

`useFetch(url, options)` `options` 内有两个参数：`key` 和 `initialCache` 会缓存请求结果，`key` 标识请求的唯一值，`initialCache` 为 `true` 时缓存第一次请求，后续相同的请求不会发出

### 手动调用全局对象的方法无效

在 `head` 插入了 `<script>` 标签请求 `prismjs` 用于博客内代码块样式显示，在 `onMounted()` 钩子执行。只有在第一次进入时生效，返回列表再次进来无效。

在博客详情页面设置：

```javascript
definePageMeta({
  pageTransition: false,
})
```

### naive-ui
- 设置为 `dark` 后，刷新页面，数据虽然已经更新，但是还是浅色主题

暂时解决：在 `onMounted()` 内，还要在 `setTimeout` 内部设置更新数据，而且时间需要设置为足够长。

```javascript
onMounted(() => {
  // 还要加个setTimeout 主题才会换??
  setTimeout(() => {
    const s = localStorage.getItem('vueuse-color-scheme')
    darkMode.value = s === 'dark'
  }, 300)
})
```

  -另外，如果不在 `NConfigProvider` 设置 `inline-theme-disabled`，在深色模式下刷新页面后，模式指示 `switch` 会显示 `light`

  - 在用户主页，深色模式下刷新页面，显示浅色

- 使用 `tailwindcss` 后，样式被覆盖

[潜在的样式冲突](https://www.naiveui.com/zh-CN/light/docs/style-conflict), [injectposition](https://tailwindcss.nuxt.dev/getting-started/options/#injectposition), [临时解决方案1](https://github.com/tailwindlabs/tailwindcss/issues/6602#issuecomment-1029161314), [临时解决方案2](https://www.whidy.net/vite-use-elementplus-and-tailwindcss-best-practice-1st/)

  - [下载 `preflight` 文件](https://unpkg.com/tailwindcss@3.2.4/src/css/preflight.css)，并注释 `button` 相关代码

  ```css
  button,
  [type='button'],
  [type='reset'],
  [type='submit'] {
    -webkit-appearance: button; /* 1 */
    /*注释这两行*/
    /*background-color: transparent; /* 2 */
    /*background-image: none; /* 2 */
  }
  ```

  - 修改 `tailwind.css` 文件，删除 `@tailwind base;`，引入上面下载的样式文件来替换

    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    /*替换后*/
    @import "preflight.css";
    @tailwind components;
    @tailwind utilities;
    ```

### 布局不同的页面间跳转报错

在 `home` 使用了 `default layout`，在 `login` 没有使用，这样从 `login` 返回到 `home` 时报错：激活的节点与虚拟节点不一致

不知为啥，偶尔有问题，部署了好像也没问题

### 页面间导航报错

```text
Cannot read properties of null (reading 'parentNode')

Vue warn]: Unhandled error during execution of scheduler flush. This is likely a Vue internals bug. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/core
```

暂时确定是因为 `<NuxtPage>` 添加了 `page-key`，[参考](https://github.com/nuxt/framework/issues/2985)，在外面加 `<div>` 也无效

### 页面过渡

页面过渡效果无效，需要确保页面组件为单一元素作为根节点，注意注释也会作为一个节点。[参考](https://nuxt.com/docs/guide/directory-structure/pages#usage)

```HTML
<!--正确-->
<template>
  <div>
    <!-- This page correctly has only one single root element -->
    Page content
  </div>
</template>

<!--错误-->
<template>
  <!-- This page will not render when route changes during client side navigation, because of this comment -->
  <div>Page content</div>
</template>
```

### await 与 defineExpose 冲突

在 `<script setup>` 中，调用 `await fn()` 后再通过 `defineExpose()` 暴露组件属性和方法，在父组件通过 `ref` 使用时无法获取到，得到 `undefined`。如 `search.vue` 中通过 `ref` 调用 `PostList.vue` 的方法。原因未知...
