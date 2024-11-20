<template>
  <div class="app-container">
    <json-view />
  </div>
</template>

<script setup>
import JsonView from './views/JsonView.vue'
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
