<template>
  <div class="sidebar">
    <ul>
      <li 
        v-for="item in menuItems" 
        :key="item.name" 
        :class="{ disabled: item.disabled }"
      >
        <input 
          type="checkbox" 
          :value="item.name" 
          v-model="selectedItems" 
          :disabled="item.disabled"
        />
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({})
const emit = defineEmits(['item-selected'])

const menuItems = [
  { name: '扬程评价', disabled: false },
  { name: '效率和轴功率评价', disabled: false },
  { name: '压力脉动评价', disabled: false },
  { name: '振动评价', disabled: false },
  { name: '噪声评价', disabled: false },
  { name: '综合评价', disabled: false }
]

const selectedItems = ref([])

watch(selectedItems, (newVal) => {
  emit('item-selected', newVal)
})
</script>

<style>
.sidebar {
  padding: 10px;
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
