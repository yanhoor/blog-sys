FROM node:19.8.1

# 指定作者
LABEL maintainer="yanhoor"

# 指定容器内的工作路径，这是容器内的目录
WORKDIR /projects/blog-nuxt3

# 复制全部文件，源代码，将 . 项目中的当前目录复制到 . 镜像中的工作目录。
#COPY ./package.json ./package.json
COPY . .

# 运行命令，安装依赖
# Dockerfile 的指令每执行一次都会在 docker 上新建一层。所以过多无意义的层，会造成镜像膨胀过大
# 例如 RUN npm install && cd /app && mkdir logs
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org \
    && cnpm i -g pnpm \
    && pnpm install --shamefully-hoist

ENV NODE_ENV=development BASE_API=test_base_url
# CMD 指令只能一个，是容器启动后执行的命令，算是程序的入口。
# 如果还需要运行其他命令可以用 && 连接，也可以写成一个shell脚本去执行。
# 例如 CMD cd /app && ./start.sh
CMD ["npm","run","dev_docker"]

# 暴露端口到宿主机
#EXPOSE 3000
