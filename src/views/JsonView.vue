<template>
  <div class="json-view">
    <!-- 顶部操作栏 -->
    <div class="view-header">
      <div class="header-left">
        <span class="filename-label">当前文件：</span>
        <el-tag size="small" type="success" class="filename-tag">
          {{ currentFilename || '未选择文件' }}
        </el-tag>
      </div>
      <div class="header-right">
        <el-button 
          type="primary" 
          plain
          size="small" 
          @click="handlePreview"
          :disabled="!jsonData"
        >
          <el-icon class="mr-1"><View /></el-icon>
          预览
        </el-button>
        <el-button 
          type="primary"
          size="small"
          @click="handleExport"
          :disabled="!jsonData"
        >
          <el-icon class="mr-1"><Download /></el-icon>
          导出
        </el-button>
      </div>
    </div>

    <!-- 上传区域 -->
    <div class="upload-area">
      <json-uploader @file-selected="handleFileSelected" />
    </div>

    <!-- JSON编辑器 -->
    <div v-if="jsonData" class="editor-area">
      <json-editor
        v-model="jsonData"
        @update:model-value="handleUpdate"
      />
    </div>

    <!-- 预览对话框 -->
    <el-dialog
      v-model="previewVisible"
      title="JSON预览"
      width="60%"
      :close-on-click-modal="false"
      class="preview-dialog"
    >
      <div class="preview-content">
        <pre class="json-preview">{{ formattedJson }}</pre>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="previewVisible = false">关闭</el-button>
          <el-button type="primary" @click="handleCopyJson">
            复制内容
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { View, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import JsonEditor from '../components/JsonEditor.vue'
import JsonUploader from '../components/JsonUploader.vue'
import { generateFilename } from '../utils/dateUtils'

// 状态管理
const jsonData = ref(null)
const currentFilename = ref('')
const previewVisible = ref(false)

// 格式化的JSON字符串
const formattedJson = computed(() => {
  if (!jsonData.value) return ''
  return JSON.stringify(jsonData.value, null, 2)
})

// 处理文件选择
const handleFileSelected = (file) => {
  currentFilename.value = file.name
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      jsonData.value = JSON.parse(e.target.result)
      ElMessage.success('文件加载成功')
    } catch (error) {
      ElMessage.error('无效的JSON文件')
    }
  }
  reader.readAsText(file)
}

// 处理数据更新
const handleUpdate = (value) => {
  jsonData.value = value
}

// 处理预览
const handlePreview = () => {
  if (!jsonData.value) {
    ElMessage.warning('暂无数据可预览')
    return
  }
  previewVisible.value = true
}

// 处理复制JSON
const handleCopyJson = async () => {
  try {
    await navigator.clipboard.writeText(formattedJson.value)
    ElMessage.success('复制成功')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 处理导出
const handleExport = () => {
  if (!jsonData.value) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  try {
    const jsonString = JSON.stringify(jsonData.value, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const exportFilename = generateFilename(currentFilename.value || 'data.json')
    
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = exportFilename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
    
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('Export error:', error)
    ElMessage.error('导出失败')
  }
}
</script>

<style scoped>
.json-view {
  padding: var(--spacing-large);
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-large);
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-base) var(--spacing-large);
  background-color: var(--bg-white);
  border-radius: var(--radius-base);
  box-shadow: var(--shadow-light);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-small);
}

.filename-label {
  color: var(--text-secondary);
  font-size: 14px;
}

.filename-tag {
  font-weight: 500;
}

.header-right {
  display: flex;
  gap: var(--spacing-small);
}

.upload-area {
  background-color: var(--bg-white);
  border-radius: var(--radius-base);
  box-shadow: var(--shadow-light);
  padding: var(--spacing-large);
}

.editor-area {
  flex: 1;
  min-height: 0;
  background-color: var(--bg-white);
  border-radius: var(--radius-base);
  box-shadow: var(--shadow-light);
  padding: var(--spacing-large);
  overflow: auto;
}

.preview-dialog {
  :deep(.el-dialog__body) {
    padding: 0;
  }
}

.preview-content {
  padding: var(--spacing-large);
  background-color: var(--bg-light);
  max-height: 60vh;
  overflow-y: auto;
}

.json-preview {
  margin: 0;
  font-family: monospace;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-primary);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-small);
  padding: var(--spacing-base) var(--spacing-large);
  background-color: var(--bg-white);
  border-top: 1px solid var(--border-light);
}

.mr-1 {
  margin-right: 4px;
}

/* 调整上传组件样式 */
:deep(.el-upload-dragger) {
  height: 120px;
}
</style> 