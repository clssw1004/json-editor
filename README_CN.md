# JSON Editor

## 项目简介

JSON Editor 是一个基于 Web 的 JSON 文件编辑器，旨在提供用户友好的界面来查看和编辑 JSON 数据。当前实现的功能包括：

- 文件上传：支持拖拽和点击上传 JSON 文件。
- JSON 编辑：提供直观的界面来编辑 JSON 数据。
- 数据预览：在对话框中预览编辑后的 JSON 数据。
- 数据导出：将编辑后的 JSON 数据导出为文件。

## 编译和运行项目

### 本地运行

1. 克隆项目到本地：

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. 安装依赖：

   ```bash
   npm install
   ```

3. 启动开发服务器：

   ```bash
   npm run serve
   ```

4. 在浏览器中打开 `http://localhost:8080` 查看项目。

### 使用 Docker 镜像

1. 构建 Docker 镜像：

   ```bash
   docker build -t json-editor .
   ```

2. 运行 Docker 容器：

   ```bash
   docker run -d -p 8080:80 json-editor
   ```

3. 在浏览器中打开 `http://localhost:8080` 使用 JSON Editor。

## 使用说明

- 上传 JSON 文件：点击上传区域或拖拽文件到上传区域。
- 编辑 JSON 数据：在编辑器中直接修改数据。
- 预览 JSON 数据：点击“预览”按钮查看编辑后的数据。
- 导出 JSON 数据：点击“导出”按钮下载编辑后的 JSON 文件。
