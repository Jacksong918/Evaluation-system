<template>
  <div id="app">
    <SideBar @item-selected="updateSelectedTabs" />
    <div class="content">
      <Tabs :selectedTabs="tabs" :selectedTab="selectedTab" @update:selectedTab="updateSelectedTab" />
      <div v-if="selectedTab === ''" class="placeholder">暂未选择评价模块</div>
      <EvaluationPanel v-else :tabName="selectedTab" :filePath="filePath" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SideBar from './components/Sidebar.vue'
import Tabs from './components/Tabs.vue'
import EvaluationPanel from './views/EvaluationPanel.vue'

// 初始化选项卡和选中的选项卡
const tabs = ref([])
const selectedTab = ref('')
const filePath = ref('')
// 动态引入 ipcRenderer
let ipcRenderer
if (window.require) {
  ipcRenderer = window.require('electron').ipcRenderer
}

// 更新选项卡
const updateSelectedTabs = (selectedItems) => {
  tabs.value = selectedItems

  // 如果有任何变化，将选定的选项卡设置为最新的项目
  if (selectedItems.length > 0) {
    const newTab = selectedItems[selectedItems.length - 1]
    if (selectedTab.value !== newTab) {
      selectedTab.value = newTab
    }
  } else {
    selectedTab.value = ''
  }
}

// 更新选择的标签
const updateSelectedTab = (tab) => {
  selectedTab.value = tab
}

// 监听文件路径参数
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const filepath = urlParams.get('filepath')
  console.log('File path from URL:', filepath)
  filePath.value = filepath

  if (ipcRenderer) {
    ipcRenderer.on('file-path', (event, path) => {
      console.log('Received file path from main process:', path)
      filePath.value = path
    })
  }
})
</script>

<style>
#app {
  display: flex;
  height: 100vh; /* 覆盖整个视口 */
  background-color: #f0f2f5; /* 浅灰色背景 */
}

.sidebar {
  width: 220px;
  background-color: #f0f2f5;
  padding: 20px;
  border-right: 1px solid #ddd;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #ffffff; /* 白色背景 */
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 20px;
  position: relative;
  overflow: auto;
}

.tabs {
  display: flex;
  margin-bottom: 20px;
}

.placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 24px;
  color: #888;
}
</style>
