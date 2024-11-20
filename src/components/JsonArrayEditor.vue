<template>
  <div class="json-array-editor">
    <div class="array-header flex justify-between items-center">
      <div class="flex items-center gap-small">
        <el-tag size="small" type="info">{{ modelValue.length }} 项</el-tag>
        <span class="text-secondary text-sm">{{ getArrayType }}</span>
      </div>
      <el-button 
        type="primary" 
        size="small"
        link
        @click="handleAdd"
      >
        <el-icon><Plus /></el-icon>添加
      </el-button>
    </div>
    
    <div class="array-content">
      <div class="table-wrapper">
        <div v-if="modelValue.length === 0" class="empty-tip">
          暂无数据
        </div>
        
        <div v-else class="table-content">
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
    </div>

    <div class="dialog-wrapper">
      <complex-editor-dialog
        v-show="dialogVisible"
        v-model:visible="dialogVisible"
        :title="dialogTitle"
        :value="currentEditValue"
        @confirm="handleDialogConfirm"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import SimpleArrayTable from './tables/SimpleArrayTable.vue'
import ObjectArrayTable from './tables/ObjectArrayTable.vue'
import ComplexEditorDialog from './dialogs/ComplexEditorDialog.vue'
import { isSimpleValue } from '../utils/typeUtils'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

// 判断是否为简单数组
const isSimpleArray = computed(() => {
  return props.modelValue.every(isSimpleValue)
})

// 弹窗相关状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const currentEditValue = ref(null)
const currentEditIndex = ref(-1)
const currentEditKey = ref('')

// 处理添加
const handleAdd = () => {
  const newValue = [...props.modelValue]
  // 根据数组类型添加不同的默认值
  if (isSimpleArray.value) {
    newValue.push('')  // 简单类型默认空字符串
  } else {
    // 获取对象结构模板
    const template = getObjectTemplate(newValue)
    newValue.push(template)
  }
  emit('update:modelValue', newValue)
}

// 获取对象模板
const getObjectTemplate = (array) => {
  // 如果数组为空，返回空对象
  if (array.length === 0) return {}
  
  // 使用第一个对象作为模板
  const template = array[0]
  if (!template) return {}
  
  // 如果是简单类型数组，直接返回空字符串
  if (typeof template !== 'object' || template === null) {
    return ''
  }
  
  const result = {}
  
  // 遍历所有属性，设置默认值
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
  const newValue = props.modelValue.filter((_, i) => i !== index)
  emit('update:modelValue', newValue)
}

// 处理复杂类型编辑
const handleEditComplex = (index, key, value) => {
  currentEditIndex.value = index
  currentEditKey.value = key
  currentEditValue.value = JSON.parse(JSON.stringify(value))
  dialogTitle.value = `编辑${Array.isArray(value) ? '数组' : '对象'}`
  dialogVisible.value = true
}

// 处理弹窗确认
const handleDialogConfirm = (value) => {
  if (currentEditIndex.value >= 0) {
    const newValue = [...props.modelValue]
    if (currentEditKey.value) {
      newValue[currentEditIndex.value] = {
        ...newValue[currentEditIndex.value],
        [currentEditKey.value]: value
      }
    } else {
      newValue[currentEditIndex.value] = value
    }
    emit('update:modelValue', newValue)
  }
  dialogVisible.value = false
}

// 获取数组类型描述
const getArrayType = computed(() => {
  if (props.modelValue.length === 0) return '空数组'
  return isSimpleArray.value ? '简单类型数组' : '对象数组'
})
</script>

<style scoped>
.json-array-editor {
  border: 1px solid var(--border-light);
  border-radius: var(--radius-base);
  overflow: hidden;
}

.array-header {
  padding: var(--spacing-small) var(--spacing-base);
  background-color: var(--bg-light);
  border-bottom: 1px solid var(--border-light);
}

.array-content {
  padding: var(--spacing-base);
}

.empty-tip {
  text-align: center;
  color: var(--text-secondary);
  padding: var(--spacing-large);
  background-color: var(--bg-white);
}
</style> 