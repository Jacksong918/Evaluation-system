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
const tabDetailsComponent = shallowRef(null)

// Watch for tabName changes and load the corresponding component
watch(() => props.tabName, async (newTabName) => {
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
      tabDetailsComponent.value = null
  }
})
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
}

.evaluation-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #f4f4f9;
  overflow-y: auto;
}

.full-height {
  height: 100%;
}
</style>
