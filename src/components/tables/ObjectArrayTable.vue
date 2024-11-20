<template>
  <div class="table-reset input-reset">
    <el-table 
      :data="data" 
      size="small"
      border
      style="width: 100%"
    >
      <el-table-column 
        type="index" 
        label="#" 
        width="50" 
        align="center"
        fixed="left"
      />
      <el-table-column 
        v-for="col in columns" 
        :key="col"
        :prop="col"
        :label="col"
        :min-width="getColumnWidth(col)"
      >
        <template #header="{ column }">
          <div class="column-header">
            {{ column.label }}
            <el-tooltip 
              v-if="getColumnType(col) === 'complex'"
              content="点击单元格编辑详细内容"
              placement="top"
            >
              <el-icon class="info-icon"><InfoFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        
        <template #default="{ row, $index }">
          <value-editor
            :value="row[col]"
            @update:value="handleUpdate($index, col, $event)"
            @edit="handleEdit($index, col, row[col])"
          />
        </template>
      </el-table-column>
      <el-table-column 
        label="操作" 
        width="80" 
        align="center"
        fixed="right"
      >
        <template #default="{ $index }">
          <el-button 
            type="danger" 
            link 
            size="small" 
            @click="emit('remove', $index)"
          >
            <el-icon><Delete /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'
import { Delete, InfoFilled } from '@element-plus/icons-vue'
import ValueEditor from '../editors/ValueEditor.vue'
import { isComplexValue } from '../../utils/typeUtils'

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update', 'remove', 'edit-complex'])

const columns = computed(() => {
  const cols = new Set()
  props.data.forEach(item => {
    if (typeof item === 'object' && item !== null) {
      Object.keys(item).forEach(key => cols.add(key))
    }
  })
  return Array.from(cols)
})

// 获取列的类型
const getColumnType = (col) => {
  const firstRow = props.data[0]
  if (!firstRow) return 'simple'
  const value = firstRow[col]
  if (isComplexValue(value)) return 'complex'
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'number'
  return 'string'
}

// 获取列宽度
const getColumnWidth = (col) => {
  const type = getColumnType(col)
  switch (type) {
    case 'boolean':
      return 80
    case 'number':
      return 100
    case 'complex':
      return 120
    default:
      return 150
  }
}

const handleUpdate = (index, key, value) => {
  const newRow = { ...props.data[index], [key]: value }
  emit('update', index, newRow)
}

const handleEdit = (index, key, value) => {
  emit('edit-complex', index, key, value)
}
</script>

<style scoped>
.column-header {
  display: flex;
  align-items: center;
  gap: 4px;
}

.info-icon {
  font-size: 14px;
  color: var(--el-color-info);
}
</style> 