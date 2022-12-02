# 说明

# 使用注意

### slot

在使用命名 `slot` 时，需要用在 `template` 上，不能用在元素上。[参考](https://cn.vuejs.org/guide/components/slots.html#named-slots), 当一个组件同时接收默认插槽和具名插槽时，所有位于顶级的非 `<template>` 节点都被隐式地视为默认插槽的内容

```html
<!--正确-->
<template #body>
  
</template>

<!--错误，会放在默认插槽-->
<div #body>323</div>
```

### css 深度选择器

使用 `:deep(selector)` 语法

### reactive/ref 选择

需要重新赋值的表单对象，可以按以下使用：

-  推荐使用 `ref`
-  使用 `reactive`，重新赋值时使用 `Object.assign(reaciveObj, newObj)`

```javascript
const f1 = ref()
const f2 = reactive({})

const res = await getInfo()
f1.value = res
f2 = Object.assign(f2, res)
// 这种写法在之后想再重置为空表单就不好处理
f2 = Object.assign(f2, {name: ''}) // 这样后端传回来的其他字段没有被重置
```

## 环境变量

[环境变量和模式](https://cn.vitejs.dev/guide/env-and-mode.html#modes)

### 增加环境类型

默认只有 `development`(`vite` 命令) 和 `production` 环境(`vite build` 命令)，如果需要增加环境类型，执行命令时可以通过传递 `--mode` 选项标志来覆盖命令使用的默认模式。如 `vite build --mode staging`

### 增加环境变量

项目根目录下 `.env.[mode]` 文件(或者可以在配置文件 `vite.config.ts` 的 `envDir` 指定环境文件目录位置)为指定的环境 `[mode]` 添加变量，里面的变量名需要以 `VITE_xxxx` 形式命名(或者在配置文件的 `envPrefix` 指定其他前缀)，然后在业务代码中以 `import.meta.env.VITE_xxxx` 形式使用，这样在对应的环境就可以读取到设置的值。

## 问题处理

### 打包

在执行打包命令 `vue-tsc --noEmit && vite build` 时，可能会提示 `node_modules` 下 `ts` 相关错误，可以不执行 `vue-tsc --noEmit` 去掉报错

### 预览

需要先打包，然后执行 `vite preview`，预览的根目录与 `vite.config.ts` 下 `build.outDir` 一致，所以这个值是一个返回字符串的函数时，需要确保打包时和预览时的返回值一致

### 路径别名

需要在 `vite.config.ts` 文件的 `resolve.alias` 配置即可正常使用。但是 `webstorm` 可能会提示找不到模块，需要另外在 `tsconfig.json` 文件的 `compilerOptions.paths` 都配置

### 部署

#### 部署在子路径

在 `vite.config.js` 设置 `base: '/manage/'`，同时在路由设置 `history: createWebHistory('/manage/')`
