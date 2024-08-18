<template>
  <div class="tabs">
    <div class="tab-buttons">
      <button 
        v-for="tab in selectedTabs" 
        :key="tab" 
        :class="{ active: selectedTab === tab }"
        @click="updateTab(tab)"
      >
        {{ tab }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  selectedTabs: {
    type: Array,
    required: true
  },
  selectedTab: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:selectedTab']);

const updateTab = (tab) => {
  emit('update:selectedTab', tab);
};

watch(props.selectedTabs, (newVal) => {
  console.log('selectedTabs changed:', newVal);
});

watch(props.selectedTab, (newVal) => {
  console.log('selectedTab changed in Tabs:', newVal);
});
</script>

<style>
.tabs {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.tab-buttons {
  display: flex;
  border-bottom: 1px solid #ddd;
  overflow-x: auto; /* 允许标签栏在内容超出时滚动 */
}

.tab-buttons button {
  padding: 10px 20px;
  border: none;
  background: none;
  cursor: pointer;
  color: #555;
  transition: background-color 0.3s ease, color 0.3s ease;
  font-size: 16px;
  margin-right: 10px; /* 增加按钮之间的间距 */
  border-radius: 4px 4px 0 0; /* 圆角边框 */
}

.tab-buttons button.active {
  border-bottom: 2px solid #007bff;
  color: #007bff;
  font-weight: bold;
  background-color: #f0f2f5; /* 为活动标签添加背景颜色 */
}

.tab-buttons button:hover {
  background-color: #f0f0f0;
  color: #333;
}

.tab-buttons button.active:hover {
  background-color: #e9ecef;
}
</style>
