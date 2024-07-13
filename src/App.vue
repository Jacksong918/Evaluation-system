<script setup>
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import EvaluationPanel from './views/EvaluationPanel.vue'

const selectedTabs = ref([])
const selectedTab = ref('')

function handleItemSelected(items) {
  selectedTabs.value = items
  if (!selectedTabs.value.includes(selectedTab.value)) {
    selectedTab.value = selectedTabs.value.length ? selectedTabs.value[0] : ''
  }
}


</script>

<template>

<div id="app">
    <div class="sidebar-container">
      <Sidebar @item-selected="handleItemSelected" />
    </div>
    <div class="content-container">
      <div class="selected-tags">
        <span 
          v-for="tab in selectedTabs" 
          :key="tab" 
          class="tag"
        >
          {{ tab }}
        </span>
      </div>
      <div class="evaluation-container">
        <div v-if="selectedTabs.length === 0" class="no-selection">
          请选择左侧的评价指标以查看详情。
        </div>
        <EvaluationPanel v-else :tabName="selectedTab" />
      </div>
    </div>
  </div>

  
</template>


<style>

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app {
  display: flex;
  height: 100vh;
  width: 100vw;
  font-family: Arial, sans-serif;
  background-color: #f4f4f9;
  overflow: hidden; /* 确保没有滚动条 */
}

.sidebar-container {
  width: 250px;
  border-right: 1px solid #ccc;
  background-color: #eaeaea;
}

.content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  /* padding: 10px; */
  background-color: #ffffff;
  overflow: auto; /* 确保内容可以滚动 */
}

.selected-tags {
  background-color: #f9f9f9;
  display: flex;
  flex-wrap: wrap;
}

.tag {
  background-color: #007bff;
  color: white;
  padding: 5px 10px;
  margin: 5px;
  border-radius: 3px;
  font-size: 14px;
  white-space: nowrap;
}

.evaluation-container {
  flex: 1;
  background-color: #f9f9f9;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.no-selection {
  font-size: 16px;
  color: #666;
  text-align: center;
}


</style>


