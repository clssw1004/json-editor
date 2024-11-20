<template>
  <div class="complex-editor-dialog">
    <el-dialog
      v-show="visible"
      :model-value="visible"
      @update:model-value="emit('update:visible', $event)"
      :title="title"
      width="50%"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      align-center
    >
      <div class="dialog-content">
        <div class="editor-wrapper">
          <div v-if="Array.isArray(value)" class="array-editor">
            <json-array-editor
              v-model="localValue"
              @update:model-value="handleUpdate"
            />
          </div>
          <div v-else class="object-editor">
            <json-editor
              v-model="localValue"
              @update:model-value="handleUpdate"
            />
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer flex justify-between gap-small">
          <el-button size="small" @click="handleCancel">取消</el-button>
          <el-button size="small" type="primary" @click="handleConfirm">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import JsonEditor from '../JsonEditor.vue'
import JsonArrayEditor from '../JsonArrayEditor.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '编辑'
  },
  value: {
    type: [Array, Object],
    default: null
  }
})

const emit = defineEmits(['update:visible', 'confirm'])

const localValue = ref(null)

watch(() => props.value, (newVal) => {
  if (newVal !== null) {
    localValue.value = JSON.parse(JSON.stringify(newVal))
  }
}, { immediate: true })

const handleUpdate = (value) => {
  localValue.value = value
}

const handleCancel = () => {
  emit('update:visible', false)
}

const handleConfirm = () => {
  emit('confirm', localValue.value)
  emit('update:visible', false)
}
</script>

<style scoped>
.dialog-content {
  max-height: 60vh;
  overflow-y: auto;
  padding: var(--spacing-base) 0;
}

:deep(.el-dialog) {
  --el-dialog-padding-primary: var(--spacing-large);
  border-radius: var(--radius-large);
}

:deep(.el-dialog__header) {
  margin-right: 0;
  padding: var(--spacing-base) var(--spacing-large);
  border-bottom: 1px solid var(--border-light);
}

:deep(.el-dialog__body) {
  padding: var(--spacing-base) var(--spacing-large);
}

:deep(.el-dialog__footer) {
  padding: var(--spacing-base) var(--spacing-large);
  border-top: 1px solid var(--border-light);
}
</style> 