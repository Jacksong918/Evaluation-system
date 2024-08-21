<template>
  <div id="app">
    <SideBar @item-selected="updateSelectedTabs" />
    <div class="content">
      <Tabs :selectedTabs="tabs" :selectedTab="selectedTab" @update:selectedTab="updateSelectedTab" />
      <div v-if="selectedTab === ''" class="placeholder">暂未选择评价模块</div>
      <EvaluationPanel v-else :tabName="selectedTab" :filePath1="filePath1" :filePath2="filePath2" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SideBar from './components/Sidebar.vue'
import Tabs from './components/Tabs.vue'
import EvaluationPanel from './views/EvaluationPanel.vue'

// 定义
const tabs = ref([])
const selectedTab = ref('')
const filePath1 = ref('')
const filePath2 = ref('')
const { ipcRenderer } = require('electron');

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
  // 从 URL 参数中获取文件路径1和文件路径2
  const urlParams = new URLSearchParams(window.location.search);
  const filepath1FromUrl = urlParams.get('filepath1');
  const filepath2FromUrl = urlParams.get('filepath2');
  console.log('File path 1 from URL:', filepath1FromUrl);
  console.log('File path 2 from URL:', filepath2FromUrl);
  filePath1.value = filepath1FromUrl;
  filePath2.value = filepath2FromUrl;

   // 监听主进程传来的文件路径
  ipcRenderer.on('file-paths', (event, { filePath1: path1, filePath2: path2 }) => {
    console.log('Received file path 1 from main process:', path1);
    console.log('Received file path 2 from main process:', path2);
    // 将文件路径更新到 Vue 的响应式变量中
    filePath1.value = path1 || filePath1.value;
    filePath2.value = path2 || filePath2.value;
  });
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
