<template>
  <div class="table-reset input-reset">
    <el-table 
      :data="tableData" 
      size="small"
      border
    >
      <el-table-column type="index" label="#" width="50" align="center" />
      <el-table-column label="值" min-width="120">
        <template #default="{ row }">
          <value-editor
            :value="data[row.index]"
            @update:value="handleUpdate(row.index, $event)"
            @edit="$emit('edit', row.index)"
          />
        </template>
      </el-table-column>
      <el-table-column width="50" align="center">
        <template #default="{ row }">
          <el-button 
            type="danger" 
            link 
            size="small" 
            @click="emit('remove', row.index)"
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
import ValueEditor from '../editors/ValueEditor.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update', 'remove', 'edit'])

const tableData = computed(() => {
  return props.data.map((value, index) => ({ value, index }))
})

const handleUpdate = (index, value) => {
  emit('update', index, value)
}
</script> 