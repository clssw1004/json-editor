<template>
  <div class="json-editor">
    <!-- 编辑器内容 -->
    <div class="editor-content">
      <div class="content-wrapper">
        <div 
          v-for="(value, key) in modelValue" 
          :key="key"
          class="field-row"
        >
          <!-- 字段标签 -->
          <div class="field-label">
            <span class="label-text">{{ key }}</span>
            <el-tag size="small" effect="plain" class="label-type">
              {{ getValueType(value) }}
            </el-tag>
          </div>
          
          <!-- 字段值 -->
          <div class="field-value">
            <div class="value-wrapper" :class="{ 'full-width': isComplexValue(value) }">
              <json-array-editor
                v-if="Array.isArray(value)"
                v-model="localValue[key]"
                @update:model-value="handleUpdate(key, $event)"
                :path="[...currentPath, key]"
              />
              
              <json-editor
                v-else-if="isObject(value)"
                v-model="localValue[key]"
                @update:model-value="handleUpdate(key, $event)"
                :path="[...currentPath, key]"
              />
              
              <value-editor
                v-else
                :value="value"
                @update:value="handleUpdate(key, $event)"
                :path="[...currentPath, key]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import JsonArrayEditor from './JsonArrayEditor.vue'
import ValueEditor from './editors/ValueEditor.vue'
import { getValueType } from '../utils/typeUtils'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  filename: {
    type: String,
    default: 'data.json'
  },
  path: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const localValue = ref({ ...props.modelValue })
const currentPath = computed(() => props.path || [])

// 判断是否为复杂值
const isComplexValue = (value) => {
  return typeof value === 'object' && value !== null
}

// 判断是否为对象（非数组）
const isObject = (value) => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// 处理值更新
const handleUpdate = (key, value) => {
  const newValue = { ...localValue.value, [key]: value }
  localValue.value = newValue
  emit('update:modelValue', newValue)
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

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-small) var(--spacing-base);
  background-color: var(--bg-light);
  border-bottom: 1px solid var(--border-light);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-small);
}

.filename-label {
  color: var(--text-regular);
  font-size: 14px;
}

.filename-tag {
  font-weight: 500;
}

.editor-content {
  padding: var(--spacing-base);
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-base);
}

.field-row {
  display: flex;
  gap: var(--spacing-large);
  align-items: flex-start;
  width: 100%;
}

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

.field-value {
  flex: 1;
  min-width: 0;
}

.value-wrapper {
  max-width: 100%;
}

.value-wrapper.full-width {
  flex: 1;
}

.mr-1 {
  margin-right: 4px;
}

.nested-editor {
  width: 100%;
  background-color: var(--bg-light);
  border-radius: var(--radius-base);
  margin-top: var(--spacing-small);
}

:deep(.json-editor .editor-header) {
  display: none;
}

:deep(.el-input-number) {
  width: 120px;
}

:deep(.el-switch) {
  margin-left: var(--spacing-small);
}

:deep(.el-table__header th) {
  font-weight: 600;
  background-color: var(--el-fill-color-light);
}

:deep(.el-table__header .cell) {
  font-weight: 600;
}
</style> 