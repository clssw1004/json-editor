<template>
  <div class="json-editor">
    <!-- 顶部操作栏 -->
    <div class="editor-header">
      <div class="header-left">
        <el-tag size="small" type="info">JSON编辑器</el-tag>
      </div>
      <div class="header-right">
        <el-button 
          type="primary"
          size="small"
          @click="handleExport"
        >
          <el-icon class="mr-1"><Download /></el-icon>
          导出
        </el-button>
      </div>
    </div>

    <!-- 编辑器内容 -->
    <div class="editor-content">
      <div class="content-wrapper">
        <template v-for="(value, key) in modelValue" :key="key">
          <div class="field-row">
            <!-- 字段标签 -->
            <div class="field-label">
              <span class="label-text">{{ key }}</span>
              <el-tag size="small" effect="plain" class="label-type">
                {{ getValueType(value) }}
              </el-tag>
            </div>
            
            <!-- 字段值 -->
            <div class="field-value">
              <div v-if="Array.isArray(value)" class="value-wrapper full-width">
                <json-array-editor
                  v-model="localValue[key]"
                  @update:model-value="handleUpdate(key, $event)"
                />
              </div>
              
              <div v-else-if="isObject(value)" class="value-wrapper full-width">
                <json-editor
                  v-model="localValue[key]"
                  @update:model-value="handleUpdate(key, $event)"
                />
              </div>
              
              <div v-else class="value-wrapper">
                <value-editor
                  :value="value"
                  @update:value="handleUpdate(key, $event)"
                />
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import { Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import JsonArrayEditor from './JsonArrayEditor.vue'
import ValueEditor from './editors/ValueEditor.vue'
import { getValueType } from '../utils/typeUtils'
import { generateFilename } from '../utils/dateUtils'

// Props
const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  filename: {
    type: String,
    default: 'data.json'
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Local state
const localValue = ref({ ...props.modelValue })

// Watch for external changes
watch(() => props.modelValue, (newVal) => {
  localValue.value = { ...newVal }
}, { deep: true })

// Handle value updates
const handleUpdate = (key, value) => {
  const newValue = { ...localValue.value, [key]: value }
  localValue.value = newValue
  emit('update:modelValue', newValue)
}

// Check if value is object (not array)
const isObject = (value) => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// Handle export
const handleExport = () => {
  try {
    // Convert data to formatted JSON string
    const jsonString = JSON.stringify(localValue.value, null, 2)
    
    // Create blob with JSON data
    const blob = new Blob([jsonString], { type: 'application/json' })
    
    // Generate filename with timestamp
    const filename = generateFilename(props.filename)
    
    // Create and trigger download link
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    
    // Append, click and cleanup
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
.json-editor {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-small);
  background-color: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-base);
}

/* 顶部操作栏样式 */
.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-small) var(--spacing-base);
  background-color: var(--bg-light);
  border-bottom: 1px solid var(--border-light);
}

/* 内容区域样式 */
.editor-content {
  padding: var(--spacing-base);
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-base);
}

/* 字段行样式 */
.field-row {
  display: flex;
  gap: var(--spacing-large);
  align-items: flex-start;
  width: 100%;
}

/* 标签样式 */
.field-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-small);
  min-width: 200px;
  flex-shrink: 0;
}

.label-text {
  font-weight: 500;
  color: var(--text-primary);
}

.label-type {
  flex-shrink: 0;
}

/* 值区域样式 */
.field-value {
  flex: 1;
  min-width: 0;
  display: flex;
}

.value-wrapper {
  flex: 1;
}

.value-wrapper:not(.full-width) {
  max-width: 300px;
}

/* 图标间距 */
.mr-1 {
  margin-right: 4px;
}

/* 嵌套编辑器样式 */
.nested-editor {
  width: 100%;
  background-color: var(--bg-light);
  border-radius: var(--radius-base);
  margin-top: var(--spacing-small);
}

/* 隐藏嵌套编辑器的导出按钮 */
:deep(.json-editor .editor-header) {
  display: none;
}

/* 输入框样式调整 */
:deep(.el-input-number) {
  width: 120px;
}

:deep(.el-switch) {
  margin-left: var(--spacing-small);
}
</style> 