<template>
    <div class="evaluation-details" v-if="tabDetailsComponent !== null">
      <component :is="tabDetailsComponent" class="full-height"></component>
    </div>
</template>

<script setup>
import { shallowRef, watch, defineAsyncComponent, onMounted } from 'vue'
import { defineProps } from 'vue'

// Define props
const props = defineProps({
  tabName: {
    type: String,
    required: true
  }
})

// State variables
const selectedOption = shallowRef('GB3216')
const selectedLevel = shallowRef('')
const gb3216Levels = ['1U', '1E', '1B', '2B', '2U', '3B']
const customUpperLimit = shallowRef('')
const customLowerLimit = shallowRef('')
const result = shallowRef(null)
const tabDetailsComponent = shallowRef(null)

// Function to check value
function checkValue() {
  const cfdValue = 50 // 示例值
  if (selectedOption.value === 'GB3216') {
    result.value = `${cfdValue} 是在 GB3216 标准的范围内`
  } else if (selectedOption.value === '自定义') {
    if (cfdValue >= customLowerLimit.value && cfdValue <= customUpperLimit.value) {
      result.value = `${cfdValue} 是在自定义范围内`
    } else {
      result.value = `${cfdValue} 不在自定义范围内`
    }
  }
}

// Function to load component based on tabName
function loadComponent(tabName) {
  switch (tabName) {
    case '扬程评价':
      tabDetailsComponent.value = defineAsyncComponent(() => import('./YangCheng_Evaluation.vue'))
      break
    case '效率和轴功率评价':
      tabDetailsComponent.value = defineAsyncComponent(() => import('./XiaoLv_Evaluation.vue'))
      break
    case '压力脉动评价':
      tabDetailsComponent.value = defineAsyncComponent(() => import('./YaLi_Evaluation.vue'))
      break
    case '振动评价':
      tabDetailsComponent.value = defineAsyncComponent(() => import('./ZhenDong_Evaluation.vue'))
      break
    case '噪声评价':
      tabDetailsComponent.value = defineAsyncComponent(() => import('./ZaoSheng_Evaluation.vue'))
      break
    case '综合评价':
      tabDetailsComponent.value = defineAsyncComponent(() => import('./ZongHe_Evaluation.vue'))
      break
    default:
      tabDetailsComponent.value = defineAsyncComponent(() => import('./YangCheng_Evaluation.vue'))
  }
}

// Watch for tabName changes and load the corresponding component
watch(() => props.tabName, (newTabName) => {
  selectedOption.value = 'GB3216'
  selectedLevel.value = ''
  customUpperLimit.value = ''
  customLowerLimit.value = ''
  result.value = null
  loadComponent(newTabName)
})

// Initial component load
onMounted(() => {
  if (props.tabName) {
    loadComponent(props.tabName)
  }
})
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
}

.evaluation-panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f4f4f9;
  overflow-y: auto;
}

.evaluation-options {
  display: flex;
  margin-bottom: 20px;
}

.evaluation-content {
  margin-bottom: 20px;
}

.selectbox {
  width: 200px;
}

.checkValue {
  margin-top: 20px;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
}

.input-group {
  margin-bottom: 10px;
}

select, input[type="number"], button {
  display: block;
  margin-top: 10px;
  padding: 10px;
  font-size: 16px;
}

.custom-input {
  width: 130px;
}

button {
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.result_msg {
  margin-top: 20px;
}

.evaluation-details {
  display: flex;
  width: 100%;
  height: 100%;
}

.full-height {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Align items to the start horizontally */
  justify-content: flex-start; /* Align items to the start vertically */
  overflow-y: auto;
  padding: 20px; /* Optional: padding to add space around the content */
}

button:hover {
  background-color: #0056b3;
}
</style>
