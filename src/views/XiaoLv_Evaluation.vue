<template>
  <div class="evaluation-panel">
    <div class="evaluation-options">
      <p>评价规则选择：</p>
      <label>
        <input type="radio" value="GB3216" v-model="selectedOption" /> GB3216
      </label>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <label>
        <input type="radio" value="自定义" v-model="selectedOption" /> 自定义
      </label>
    </div>

    <div v-if="selectedOption === 'GB3216'" class="evaluation-content">
      <label>选择等级：</label>
      <select v-model="selectedLevel" class="selectbox">
        <option v-for="level in gb3216Levels" :key="level" :value="level">{{ level }}</option>
      </select>
    </div>

    <div v-if="selectedOption === '自定义'" class="evaluation-content">
      <div class="input-group-horizontal">
        <label>下限 (效率)：
          <input class="custom-input" type="number" v-model="customEfficiencyLowerLimit" />
        </label>
      </div>
      <div class="input-group-horizontal">
        <label>上限 (轴功率)：
          <input class="custom-input" type="number" v-model="customPowerUpperLimit" />
        </label>
      </div>
    </div>

    <button class="checkValue" @click="checkValue">效率和轴功率评价</button>
    <div class="result_msg" v-if="result !== null">{{ result }}</div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, defineProps } from 'vue';
const { ipcRenderer } = require('electron'); // 确保在 Electron 环境中运行

// 定义props
const props = defineProps({
  tabName: {
    type: String,
    required: true
  },
  filePath1: {
    type: String,
    required: false
  }
});

// 定义
const selectedOption = ref('GB3216');
const selectedLevel = ref('');
const gb3216Levels = ['1U', '1E', '1B', '2B', '2U', '3B'];
const customEfficiencyUpperLimit = ref('');
const customEfficiencyLowerLimit = ref('');
const customPowerUpperLimit = ref('');
const customPowerLowerLimit = ref('');
const result = ref(null);
const fileContent = ref(null); // 确保 fileContent 初始值为 null
const efficiency = ref('');
const power = ref('');
const outputEfficiency = ref('');
const outputPower = ref('');

// 定义 GB3216 评价规则
const gb3216Rules = {
  '1U': { efficiency: 1.00, power: 1.10 },
  '1E': { efficiency: 1.00, power: 1.04 },
  '1B': { efficiency: 0.97, power: 1.04 },
  '2B': { efficiency: 0.95, power: 1.08 },
  '2U': { efficiency: 0.95, power: 1.16 },
  '3B': { efficiency: 0.93, power: 1.09 },
};

// 打印 filePath 到控制台并读取文件内容
watch(() => props.filePath1, (newFilePath1) => {
  console.log('Received file path:', newFilePath1);
  readFile(newFilePath1);
});

// 监听选项、等级、输入框的变化
watch([() => selectedOption.value, () => selectedLevel.value, 
() => customEfficiencyUpperLimit.value, () => customEfficiencyLowerLimit.value,
 () => customPowerUpperLimit.value, () => customPowerLowerLimit.value], () => {
  result.value = null; // 清空结果
}, { immediate: false });

onMounted(() => {
  if (props.filePath1) {
    readFile(props.filePath1);
  }
});

// 读取文件并更新 CFD 值和新增的状态变量
const readFile = async (filePath) => {
  if (filePath) {
    console.log('filepath:', filePath);
    try {
      const data = await ipcRenderer.invoke('read-file', filePath);
      const fileData = JSON.parse(data);
      console.log('output:', fileData); // 确保控制台输出解析后的 JSON 数据
      if (fileData.Input) {
        efficiency.value = fileData.Input.Efficiency;
        power.value = fileData.Input.ShaftPower;
      }
      if (fileData.Output) {
        outputEfficiency.value = fileData.Output.Efficiency;
        outputPower.value = fileData.Output.ShaftPower;
      }
      fileContent.value = fileData; // 更新为解析后的对象
    } catch (err) {
      console.error('Error reading file:', err);
    }
  }
};

function checkValue() {
  const newEfficiency = parseFloat(outputEfficiency.value);
  const newPower = parseFloat(outputPower.value);

  if (selectedOption.value === 'GB3216') {
    const rule = gb3216Rules[selectedLevel.value];
    if (rule) {
      const efficiency0 = efficiency.value; // 文件中读取的效率 η0
      const powerP0 = power.value; // 文件中读取的轴功率 P0
      const efficiencyCheck = newEfficiency >= efficiency0 * rule.efficiency;
      const powerCheck = newPower < powerP0 * rule.power;

      if (efficiencyCheck && powerCheck) {
        result.value = '满足GB3216标准';
      } else {
        result.value = '不满足GB3216标准\n';
        if (!efficiencyCheck) {
          result.value += '效率不满足标准\n';
        }
        if (!powerCheck) {
          result.value += '轴功率不满足标准';
        }
      }
    } else {
      result.value = '未选择规则';
    }
  } else if (selectedOption.value === '自定义') {
    if (customEfficiencyLowerLimit.value === '' && customPowerUpperLimit.value === '') {
      result.value = '请输入效率下限和轴功率上限';
      return;
    }
    if (customEfficiencyLowerLimit.value === '') {
      result.value = '请输入效率下限';
      return;
    }
    if (customPowerUpperLimit.value === '') {
      result.value = '请输入轴功率上限';
      return;
    }

    if (newEfficiency >= parseFloat(customEfficiencyLowerLimit.value) && newPower <= parseFloat(customPowerUpperLimit.value)) {
      result.value = '在自定义范围内';
    } else {
      result.value = '不在自定义范围内\n';
      if (newEfficiency < parseFloat(customEfficiencyLowerLimit.value)) {
        result.value += '效率不在范围内\n';
      }
      if (newPower > parseFloat(customPowerUpperLimit.value)) {
        result.value += '轴功率不在范围内';
      }
    }
  }
}


</script>
