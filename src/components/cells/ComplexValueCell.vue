<template>
  <div class="complex-value-cell">
    <el-button 
      type="primary" 
      link
      size="small"
      @click="handleEdit"
    >
      <span class="value-type">{{ valueType }}</span>
      <span class="value-count">{{ valueCount }}</span>
    </el-button>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'


const props = defineProps({
  value: {
    type: [Array, Object],
    required: true
  }
})

const emit = defineEmits(['edit'])

const valueType = computed(() => {
  return Array.isArray(props.value) ? `${t('types.array')}` : `${t('types.object')}`
})

const valueCount = computed(() => {
  if (Array.isArray(props.value)) {
    return `(${props.value.length}项)`
  }
  return `(${Object.keys(props.value).length}个属性)`
})

const handleEdit = () => {
  emit('edit')
}
const { t } = useI18n()
</script>

<style scoped>
.complex-value-cell {
  display: flex;
  align-items: center;
  gap: var(--spacing-small);
}

.value-type {
  font-weight: 500;
}

.value-count {
  color: var(--text-secondary);
  margin-left: 4px;
}
</style> 