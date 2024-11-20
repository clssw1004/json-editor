<template>
  <div class="complex-editor-dialog">
    <el-dialog
      v-show="visible"
      :model-value="visible"
      @update:model-value="emit('update:visible', $event)"
      :title="dialogTitle"
      width="50%"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      align-center
    >
      <div class="path-display">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>{{ t('editor.root') }}</el-breadcrumb-item>
          <el-breadcrumb-item 
            v-for="(item, index) in path" 
            :key="index"
          >
            {{ item }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="dialog-content">
        <div class="editor-wrapper">
          <div v-if="Array.isArray(value)" class="array-editor">
            <json-array-editor
              v-model="localValue"
              @update:model-value="handleUpdate"
              :path="path"
            />
          </div>
          <div v-else class="object-editor">
            <json-editor
              v-model="localValue"
              @update:model-value="handleUpdate"
              :path="path"
            />
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="handleCancel">取消</el-button>
          <el-button size="small" type="primary" @click="handleConfirm">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch, computed, defineProps, defineEmits } from 'vue'
import JsonEditor from '../JsonEditor.vue'
import JsonArrayEditor from '../JsonArrayEditor.vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  visible: Boolean,
  title: String,
  value: [Array, Object],
  path: {
    type: Array,
    default: () => []
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

const dialogTitle = computed(() => {
  const pathStr = props.path.length > 0 ? ` (${props.path.join('.')})` : ''
  return `${props.title}${pathStr}`
})

const { t } = useI18n()
</script>

<style scoped>
.path-display {
  margin-bottom: var(--spacing-base);
  padding: var(--spacing-small);
  background-color: var(--el-fill-color-lighter);
  border-radius: var(--radius-base);
}

.dialog-content {
  max-height: 60vh;
  overflow-y: auto;
  padding: var(--spacing-base) 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-small);
}

:deep(.el-dialog) {
  --el-dialog-padding-primary: var(--spacing-large);
  border-radius: var(--radius-large);
}

:deep(.el-dialog__header) {
  margin-right: 0;
  padding: var(--spacing-base) var(--spacing-large);
  border-bottom: 1px solid var(--border-light);
  font-weight: 600;
}

:deep(.el-dialog__body) {
  padding: var(--spacing-base) var(--spacing-large);
}

:deep(.el-dialog__footer) {
  padding: var(--spacing-base) var(--spacing-large);
  border-top: 1px solid var(--border-light);
}

:deep(.el-breadcrumb__item) {
  font-size: 13px;
}
</style> 