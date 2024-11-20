<template>
  <div class="json-view">
    <el-card class="upload-card">
      <template #header>
        <div class="card-header">
          <span>JSON 文件上传</span>
        </div>
      </template>
      <json-uploader @update:jsonData="handleJsonData" />
    </el-card>

    <el-card v-if="jsonData" class="editor-card">
      <template #header>
        <div class="card-header">
          <span>JSON 编辑器</span>
          <el-button type="primary" size="small" @click="handleSave">
            保存修改
          </el-button>
        </div>
      </template>
      <json-editor 
        v-model="jsonData" 
        @update:model-value="handleEditorUpdate"
      />
    </el-card>

    <!-- 预览区域 -->
    <!-- <el-card v-if="jsonData " class="preview-card">
      <template #header>
        <div class="card-header">
          <span>数据预览</span>
        </div>
      </template>
      <pre>{{ JSON.stringify(jsonData, null, 2) }}</pre>
    </el-card> -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import JsonUploader from '../components/JsonUploader.vue'
import JsonEditor from '../components/JsonEditor.vue'

const jsonData = ref(null)

// 处理文件上传后的数据
const handleJsonData = (data) => {
  jsonData.value = data
  if (data) {
    ElMessage.success('JSON 文件加载成功')
  }
}

// 处理编辑器数据更新
const handleEditorUpdate = (newValue) => {
  jsonData.value = newValue
}

// 处理保存
const handleSave = () => {
  // 创建并下载 JSON 文件
  const dataStr = JSON.stringify(jsonData.value, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'edited.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  ElMessage.success('文件保存成功')
}
</script>

<style scoped>
.json-view {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upload-card,
.editor-card,
.preview-card {
  width: 100%;
}
</style> 