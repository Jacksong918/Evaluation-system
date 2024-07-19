<template>
  <div id="app">
    <SideBar @item-selected="updateSelectedTabs" />
    <div class="content">
      <Tabs :selectedTabs="tabs" :selectedTab="selectedTab" @update:selectedTab="updateSelectedTab" />
      <EvaluationPanel :tabName="selectedTab" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SideBar from './components/Sidebar.vue'
import Tabs from './components/Tabs.vue'
import EvaluationPanel from './views/EvaluationPanel.vue'

const tabs = ref([])  // Initially empty
const selectedTab = ref('')

// Function to update the list of selected tabs
const updateSelectedTabs = (selectedItems) => {
  // Update tabs list
  tabs.value = selectedItems

  // Set the selected tab to the newest item if there's any change
  if (selectedItems.length > 0) {
    const newTab = selectedItems[selectedItems.length - 1]
    if (selectedTab.value !== newTab) {
      selectedTab.value = newTab
    }
  } else {
    selectedTab.value = ''
  }
}

// Function to update the selected tab
const updateSelectedTab = (tab) => {
  selectedTab.value = tab
}
</script>

<style>
#app {
  display: flex;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
