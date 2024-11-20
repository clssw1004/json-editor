<template>
  <div class="value-editor">
    <complex-value-cell
      v-if="isComplexValue"
      :value="value"
      @edit="$emit('edit')"
    />
    
    <el-switch
      v-else-if="typeof value === 'boolean'"
      :model-value="value"
      @update:model-value="handleUpdate"
      size="small"
    />
    
    <el-input-number
      v-else-if="typeof value === 'number'"
      :model-value="value"
      @update:model-value="handleUpdate"
      size="small"
      controls-position="right"
    />
    
    <el-input
      v-else
      :model-value="value === undefined ? '' : String(value)"
      @update:model-value="handleUpdate"
      size="small"
    />
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'
import ComplexValueCell from '../cells/ComplexValueCell.vue'

const props = defineProps({
  value: {
    required: true
  }
})

const emit = defineEmits(['update:value', 'edit'])

const isComplexValue = computed(() => {
  return typeof props.value === 'object' && props.value !== null
})

const handleUpdate = (val) => {
  // 根据原始值类型进行转换
  let newValue = val
  if (typeof props.value === 'number') {
    newValue = Number(val)
  } else if (typeof props.value === 'boolean') {
    newValue = Boolean(val)
  }
  emit('update:value', newValue)
}
</script> 