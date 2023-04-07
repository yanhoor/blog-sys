# blog-sys

本项目是个人学习 `Node.js/Vue3/Nuxt3/uni-app/TypeScript` 并加以实践而构建的一个博客发布平台，计划通过搭积木式编写功能模块，逐步形成一个具有后端接口、后台管理和前端发布的完整系统。

## 预览

### PC 端

[预览地址](https://niubility.website/blog/)

### 小程序

[预览地址](https://niubility.website/blog/post/1)

## 项目运行

- 确保已安装 `Mysql`、`Redis`、`Node v16`

- `pnpm i`

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

#### blog-node: 后端接口

- [x] 使用 `Koa2 + ES6 + Koa-router + Mysql`

- [x] `Log4js` 日志记录

- [x] `Websocket` 即时通知博客动态

- [x] `Prisma` 连接数据库

- [x] `jwt` 鉴权管理，生成 `token`

- [x] `Redis` 记录博客点赞/阅读/收藏/排行等数据，保存 `token`

- [x] 支持分片上传/秒传

#### blog-manage: 后台管理

- [x] 使用 `Vue3 + Vue-Router + Vite + TypeScript + Element Plus + SCSS`

- [x] `Tailwind css` 调整样式

- [x] `Pina` 状态管理

- [x] 深色/浅色模式

- [x] 统计数据展示，如博客总量/用户总量，每日活跃用户数/博客发布量

- [x] `Echarts` 显示 7 天内用户注册量/博客发布量

- [x] 用户管理，锁定用户

- [x] 博客分类管理

- [x] 博客管理，审核

- [x] 评论管理，审核

#### blog-nuxt3: PC端博客

- [x] 使用 `Nuxt3 + TypeScript + Naive UI + SCSS`

- [x] `Tailwind css` 调整样式

- [x] `Websocket` 接收博客动态即时通知

- [x] 深色/浅色模式

- [x] 用户登录/注册

- [x] 编写/发表博客

- [x] 博客搜索/过滤

- [x] 博客评论/评论引用/评论排序/删除评论

- [x] 博客数据记录，如阅读/点赞/收藏

- [x] 用户数据记录，如活跃时间

- [x] 博客支持视频/图片

- [x] 用户主页，博客/精选/视频/图片墙

- [x] 修改个人资料

- [ ] 数据：每小时活跃用户数 

- [x] 关注用户

- [ ] 用户动态展示

- [ ] 样式/过渡美化

- [ ] 移动端适配

#### blog-uni: 小程序端博客

- [x] 使用 `uni-app` 构建

- [x] 发布地点/查看地点

- [x] 其他功能同步 `blog-nuxt3`

#### blog-flutter: Flutter 端博客
