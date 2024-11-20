<template>
    <div class="json-uploader">
        <div class="upload-area">
            <!-- 文件上传区域 -->
            <el-upload class="json-upload" action="" :auto-upload="false" :show-file-list="false" accept=".json"
                :on-change="handleFileChange">
                <template #trigger>
                    <el-button type="primary">选择 JSON 文件</el-button>
                </template>
            </el-upload>

            <!-- 预览控制按钮 -->
            <el-button v-if="jsonContent" type="info" :icon="isPreviewVisible ? 'CaretTop' : 'CaretBottom'"
                @click="togglePreview">
                {{ isPreviewVisible ? '收起预览' : '展开预览' }}
            </el-button>
        </div>

        <!-- 错误提示 -->
        <el-alert v-if="errorMessage" :title="errorMessage" type="error" show-icon class="error-message" />

        <!-- 显示 JSON 内容 -->
        <div v-if="jsonContent && isPreviewVisible" class="json-content">
            <el-collapse-transition>
                <div class="preview-content">
                    <pre>{{ JSON.stringify(jsonContent, null, 2) }}</pre>
                </div>
            </el-collapse-transition>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
    showPreview: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:jsonData', 'update:showPreview'])

const jsonContent = ref(null)
const errorMessage = ref('')
const isPreviewVisible = computed({
    get: () => props.showPreview,
    set: (value) => emit('update:showPreview', value)
})

// 切换预览显示状态
const togglePreview = () => {
    isPreviewVisible.value = !isPreviewVisible.value
}

const handleFileChange = (file) => {
    const reader = new FileReader()

    reader.onload = (e) => {
        try {
            // 解析 JSON 内容
            const content = JSON.parse(e.target.result)
            jsonContent.value = content
            errorMessage.value = ''

            // 向父组件发送解析后的数据
            emit('update:jsonData', content)
        } catch (error) {
            errorMessage.value = '无效的 JSON 文件格式'
            jsonContent.value = null
            emit('update:jsonData', null)
        }
    }

    reader.onerror = () => {
        errorMessage.value = '文件读取失败'
        jsonContent.value = null
        emit('update:jsonData', null)
    }

    // 开始读取文件
    reader.readAsText(file.raw)
}
</script>

<style scoped>
.json-uploader {
    padding: 20px;
}

.upload-area {
    display: flex;
    gap: 10px;
    align-items: center;
}

.json-content {
    margin-top: 20px;
    overflow: hidden;
}

.preview-content {
    padding: 15px;
    background-color: #f5f7fa;
    border-radius: 4px;
    border: 1px solid #e4e7ed;
}

.error-message {
    margin-top: 10px;
}

pre {
    margin: 0;
    white-space: pre-wrap;
    word-wrap: break-word;
}

/* 添加过渡动画 */
.el-collapse-transition {
    transition: 0.3s height ease-in-out, 0.3s padding-top ease-in-out, 0.3s padding-bottom ease-in-out;
}
</style>