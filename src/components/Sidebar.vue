<template>
  <div class="sidebar">
    <ul>
      <li 
        v-for="item in menuItems" 
        :key="item.name" 
        :class="{ disabled: item.disabled || !item.canSelect }"
      >
        <input 
          type="checkbox" 
          :value="item.name" 
          v-model="selectedItems" 
          :disabled="item.disabled || !item.canSelect"
        />
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { defineEmits } from 'vue'

const emit = defineEmits(['item-selected'])

// Example condition: a module can be selected only if canSelect is true
const menuItems = [
  { name: '扬程评价', disabled: false, canSelect: true },
  { name: '效率和轴功率评价', disabled: false, canSelect: true }, // Example of a condition
  { name: '压力脉动评价', disabled: false, canSelect: true },
  { name: '振动评价', disabled: false, canSelect: true },
  { name: '噪声评价', disabled: false, canSelect: true }, // Example of a condition
  { name: '综合评价', disabled: false, canSelect: true }
]

const selectedItems = ref([])

watch(selectedItems, (newVal) => {
  emit('item-selected', newVal)
})
</script>

<style>
.sidebar {
  padding: 10px;
  width: 200px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 10px 0;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.sidebar li.disabled {
  color: #ccc;
}

.sidebar li input[type="checkbox"] {
  margin-right: 10px;
}
</style>
