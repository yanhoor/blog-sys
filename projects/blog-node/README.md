# blog-koa2

## 使用 prisma

[终端所有命令](https://prisma.yoga/reference/api-reference/command-reference/)

- 安装依赖 `pnpm add prisma -D`

- 初始化文件 `npx prisma init`，然后按给出的提示操作，配置数据库

- 检查数据库 `npx prisma db pull`，一旦建立了连接，它就会对数据库进行内省(即读取数据库模式)。然后将数据库模式从 `SQL` 转换为 `Prisma` 数据模型。检查完成后，`Prisma` 模式文件被更新

- 安装客户端 `pnpm add @prisma/client`

- 自动格式化 `.prisma` 文件: `npx prisma format`

- 执行 `npx prisma generate`，每次修改 `schema` 都需要手动执行

- 将 `schema` 的修改推送到数据库：`npx prisma db push`

- `npx Prisma studio` 查看数据库

### 注意

- 默认读取根目录下 `.env` 配置的数据库，[说明](https://prisma.yoga/guides/development-environment/environment-variables/managing-env-files-and-setting-variables)

### 一系列坑

- [Github issues](https://github.com/prisma/prisma/discussions/3087), 列表查询时，不能计算返回相同查询条件得到的数据条数。[hack方法](https://prisma.yoga/concepts/components/prisma-client/transactions)

```javascript
const [list, total] = await prisma.$transaction([
  prisma.shopCategory.findMany({
    skip,
    take: pageSize,
    where: filter,
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      name: true
    },
    orderBy: { updatedAt: 'desc' }
  }),
  prisma.shopCategory.count({where: filter}) // 与上面一样的条件
])
```

- [Github issues](https://github.com/prisma/prisma/issues/5051), 取出来的时间是 `UTC +0.00` 的时间

### 注意

- 使用类型不同的值来查询，可能导致接口 404，如 `id` 一般为 `int`，使用了字符串值来查询

## 注意事项

### 文件路径

`fs.unlinkSync(path)`: `path` 指的是相对于项目根目录的相对路径，其他 `fs` 操作文件的路径也是一样

### jwt校验

对于需要登录才能调用的接口，使用 `jwt` 进行校验和拦截

- 安装 `pnpm add koa-jwt jsonwebtoken -S`

- 使用 `koa-router` 添加中间件

```javascript
// jwt 校验登录，校验不通过会返回 401 状态码
app.use((ctx, next) => {
  return next().catch(err => {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = '401 Unauthorized - Protected resource, use Authorization header to get access\n';
    } else {
      throw err;
    }
  });
});

router.use(
        jwt({
          secret: config.jwtSecret, // 一个自定义字符串
          // cookie: 'token', // 从 cookie 中获取token
          debug: true // 开启debug可以看到准确的错误信息
        }).unless({ 
          custom: (ctx) => /\/login$|\/register$/.test(ctx.url) // 令这个函数返回 true 的路由都不会进行校验
        })
)
```

- 在登录成功后，生成 `token`

```javascript
// { id: user.id } 可以在 ctx.state.user 访问到
const token = jsonwebtoken.sign({ id: user.id }, config.jwtSecret, { expiresIn: 60 * 60 *24 * 7 }) // expiresIn token过期秒数
```

- 在上面第2步，由于没有使用 `cookie`，所以这个校验的 `token` 需要前端通过自定义请求头 `Authorization` 回传，值为字符串 `Bearer `（注意后面有一个空格）拼接 `token`
```javascript
headers: {
    'Authorization': 'Bearer 3333333333'
}
```

- 服务端获取当前用户 `id`

````javascript
// 方法一，直接获取上面的 jsonwebtoken.sign()
const userId = ctx.state.user.id

// 方法二，手动获取 headers 的字段值校验
const token = ctx.headers['authorization']
const { id: userId } = await jsonwebtoken.verify(token.replace(/Bearer /g, ''), config.jwtSecret)
````

- 退出登录时前端清空 `token`，但是服务端的 `token` 无法手动清除，需要等到过期时间自动失效

### 挂载前端资源

前端项目需要注意以下处理：

- 请求接口的 `baseUrl`

- 静态资源的 `baseUrl`，需要在 `vite.config.js` 设置 `base`

- 路由的 `baseUrl`，如:

  ```javascript
  const router = createRouter({
    history: createWebHistory('/manage/'), // 因为应用部署在 /manage/ 子目录
    routes
  })
  ```

`node` 项目的处理：

```javascript
// 前端打包的资源放在 /public/manage 下

// 处理 history 路由模式刷新404
app.use(async (ctx, next) => {
  const matchUrl = '/manage' // 需要判断的路径
  await next() // 等待请求执行完毕
  const curUrl = ctx.request.url
  if(ctx.response.status === 404 && curUrl.includes(matchUrl)){
    if (!curUrl.includes('.')) {
      // 对于页面路由，返回 index.html
      ctx.type = 'text/html; charset=utf-8' // 修改响应类型
      ctx.body= fs.readFileSync(path.resolve(__dirname, '../public/manage/index.html')) // 修改响应体
    }else{
      // 对于静态资源，如 /manage/assets/index.4e3bc69a.js, 直接获取，并添加 mime 类型
      const p = path.join(__dirname, '../public', ctx.request.url)
      ctx.type = mime.getType(ctx.request.url) // 修改响应类型
      ctx.body= fs.readFileSync(p) // 修改响应体
    }
  }
})

app.use(mount('/manage', require('koa-static')(__dirname + '../public/manage'))) // 将 /public/web 下的目录挂载到 /manage，注意：接口也有/manage前缀
```

## 待解决

### 时间格式问题

- 使用数据库默认格式，这样可以自动记录创建时间和更新时间等，但是前端需要显示格式化的时间，这样是后端还是前端处理？特别是深层嵌套的时间
- 如果使用格式化后的时间字符串，这样每个时间需要自己处理后保存

`prisma` 取出来的时间是 `UTC +0.00` 的时间，[Github issues](https://github.com/prisma/prisma/issues/5051)

### 软删除问题

[参考](https://prisma.yoga/concepts/components/prisma-client/middleware/soft-delete-middleware), 暂时使用中间件根据操作类型和参数，设置删除时间来表示，同时拦截查询和操作软删除的数据。但是对于某些可能需要查找软删除数据或硬删除的场景，需要怎样处理？添加参数如 `includedDeleted` 来查询？这样需要给数据添加不代表真实数据的字段

### 关联查询

用户与博客的多对多关系中，如何在博客列表查询当前用户是否点赞
