<template>
  <div class="json-uploader">
    <el-upload
      class="upload-area"
      drag
      action=""
      :auto-upload="false"
      :show-file-list="false"
      accept=".json"
      :on-change="handleFileChange"
    >
      <el-icon class="upload-icon"><Upload /></el-icon>
      <div class="upload-text">
        <span class="text-primary">点击上传</span> 或将文件拖拽到此处
      </div>
      <template #tip>
        <div class="upload-tip">
          仅支持 .json 格式文件
        </div>
      </template>
    </el-upload>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'
import { Upload } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['file-selected'])

// Handle file change
const handleFileChange = (file) => {
  if (!file) return
  
  // Validate file type
  if (!file.raw.type && !file.raw.name.endsWith('.json')) {
    ElMessage.error('请上传 JSON 格式文件')
    return
  }
  
  emit('file-selected', file.raw)
}
</script>

<style scoped>
.json-uploader {
  width: 100%;
}

.upload-area {
  width: 100%;
}

:deep(.el-upload) {
  width: 100%;
}

:deep(.el-upload-dragger) {
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-base);
}

.upload-icon {
  font-size: 48px;
  color: var(--el-text-color-secondary);
}

.upload-text {
  color: var(--el-text-color-regular);
  font-size: 14px;
  text-align: center;
}

.text-primary {
  color: var(--el-color-primary);
}

.upload-tip {
  color: var(--el-text-color-secondary);
  font-size: 12px;
  margin-top: var(--spacing-small);
  text-align: center;
}
</style>