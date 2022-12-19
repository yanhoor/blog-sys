# blog-sys

## 项目运行

- 确保已安装 `Mysql`、`Redis`

- `pnpm i`

- 在 `blog-node` 目录下执行：

  - `npx prisma generate`

  - `npx prisma db push`

- `pnpm run dev:node`

- `pnpm run dev:manage`

- `pnpm run dev:nuxt`

## 目标功能

### 总体目标

- [x] `pnpm` 管理的单体代码库

- [x] `Nginx` 部署

- [x] `PM2` 管理运行进程

- [x] 支持 `HTTPS/HTTP2`

- [ ] `Docker` 部署

- [ ] `CI/CD` 自动部署

### 各项目功能目标

#### blog-node

- [x] 使用 `Koa2 + ES6 + Koa-router + Mysql`

- [x] `Log4js` 日志记录

- [x] `Websocket` 即时通知博客动态

- [x] `Prisma` 连接数据库

- [x] `jwt` 鉴权管理，生成 `token`

- [x] `Redis` 记录博客点赞/阅读/收藏/排行等数据，保存 `token`

#### blog-manage

- [x] 使用 `Vue3 + Vue-Router + Vite + TypeScript + Element Plus + SCSS`

- [x] `Tailwind css` 调整样式

- [x] `Pina` 状态管理

- [x] 深色/浅色模式

- [x] 统计数据展示，如博客总量/用户总量，每日活跃用户数/博客发布量

- [x] `Echarts` 显示 7 天内用户注册量/博客发布量

- [x] 用户管理，锁定用户

- [x] 博客分类管理

- [x] 博客管理，上下架控制

#### blog-nuxt3

- [x] 使用 `Nuxt3 + TypeScript + Naive UI + SCSS`

- [x] `Tailwind css` 调整样式

- [x] `Websocket` 接收博客动态即时通知

- [x] 深色/浅色模式

- [x] 用户登录/注册

- [x] 编写/发表博客

- [x] 博客搜索/过滤

- [x] 评论博客

- [x] 博客数据记录，如阅读/点赞/收藏

- [x] 用户数据记录，如活跃时间

- [x] 用户主页

- [x] 修改个人资料

- [ ] 关注用户

- [ ] 用户动态展示

- [ ] 样式/过渡美化

- [ ] 移动端适配

## 目录结构

blog-sys
├── README.md
├── docker-compose.yml
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── projects
    ├── blog-manage                             后台管理系统
    │   ├── Dockerfile
    │   ├── README.md
    │   ├── auto-imports.d.ts
    │   ├── components.d.ts
    │   ├── index.html
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── postcss.config.cjs
    │   ├── public
    │   ├── src
    │   ├── tailwind.config.cjs
    │   ├── tsconfig.json
    │   ├── tsconfig.node.json
    │   └── vite.config.ts
    ├── blog-node                               node 接口
    │   ├── Dockerfile
    │   ├── README.md
    │   ├── config
    │   ├── ecosystem.config.js
    │   ├── logFiles
    │   ├── node.zip
    │   ├── package.json
    │   ├── prisma
    │   ├── public
    │   └── src
    └── blog-nuxt3                              前端博客系统
        ├── Dockerfile
        ├── README.md
        ├── app.vue
        ├── assets
        ├── components
        ├── components.d.ts
        ├── composables
        ├── ecosystem.config.js
        ├── error.log
        ├── error.vue
        ├── layouts
        ├── middleware
        ├── nuxt.config.ts
        ├── package-lock.json
        ├── package.json
        ├── pages
        ├── plugins
        ├── public
        ├── server
        ├── tailwind.config.js
        ├── tsconfig.json
        ├── types
        └── websocket.ts

21 directories, 36 files
