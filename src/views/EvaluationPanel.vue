<template>
  <div class="evaluation-panel">
    <div class="evaluation-details" v-if="tabDetailsComponent !== null">
      <component :is="tabDetailsComponent" class="full-height"></component>
    </div>
  </div>
</template>

<script setup>
import { shallowRef, watch, defineAsyncComponent } from 'vue'
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

// Watch for tabName changes and load the corresponding component
watch(() => props.tabName, async (newTabName) => {
  selectedOption.value = 'GB3216'
  selectedLevel.value = ''
  customUpperLimit.value = ''
  customLowerLimit.value = ''
  result.value = null

  // Dynamically load the corresponding component based on tabName
  switch (newTabName) {
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
  justify-content: left;
  align-items: left;
  width: 100%;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f4f4f9;
  overflow-y: auto;
}


</style>
