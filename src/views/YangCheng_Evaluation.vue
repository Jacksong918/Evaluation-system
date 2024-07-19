<template>
    <div class="evaluation-panel">
      <div class="evaluation-options" style="display: flex;">
        <label>
          <input type="radio" value="GB3216" v-model="selectedOption" /> GB3216
        </label>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <label>
          <input type="radio" value="自定义" v-model="selectedOption" /> 自定义
        </label>
      </div>
  
      <div v-if="selectedOption === 'GB3216'" class="evaluation-content">
        <label>选择等级</label>
        <select v-model="selectedLevel" class="selectbox">
          <option v-for="level in gb3216Levels" :key="level" :value="level">{{ level }}</option>
        </select>
      </div>
  
      <div v-if="selectedOption === '自定义'" class="evaluation-content">
        <div class="input-group">
          <label>下限:
            <input class="custom-input"  type="number" v-model="customLowerLimit" />
          </label>
        </div>
        <div class="input-group">
          <label>上限:
            <input class="custom-input" type="number" v-model="customUpperLimit" />
          </label>
        </div>
      </div>
  
      <button class="checkValue"  @click="checkValue">检查CFD计算值(扬程评价)</button>
      <div class="result_msg" v-if="result !== null">{{ result }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { defineProps } from 'vue'
  
  const props = defineProps({
    tabName: {
      type: String,
      required: true
    }
  })
  
  const selectedOption = ref('GB3216')
  const selectedLevel = ref('')
  const gb3216Levels = ['1U', '1E', '1B', '2B', '2U', '3B']
  const customUpperLimit = ref('')
  const customLowerLimit = ref('')
  const result = ref(null)
  
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
  </script>
  
  <style>
  .evaluation-panel {
    flex: 1;
    padding: 10px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .evaluation-options {
    margin-left: 20px;
    margin-bottom: 20px;
  }
  
  .evaluation-content {
    margin-left: 20px;
    margin-top: 10px;
    align-items: center;
  }
  
  .selectbox {
    width: 200px;
  }
  
  .checkValue {
    margin-left: 20px;
    margin-top: 50px;
  }
  
  label {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
  }
  
  .input-group {
    margin-bottom: 10px;
    width: 200px;
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
    margin-left: 20px;
  }
  button:hover {
    background-color: #0056b3;
  }
  </style>