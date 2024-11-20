<template>
  <div class="table-wrapper">
    <el-table 
      :data="tableData" 
      size="small"
      border
      :fit="true"
    >
      <el-table-column 
        type="index" 
        label="#" 
        width="50" 
        align="center"
      />
      
      <el-table-column 
        v-for="col in tableColumns" 
        :key="col"
        :prop="col"
        :label="col"
        :min-width="120"
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
        :label="t('common.operation')"
        width="80" 
        align="center"
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
import { computed, defineProps, defineEmits } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import ValueEditor from '../editors/ValueEditor.vue'

const { t } = useI18n()

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