<template>
  <div class="table-wrapper">
    <el-table 
      :data="tableData" 
      size="small"
      border
      style="width: 100%"
      :fit="false"
    >
      <el-table-column 
        type="index" 
        label="#" 
        width="50" 
        align="center"
        fixed="left"
      />
      <el-table-column 
        v-for="col in tableColumns" 
        :key="col"
        :prop="col"
        :label="col"
        :min-width="getColumnWidth(col)"
        show-overflow-tooltip
      >
        <template #default="scope">
          <value-editor
            :value="scope.row[col]"
            @update:value="(val) => handleUpdate(scope.$index, col, val)"
            @edit="() => handleEdit(scope.$index, col, scope.row[col])"
          />
        </template>
      </el-table-column>
      <el-table-column 
        label="操作" 
        width="80" 
        align="center"
        fixed="right"
      >
        <template #default="scope">
          <el-button 
            type="danger" 
            link 
            size="small" 
            @click="handleRemove(scope.$index)"
          >
            <el-icon><Delete /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import {computed, defineProps, defineEmits } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import ValueEditor from '../editors/ValueEditor.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update', 'remove', 'edit-complex'])

const tableData = computed(() => props.data)


// 表格列配置
const tableColumns = computed(() => {
  if (!props.data.length) return []
  const firstRow = props.data[0]
  return Object.keys(firstRow || {})
})

const getColumnWidth = (col) => {
  if (!props.data.length) return 150
  const value = props.data[0][col]
  
  if (typeof value === 'boolean') return 80
  if (typeof value === 'number') return 100
  if (Array.isArray(value)) return 150
  if (typeof value === 'object' && value !== null) return 150
  
  return 150
}

const handleUpdate = (index, key, value) => {
  const newRow = { ...props.data[index], [key]: value }
  emit('update', index, newRow)
}

const handleRemove = (index) => {
  emit('remove', index)
}

const handleEdit = (index, key, value) => {
  emit('edit-complex', index, key, value)
}
</script>

<style scoped>
.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

:deep(.el-table) {
  width: auto !important;
  min-width: 100%;
}

:deep(.el-table__header th) {
  font-weight: 600;
  background-color: var(--el-fill-color-light);
  white-space: nowrap;
}

:deep(.el-table__body td) {
  white-space: nowrap;
}

:deep(.el-table__header .cell) {
  font-weight: 600;
}

:deep(.el-table-column--selection .cell) {
  padding: 0 14px;
}

:deep(.el-button) {
  padding: 2px 0;
}

:deep(.el-input), :deep(.el-input-number) {
  width: auto;
  min-width: 120px;
}
</style> 