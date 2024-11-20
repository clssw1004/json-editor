<template>
  <el-config-provider :locale="localeValue">
    <div class="app-container">
      <json-view />
    </div>
  </el-config-provider>
</template>

<script setup>
import JsonView from './views/JsonView.vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from "element-plus/dist/locale/en.mjs";
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const lang = {
  zh: zhCn,
  en,
};
const localeValue = lang[locale.value] || 'em';
</script>

<style>
.app-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 可以添加一些全局样式 */
body {
  margin: 0;
  padding: 0;
}
</style>
