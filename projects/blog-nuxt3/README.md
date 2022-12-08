# blog-nuxt3

## 部署启动

需要先 `nuxt build`，然后执行 `pm2 start ecosystem.config.js`

## 使用依赖

在引入全局依赖时，可以在 `plugins` 里面通过 `defineNuxtPlugin()` 定义，如 `dayjs`

## 问题记录

### build

使用 `pnpm i` 时 需要加 `--shamefully-hoist`，这样打包才不会提示缺少 `vue`

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

另外，如果不在 `NConfigProvider` 设置 `inline-theme-disabled`，在深色模式下刷新页面后，模式指示 `switch` 会显示 `light`

- 使用 `tailwindcss` 后，样式被覆盖

[潜在的样式冲突](https://www.naiveui.com/zh-CN/light/docs/style-conflict), [injectposition](https://tailwindcss.nuxt.dev/getting-started/options/#injectposition), [Conflict with tailwindcss normalize.css](https://github.com/tusen-ai/naive-ui/issues/2782)

### 布局不同的页面间跳转报错

在 `home` 使用了 `default layout`，在 `login` 没有使用，这样从 `login` 返回到 `home` 时报错：激活的节点与虚拟节点不一致

不知为啥，偶尔有问题，部署了好像也没问题
