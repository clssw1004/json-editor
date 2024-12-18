# 使用最小化的 Node.js 基础镜像
FROM node:22-alpine3.20 AS build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 构建项目
RUN npm run build

# 使用 Nginx 作为生产环境的服务器
FROM nginx:1.26.2-alpine3.20-perl

# 复制构建的文件到 Nginx 的默认静态文件目录
COPY --from=build /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]