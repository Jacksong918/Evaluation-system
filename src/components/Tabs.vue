<template>
  <div class="tabs">
    <div class="tab-buttons">
      <button 
        v-for="tab in selectedTabs" 
        :key="tab" 
        :class="{ active: selectedTab === tab }"
        @click="$emit('update:selectedTab', tab)"
      >
        {{ tab }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  selectedTabs: {
    type: Array,
    required: true
  },
  selectedTab: {
    type: String,
    required: true
  }
})
</script>

<style>
.tabs {
  display: flex;
  flex-direction: column;
}

.tab-buttons {
  display: flex;
  border-bottom: 1px solid #ccc;
}

.tab-buttons button {
  padding: 10px 20px;
  border: none;
  background: none;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  font-size: 16px;
}

.tab-buttons button.active {
  border-bottom: 2px solid #007bff;
  color: #007bff;
  font-weight: bold;
}

.tab-buttons button:hover {
  background-color: #f0f0f0;
}

.tab-buttons button.active:hover {
  background-color: transparent;
}
</style>
