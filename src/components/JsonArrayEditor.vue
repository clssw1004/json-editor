<template>
  <div class="json-array-editor">
    <div class="array-header">
      <div class="header-left">
        <el-tag size="small" type="info">{{ modelValue.length }} {{ t('editor.items') }}</el-tag>
        <span class="array-type">{{ arrayTypeText }}</span>
      </div>
      <el-button 
        type="primary" 
        link
        size="small"
        @click="handleAdd"
      >
        <el-icon><Plus /></el-icon>{{ t('common.add') }}
      </el-button>
    </div>
    
    <div class="array-content">
      <div v-if="modelValue.length === 0" class="empty-tip">
        {{ t('messages.noDataAvailable') }}
      </div>
      
      <div v-else class="table-container">
        <simple-array-table
          v-if="isSimpleArray"
          :data="modelValue"
          @update="handleUpdate"
          @remove="handleRemove"
        />
        
        <object-array-table
          v-else
          :data="modelValue"
          @update="handleUpdate"
          @remove="handleRemove"
          @edit-complex="handleEditComplex"
        />
      </div>
    </div>

    <complex-editor-dialog
      v-if="dialogVisible"
      v-model:visible="dialogVisible"
      :title="dialogTitle"
      :value="currentEditValue"
      :path="dialogPath"
      @confirm="handleDialogConfirm"
    />
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import SimpleArrayTable from './tables/SimpleArrayTable.vue'
import ObjectArrayTable from './tables/ObjectArrayTable.vue'
import ComplexEditorDialog from './dialogs/ComplexEditorDialog.vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  },
  path: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogPath = ref([])
const currentEditValue = ref(null)
const currentEditIndex = ref(null)
const currentEditKey = ref(null)

// 判断是否为简单数组
const isSimpleArray = computed(() => {
  if (!props.modelValue.length) return true
  const firstItem = props.modelValue[0]
  return typeof firstItem !== 'object' || firstItem === null
})

// 获取数组类型描述
const arrayTypeText = computed(() => {
  if (!props.modelValue.length) return t('editor.emptyArray')
  const firstItem = props.modelValue[0]
  if (typeof firstItem !== 'object' || firstItem === null) {
    return t('editor.arrayType', { type: t(`types.${typeof firstItem}`) })
  }
  return t('editor.objectArray')
})

// 处理添加
const handleAdd = () => {
  const newValue = [...props.modelValue]
  if (isSimpleArray.value) {
    newValue.push('')
  } else {
    const template = getObjectTemplate(newValue)
    newValue.push(template)
  }
  emit('update:modelValue', newValue)
}

// 获取对象模板
const getObjectTemplate = (array) => {
  if (!array.length) return {}
  const template = array[0]
  const result = {}
  
  Object.keys(template).forEach(key => {
    const value = template[key]
    if (Array.isArray(value)) {
      result[key] = []
    } else if (typeof value === 'object' && value !== null) {
      result[key] = {}
    } else if (typeof value === 'number') {
      result[key] = 0
    } else if (typeof value === 'boolean') {
      result[key] = false
    } else {
      result[key] = ''
    }
  })
  
  return result
}

// 处理更新
const handleUpdate = (index, value) => {
  const newValue = [...props.modelValue]
  newValue[index] = value
  emit('update:modelValue', newValue)
}

// 处理删除
const handleRemove = (index) => {
  const newValue = [...props.modelValue]
  newValue.splice(index, 1)
  emit('update:modelValue', newValue)
}

// 处理复杂类型编辑
const handleEditComplex = (index, key, value) => {
  currentEditValue.value = value
  currentEditIndex.value = index
  currentEditKey.value = key
  dialogTitle.value = `${t('editor.edit')} ${key}`
  dialogPath.value = [...props.path, index, key]
  dialogVisible.value = true
}

// 处理对话框确认
const handleDialogConfirm = (value) => {
  if (currentEditIndex.value === null || currentEditKey.value === null) return
  
  const newValue = [...props.modelValue]
  newValue[currentEditIndex.value] = {
    ...newValue[currentEditIndex.value],
    [currentEditKey.value]: value
  }
  
  emit('update:modelValue', newValue)
  dialogVisible.value = false
  currentEditIndex.value = null
  currentEditKey.value = null
}

const { t } = useI18n()
</script>

<style scoped>
.json-array-editor {
  width: 100%;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-base);
  overflow: hidden;
}

.array-header {
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

.array-type {
  color: var(--text-secondary);
  font-size: 13px;
}

.array-content {
  padding: var(--spacing-base);
  width: 100%;
  overflow-x: auto;
}

.table-container {
  min-width: 100%;
  overflow-x: auto;
}

.empty-tip {
  text-align: center;
  color: var(--text-secondary);
  padding: var(--spacing-large);
  background-color: var(--bg-white);
}
</style> 