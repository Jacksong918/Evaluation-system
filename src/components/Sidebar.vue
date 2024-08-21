<template>
  <div class="sidebar">
    <h2>评价模块</h2>
    <ul>
      <li 
        v-for="item in menuItems" 
        :key="item.name" 
        :class="{ disabled: item.disabled || !item.canSelect }"
      >
        <label>
          <input 
            type="checkbox" 
            :value="item.name" 
            v-model="selectedItems" 
            :disabled="item.disabled || !item.canSelect"
          />
          <span :class="{ checked: selectedItems.includes(item.name) }">{{ item.name }}</span>
        </label>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch, defineEmits } from 'vue';

const emit = defineEmits(['item-selected']);

const menuItems = [
  { name: '扬程评价', disabled: false, canSelect: true },
  { name: '效率和轴功率评价', disabled: false, canSelect: true },
  { name: '压力脉动评价', disabled: false, canSelect: false },
  { name: '振动评价', disabled: false, canSelect: true },
  { name: '噪声评价', disabled: false, canSelect: false },
  { name: '综合评价', disabled: false, canSelect: false }
];

const selectedItems = ref([]);

watch(selectedItems, (newVal) => {
  emit('item-selected', newVal);
}, { immediate: true });
</script>

<style>
.sidebar {
  width: 220px;
  padding: 20px;
  background-color: #f0f2f5;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sidebar h2 {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  color: #555;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  width: 100%;
}

.sidebar li {
  padding: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
}

.sidebar li:hover {
  background-color: #e0e0e0;
}

.sidebar li.disabled {
  color: #ccc;
  cursor: not-allowed;
}

.sidebar li label {
  display: flex;
  align-items: center;
  width: 100%;
}

.sidebar li input[type="checkbox"] {
  margin-right: 10px;
  transform: scale(1.2);
}

.sidebar li span.checked {
  font-weight: bold;
  color: #007bff;
}
</style>
